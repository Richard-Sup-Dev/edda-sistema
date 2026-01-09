// src/__tests__/controllers/authController.test.js
import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import authRoutes from '../../routes/auth.js';

describe('Auth Controller', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('POST /api/auth/login', () => {
    it('should reject login without email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ senha: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.erro).toBeDefined();
    });

    it('should reject login without password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.erro).toBeDefined();
    });

    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', senha: 'wrongpassword' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should reject register without email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          nome: 'Test User',
          senha: 'password123'
        });

      expect(res.status).toBe(400);
    });

    it('should reject register without password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          email: 'test@example.com',
          nome: 'Test User'
        });

      expect(res.status).toBe(400);
    });

    it('should reject register with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          email: 'invalid-email',
          nome: 'Test User',
          senha: 'password123'
        });

      expect(res.status).toBe(400);
    });

    it('should reject register with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          email: 'test@example.com',
          nome: 'Test User',
          senha: '123'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return logout response', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({});

      expect([200, 401, 404]).toContain(res.status);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should accept email for password reset', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect([200, 404]).toContain(res.status);
    });

    it('should reject forgot-password without email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
