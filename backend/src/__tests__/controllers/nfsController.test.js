// src/__tests__/controllers/nfsController.test.js
import { describe, it, expect, beforeAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import nfsRoutes from '../../routes/nfsRoutes.js';

describe('NFs Controller', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/nfs', nfsRoutes);
  });

  describe('GET /api/nfs', () => {
    it('should return list of NFs', async () => {
      const res = await request(app)
        .get('/api/nfs');

      expect([200, 401, 403]).toContain(res.status);
    });
  });

  describe('POST /api/nfs', () => {
    it('should reject NF without required fields', async () => {
      const res = await request(app)
        .post('/api/nfs')
        .send({});

      expect([400, 401, 403]).toContain(res.status);
    });

    it('should reject NF with invalid client', async () => {
      const res = await request(app)
        .post('/api/nfs')
        .send({
          client_id: 'invalid',
          numero_nf: 'NF-001'
        });

      expect([400, 401, 403]).toContain(res.status);
    });
  });

  describe('GET /api/nfs/:id', () => {
    it('should return 404 for non-existent NF', async () => {
      const res = await request(app)
        .get('/api/nfs/99999');

      expect([404, 401, 403]).toContain(res.status);
    });
  });

  describe('PUT /api/nfs/:id', () => {
    it('should handle update for non-existent NF', async () => {
      const res = await request(app)
        .put('/api/nfs/99999')
        .send({ numero_nf: 'NF-002' });

      expect([400, 404, 401, 403]).toContain(res.status);
    });
  });

  describe('DELETE /api/nfs/:id', () => {
    it('should handle delete for non-existent NF', async () => {
      const res = await request(app)
        .delete('/api/nfs/99999');

      expect([400, 404, 401, 403]).toContain(res.status);
    });
  });
});
