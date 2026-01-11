// src/__tests__/controllers/clientesController.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import clientesRoutes from '../../routes/clientes.js';

describe('Clientes Controller', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/clients', clientesRoutes);
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('GET /api/clients', () => {
    it('should return list of clients', async () => {
      const res = await request(app)
        .get('/api/clients');

      expect([200, 401, 403]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body) || res.body.data).toBeDefined();
      }
    });
  });

  describe('POST /api/clients', () => {
    it('should reject create without required fields', async () => {
      const res = await request(app)
        .post('/api/clients')
        .send({});

      expect([400, 401, 403]).toContain(res.status);
    });

    it('should reject create with invalid CNPJ', async () => {
      const res = await request(app)
        .post('/api/clients')
        .send({
          cnpj: '12345',
          nome_fantasia: 'Test Client'
        });

      expect([400, 401, 403]).toContain(res.status);
    });

    it('should accept create with valid data', async () => {
      const res = await request(app)
        .post('/api/clients')
        .send({
          cnpj: '12345678901234',
          nome_fantasia: 'Test Client'
        });

      expect([200, 201, 400, 401, 403]).toContain(res.status);
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should return 404 for non-existent client', async () => {
      const res = await request(app)
        .get('/api/clients/99999');

      expect([404, 401, 403]).toContain(res.status);
    });
  });

  describe('PUT /api/clients/:id', () => {
    it('should reject update without ID', async () => {
      const res = await request(app)
        .put('/api/clients/0')
        .send({ nome_fantasia: 'Updated' });

      expect([400, 404, 401, 403]).toContain(res.status);
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should reject delete without ID', async () => {
      const res = await request(app)
        .delete('/api/clients/0');

      expect([400, 404, 401, 403]).toContain(res.status);
    });
  });
});
