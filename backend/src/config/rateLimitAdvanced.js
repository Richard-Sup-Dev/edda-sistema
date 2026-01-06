// src/config/rateLimitAdvanced.js
// Rate limiting mais granular e robusto

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

// Criar cliente Redis se disponível (para produção)
let redisClient = null;

try {
  if (process.env.REDIS_URL) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });
    redisClient.connect();
  }
} catch (err) {
  console.log('Redis não disponível, usando memory store');
}

// ========================================
// Rate Limiting por Tipo de Requisição
// ========================================

// Limite geral: 100 requisições por IP a cada 15 minutos
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Whitelist de IPs (localhost para desenvolvimento)
    const whitelistedIPs = process.env.WHITELIST_IPS?.split(',') || ['127.0.0.1', '::1'];
    return whitelistedIPs.includes(req.ip);
  }
});

// Limite de autenticação: 5 tentativas a cada 15 minutos
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos',
  skipSuccessfulRequests: true, // Não contar requisições bem-sucedidas
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:' // Redis key prefix
  }) : undefined
});

// Limite de criação de recursos: 30 por 1 hora
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30,
  message: 'Limite de criação de recursos atingido. Tente novamente em 1 hora',
  keyGenerator: (req) => `${req.user?.id || req.ip}:create`
});

// Limite de upload de arquivos: 10 por 1 hora
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Limite de uploads atingido. Tente novamente em 1 hora',
  keyGenerator: (req) => `${req.user?.id || req.ip}:upload`
});

// Limite de API pública: 1000 por hora
export const publicApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: 'Limite de requisições da API atingido'
});

// ========================================
// Middleware de Verificação de Rate Limit
// ========================================

export const checkRateLimit = (req, res, next) => {
  const remaining = res.getHeader('RateLimit-Remaining');
  const reset = res.getHeader('RateLimit-Reset');

  if (remaining && remaining < 10) {
    res.setHeader('X-RateLimit-Warning', 'Aproximando-se do limite');
  }

  next();
};

// ========================================
// Middleware de Circuit Breaker Simples
// ========================================

class CircuitBreaker {
  constructor(threshold = 50, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.successCount = 0;
    }
  }

  onFailure() {
    this.failureCount++;
    this.successCount = 0;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount
    };
  }
}

export default CircuitBreaker;
