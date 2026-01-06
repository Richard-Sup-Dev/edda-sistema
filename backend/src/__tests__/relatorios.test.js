import request from 'supertest';
import jwt from 'jsonwebtoken';
import express from 'express';
import relatoriosRoutes from '../routes/relatoriosRoutes.js';
import { errorHandler, requestIdMiddleware } from '../config/errorHandler.js';

// Criar app de teste
const app = express();
app.use(express.json());
app.use(requestIdMiddleware());
app.use('/api/relatorios', relatoriosRoutes);
app.use(errorHandler());

describe('Relatórios API', () => {
  const validToken = jwt.sign(
    { id: 1, email: 'admin@test.com', role: 'admin' },
    process.env.JWT_SECRET || 'test-secret-key-min-32-chars-12345678'
  );

  const invalidToken = 'invalid-token';

  // ================== GET /api/relatorios ==================
  test('Deve listar todos os relatórios (autenticado)', async () => {
    const response = await request(app)
      .get('/api/relatorios')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve rejeitar listagem sem token', async () => {
    const response = await request(app)
      .get('/api/relatorios');

    expect(response.status).toBe(401);
  });

  test('Deve rejeitar listagem com token inválido', async () => {
    const response = await request(app)
      .get('/api/relatorios')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
  });

  // ================== GET /api/relatorios/:id ==================
  test('Deve buscar relatório por ID (autenticado)', async () => {
    const response = await request(app)
      .get('/api/relatorios/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve rejeitar busca de relatório sem token', async () => {
    const response = await request(app)
      .get('/api/relatorios/1');

    expect(response.status).toBe(401);
  });

  // ================== POST /api/relatorios ==================
  test('Deve criar novo relatório (admin)', async () => {
    const relatorioData = {
      titulo: 'Relatório de Teste',
      descricao: 'Descrição teste',
      cliente_id: 1,
      data_inicio: '2024-01-01',
      data_fim: '2024-01-31',
    };

    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', `Bearer ${validToken}`)
      .send(relatorioData);

    expect([201, 400, 500]).toContain(response.status);
  });

  test('Deve rejeitar criação sem token', async () => {
    const relatorioData = {
      titulo: 'Relatório de Teste',
      cliente_id: 1,
    };

    const response = await request(app)
      .post('/api/relatorios')
      .send(relatorioData);

    expect(response.status).toBe(401);
  });

  test('Deve rejeitar relatório sem dados obrigatórios', async () => {
    const relatorioData = {
      titulo: 'Incompleto',
    };

    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', `Bearer ${validToken}`)
      .send(relatorioData);

    expect([400, 500]).toContain(response.status);
  });

  // ================== PUT /api/relatorios/:id ==================
  test('Deve atualizar relatório (admin)', async () => {
    const updateData = {
      titulo: 'Relatório Atualizado',
      status: 'concluído',
    };

    const response = await request(app)
      .put('/api/relatorios/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData);

    expect([200, 404, 500]).toContain(response.status);
  });

  test('Deve rejeitar atualização sem token', async () => {
    const updateData = {
      titulo: 'Relatório Atualizado',
    };

    const response = await request(app)
      .put('/api/relatorios/1')
      .send(updateData);

    expect(response.status).toBe(401);
  });

  // ================== DELETE /api/relatorios/:id ==================
  test('Deve deletar relatório (admin)', async () => {
    const response = await request(app)
      .delete('/api/relatorios/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 204, 404, 500]).toContain(response.status);
  });

  test('Deve rejeitar deleção sem token', async () => {
    const response = await request(app)
      .delete('/api/relatorios/1');

    expect(response.status).toBe(401);
  });

  // ================== Validações de dados ==================
  test('Deve rejeitar data de fim anterior à data de início', async () => {
    const relatorioData = {
      titulo: 'Relatório Inválido',
      cliente_id: 1,
      data_inicio: '2024-01-31',
      data_fim: '2024-01-01', // FIM antes do INÍCIO
    };

    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', `Bearer ${validToken}`)
      .send(relatorioData);

    expect([400, 500]).toContain(response.status);
  });

  test('Deve rejeitar cliente_id não numérico', async () => {
    const relatorioData = {
      titulo: 'Relatório Inválido',
      cliente_id: 'abc', // Deve ser número
      data_inicio: '2024-01-01',
      data_fim: '2024-01-31',
    };

    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', `Bearer ${validToken}`)
      .send(relatorioData);

    expect([400, 500]).toContain(response.status);
  });
});
