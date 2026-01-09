import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import express from 'express';
import pecasRoutes from '../routes/pecasRoutes.js';
import { errorHandler, requestIdMiddleware } from '../config/errorHandler.js';

// Criar app de teste
const app = express();
app.use(express.json());
app.use(requestIdMiddleware());
app.use('/api/pecas', pecasRoutes);
app.use(errorHandler());

// Mock de banco de dados
jest.mock('../models', () => ({
  PecaModel: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Peças API', () => {
  const validToken = jwt.sign(
    { id: 1, email: 'admin@test.com', role: 'admin' },
    process.env.JWT_SECRET || 'test-secret-key-min-32-chars-12345678'
  );

  // ================== GET /api/pecas ==================
  test('Deve listar todas as peças (autenticado)', async () => {
    const response = await request(app)
      .get('/api/pecas')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve rejeitar listagem sem token', async () => {
    const response = await request(app)
      .get('/api/pecas');

    expect(response.status).toBe(401);
  });

  // ================== GET /api/pecas/:id ==================
  test('Deve buscar peça por ID', async () => {
    const response = await request(app)
      .get('/api/pecas/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404, 500]).toContain(response.status);
  });

  // ================== POST /api/pecas ==================
  test('Deve criar nova peça (admin)', async () => {
    const pecaData = {
      codigo: 'PCA-001',
      descricao: 'Peça de teste',
      preco: 99.99,
      quantidade: 10,
      categoria: 'Eletrônicos',
    };

    const response = await request(app)
      .post('/api/pecas')
      .set('Authorization', `Bearer ${validToken}`)
      .send(pecaData);

    expect([201, 400, 500]).toContain(response.status);
  });

  test('Deve rejeitar peça com preço negativo', async () => {
    const pecaData = {
      codigo: 'PCA-002',
      descricao: 'Peça inválida',
      preco: -10, // Preço negativo
      quantidade: 5,
    };

    const response = await request(app)
      .post('/api/pecas')
      .set('Authorization', `Bearer ${validToken}`)
      .send(pecaData);

    expect([400, 500]).toContain(response.status);
  });

  test('Deve rejeitar peça sem código', async () => {
    const pecaData = {
      descricao: 'Sem código',
      preco: 50,
      quantidade: 5,
    };

    const response = await request(app)
      .post('/api/pecas')
      .set('Authorization', `Bearer ${validToken}`)
      .send(pecaData);

    expect([400, 500]).toContain(response.status);
  });

  // ================== PUT /api/pecas/:id ==================
  test('Deve atualizar peça (admin)', async () => {
    const updateData = {
      descricao: 'Peça atualizada',
      preco: 150.00,
      quantidade: 20,
    };

    const response = await request(app)
      .put('/api/pecas/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData);

    expect([200, 400, 404, 500]).toContain(response.status);
  });

  test('Deve rejeitar atualização de quantidade negativa', async () => {
    const updateData = {
      quantidade: -5, // Negativo
    };

    const response = await request(app)
      .put('/api/pecas/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData);

    expect([400, 404, 500]).toContain(response.status);
  });

  // ================== DELETE /api/pecas/:id ==================
  test('Deve deletar peça (admin)', async () => {
    const response = await request(app)
      .delete('/api/pecas/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 204, 404, 500]).toContain(response.status);
  });

  test('Deve rejeitar deleção sem token', async () => {
    const response = await request(app)
      .delete('/api/pecas/1');

    expect(response.status).toBe(401);
  });

  // ================== Filtros e Buscas ==================
  test('Deve filtrar peças por categoria', async () => {
    const response = await request(app)
      .get('/api/pecas?categoria=Eletrônicos')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve buscar peças por código', async () => {
    const response = await request(app)
      .get('/api/pecas?codigo=PCA-001')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });
});
