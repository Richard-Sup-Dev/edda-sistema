// backend/src/__tests__/setup.js
import { jest } from '@jest/globals';

// Configurar timeout global
jest.setTimeout(30000);

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

// Suprimir logs durante testes (opcional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
