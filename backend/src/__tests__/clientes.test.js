// backend/src/__tests__/clientes.test.js
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

import clientesRoutes from '../routes/clientes.js';

// App de teste simplificado
const app = express();
app.use(express.json());




app.use('/api/clientes', clientesRoutes);

describe('Clientes API Integration', () => {
  it('deve retornar 401 sem autenticação', async () => {
    const response = await request(app).get('/api/clientes');
    expect(response.status).toBe(401);
  });

  it('deve retornar 401 ao tentar criar sem auth', async () => {
    const response = await request(app)
      .post('/api/clientes')
      .send({ nome_fantasia: 'Test', cnpj: '12345678901234' });
    
    expect(response.status).toBe(401);
  });

  it('deve retornar 401 ao tentar criar sem auth e com dados inválidos', async () => {
    const response = await request(app)
      .post('/api/clientes')
      .send({}); // corpo vazio, inválido
    expect(response.status).toBe(401);
    // Não há body.erro pois não chega na validação
  });

  describe('Validação de dados de clientes', () => {
    const validToken = 'Bearer fake-token-admin'; // Simulação, ajuste conforme necessário

    it('deve rejeitar criação com CNPJ inválido', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', validToken)
        .send({
          nome_fantasia: 'Empresa Teste',
          cnpj: '12345678901234',
          email: 'contato@empresa.com'
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    it('deve rejeitar criação com nome fantasia muito curto', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', validToken)
        .send({
          nome_fantasia: 'A',
          cnpj: '12345678000195',
          email: 'contato@empresa.com'
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    it('deve rejeitar criação com email inválido', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', validToken)
        .send({
          nome_fantasia: 'Empresa Teste',
          cnpj: '12345678000195',
          email: 'email-invalido'
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    it('deve rejeitar criação sem campos obrigatórios', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', validToken)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    it('deve rejeitar atualização com estado inválido', async () => {
      const response = await request(app)
        .put('/api/clientes/1')
        .set('Authorization', validToken)
        .send({
          estado: 'SPX'
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });
  });
  });
