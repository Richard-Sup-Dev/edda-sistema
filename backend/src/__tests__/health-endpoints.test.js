// backend/src/__tests__/health.test.js
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import express from 'express';
import healthRoutes from '../routes/health.js';

// Criar app de teste
const app = express();
app.use('/health', healthRoutes);

describe('Health Check Endpoints', () => {
  describe('GET /health/ping', () => {
    it('Deve retornar 200 OK com status e uptime', async () => {
      const response = await request(app).get('/health/ping');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('GET /health/live', () => {
    it('Deve retornar 200 se aplicação está viva', async () => {
      const response = await request(app).get('/health/live');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /health/ready', () => {
    it('Deve verificar status de database e redis', async () => {
      const response = await request(app).get('/health/ready');

      // Pode ser 200 (pronto) ou 503 (não pronto)
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('redis');
      expect(response.body.checks).toHaveProperty('overall');
    });
  });

  describe('GET /health', () => {
    it('Deve retornar diagnóstico detalhado', async () => {
      const response = await request(app).get('/health');

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('redis');
    });

    it('Deve incluir latência nos checks', async () => {
      const response = await request(app).get('/health');

      expect(response.body.checks.database).toHaveProperty('latency');
      expect(response.body.checks.redis).toHaveProperty('latency');
      expect(typeof response.body.checks.database.latency).toBe('number');
      expect(typeof response.body.checks.redis.latency).toBe('number');
    });
  });
});
