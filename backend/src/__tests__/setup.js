// backend/src/__tests__/setup.js

// Configurar timeout global para testes Vitest
setTimeout(() => {}, 0); // No Vitest, use testTimeout no vitest.config.js

// Mock de variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'edda_test';
process.env.DB_USER = 'edda_user';
process.env.DB_PASSWORD = 'edda_password';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

import { vi } from 'vitest';
// Suprimir logs durante testes (opcional)
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
