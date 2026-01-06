// src/config/sentry.js
// Configuração de Sentry para monitoramento de erros em produção

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry(app) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const dsn = process.env.SENTRY_DSN;

  // Só inicializar Sentry em produção com DSN válido
  if (isDevelopment || !dsn) {
    console.log('ℹ️  Sentry desabilitado (desenvolvimento ou sem DSN)');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% de requisições
    profilesSampleRate: 0.1, // 10% para profiling
    integrations: [
      nodeProfilingIntegration(),
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({
        request: true,
        serverName: true,
        transaction: true,
        user: true
      })
    ],
    beforeSend(event, hint) {
      // Filtrar erros que não queremos reportar
      if (event.exception) {
        const error = hint.originalException;
        
        // Não reportar erros de validação
        if (error?.name === 'ValidationError') {
          return null;
        }
        
        // Não reportar erros 404
        if (error?.statusCode === 404) {
          return null;
        }
      }
      
      return event;
    }
  });

  // Middleware de request tracking
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  console.log('✅ Sentry inicializado');

  return Sentry;
}

// Middleware de erro do Sentry
export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler();
}

// Capturar exceção manualmente
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    contexts: context
  });
}

// Capturar mensagem
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, level);
}

// Set user context
export function setUserContext(user) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.nome_usuario
    });
  } else {
    Sentry.setUser(null);
  }
}
