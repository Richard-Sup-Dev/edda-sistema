import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock do authMiddleware ANTES de importar as rotas
vi.mock('../middlewares/authMiddleware.js', () => ({
  __esModule: true,
  default: (req, res, next) => {
    if (req.headers.authorization) {
      req.user = { id: 1, nome: 'Test', email: 'test@test.com', role: 'admin' };
      return next();
    }
    return res.status(401).json({ erro: 'Token de acesso ausente ou inválido.' });
  }
}));

import relatoriosRoutes from '../routes/relatoriosRoutes.js';

const app = express();
app.use(express.json());




app.use('/api/relatorios', relatoriosRoutes);

describe('Validação de dados de relatórios', () => {
  const validToken = 'Bearer fake-token-admin'; // Simulação, ajuste conforme necessário

  it('deve rejeitar criação sem cliente_id', async () => {
    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', validToken)
      .send({ os_numero: '123', data_inicio: '2024-01-01', data_fim: '2024-01-02', descricao_servico: 'Teste de serviço' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('deve rejeitar data_fim anterior à data_inicio', async () => {
    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', validToken)
      .send({ cliente_id: 1, os_numero: '123', data_inicio: '2024-01-02', data_fim: '2024-01-01', descricao_servico: 'Teste de serviço' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('deve rejeitar descrição muito curta', async () => {
    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', validToken)
      .send({ cliente_id: 1, os_numero: '123', data_inicio: '2024-01-01', data_fim: '2024-01-02', descricao_servico: 'curto' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('deve rejeitar status inválido', async () => {
    const response = await request(app)
      .post('/api/relatorios')
      .set('Authorization', validToken)
      .send({ cliente_id: 1, os_numero: '123', data_inicio: '2024-01-01', data_fim: '2024-01-02', descricao_servico: 'Descrição válida para serviço', status: 'inexistente' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });
});
