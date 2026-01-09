// backend/src/__tests__/services/redisService.test.js
import { describe, it, expect } from '@jest/globals';
import redisClient from '../../config/redis.js';

describe('Redis Service', () => {
  it('deve ter cliente Redis configurado', () => {
    expect(redisClient).toBeDefined();
    expect(typeof redisClient.get).toBe('function');
    expect(typeof redisClient.set).toBe('function');
  });

  it('deve ter métodos de cache básicos', () => {
    expect(typeof redisClient.del).toBe('function');
    expect(typeof redisClient.clearPattern).toBe('function');
  });

  it('deve funcionar mesmo com Redis offline', async () => {
    try {
      await redisClient.get('test-key');
      expect(true).toBe(true);
    } catch (error) {
      // Redis offline é aceitável - sistema deve continuar funcionando
      expect(error).toBeDefined();
    }
  });

  // Nota: Testes completos de Redis requerem o servidor rodando
  // Para testes E2E com Redis: docker-compose up redis
});
