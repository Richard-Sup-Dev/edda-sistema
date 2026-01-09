// backend/src/config/errorHandler.js
// Sistema robusto de tratamento de erros

import logger from './logger.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/**
 * Tipos de erros customizados
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Autenticação falhou') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito nos dados') {
    super(message, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Erro ao acessar banco de dados') {
    super(message, 500);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service = 'Serviço externo', message = 'falhou') {
    super(`${service} ${message}`, 503);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Limite de requisições excedido') {
    super(message, 429);
  }
}

/**
 * Retry logic para operações que podem falhar temporariamente
 */
export async function retryOperation(
  operation,
  options = {}
) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    name = 'Operation'
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`${name} - Tentativa ${attempt}/${maxRetries}`);
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        logger.warn(`${name} falhou, aguardando ${waitTime}ms antes de tentar novamente`, {
          attempt,
          error: error.message
        });
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw new Error(`${name} falhou após ${maxRetries} tentativas: ${lastError.message}`);
}

/**
 * Circuit Breaker para proteger contra falhas em cascata
 */
export class CircuitBreaker {
  constructor(operation, options = {}) {
    this.operation = operation;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.threshold = options.threshold || 5;
    this.timeout = options.timeout || 60000; // 1 minuto
    this.lastFailureTime = null;
  }

  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        logger.info('Circuit breaker mudou para HALF_OPEN');
      } else {
        throw new Error('Circuit breaker está OPEN');
      }
    }

    try {
      const result = await this.operation(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logger.info('Circuit breaker mudou para CLOSED');
    }
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      logger.error('Circuit breaker mudou para OPEN');
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      threshold: this.threshold
    };
  }
}

/**
 * Middleware para capturar erros async
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Formatador de erro para resposta
 */
export function formatErrorResponse(error, isDevelopment = false) {
  const response = {
    erro: error.message,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString(),
    requestId: error.requestId
  };

  // Adicionar detalhes em desenvolvimento
  if (isDevelopment) {
    response.stack = error.stack;
    response.details = error.details;
  }

  // Não expor stack trace em produção
  if (error.statusCode && error.statusCode < 500) {
    // Erros de client (4xx) são seguros para mostrar detalhes
    if (error.details) {
      response.detalhes = error.details;
    }
  }

  return response;
}

/**
 * Middleware global de error handling
 */
export function errorHandler() {
  return (error, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const statusCode = error.statusCode || 500;

    // Log estruturado do erro
    const errorContext = {
      message: error.message,
      statusCode,
      type: error.name,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userId: req.user?.id,
      requestId: req.id,
      timestamp: new Date().toISOString()
    };

    if (isDevelopment) {
      errorContext.stack = error.stack;
    }

    // Log com nível apropriado
    if (statusCode >= 500) {
      logger.error('Request Error (5xx)', errorContext);
    } else if (statusCode >= 400) {
      logger.warn('Request Error (4xx)', errorContext);
    } else {
      logger.info('Request Error', errorContext);
    }

    // Responder ao cliente
    const errorResponse = formatErrorResponse(error, isDevelopment);
    errorResponse.requestId = req.id;

    res.status(statusCode).json(errorResponse);
  };
}

/**
 * Middleware para adicionar ID único a cada requisição
 */
export function requestIdMiddleware() {
  return (req, res, next) => {
    const { v4: uuidv4 } = require('uuid');
    req.id = uuidv4();
    res.setHeader('X-Request-ID', req.id);
    next();
  };
}

/**
 * Tratamento de unhandled rejections
 */
export function setupGlobalErrorHandlers(logger) {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack
    });
    // Não fazer process.exit() aqui - deixar aplicação rodar
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack
    });
    // Fazer graceful shutdown
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM recebido - iniciando graceful shutdown');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT recebido - iniciando graceful shutdown');
    process.exit(0);
  });
}

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  retryOperation,
  CircuitBreaker,
  asyncHandler,
  formatErrorResponse,
  errorHandler,
  requestIdMiddleware,
  setupGlobalErrorHandlers
};
