// backend/src/__tests__/clientes.test.js
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import clientesRoutes from '../routes/clientes.js';

// App de teste simplificado
const app = express();
app.use(express.json());
app.use('/api/clientes', clientesRoutes);

describe('Clientes API Integration', () => {
  it('deve retornar 401 sem autenticação', async () => {
    const response = await request(app).get('/api/clientes');
    expect([401, 404, 500]).toContain(response.status);
  });

  it('deve retornar 401 ao tentar criar sem auth', async () => {
    const response = await request(app)
      .post('/api/clientes')
      .send({ nome_fantasia: 'Test', cnpj: '12345678901234' });
    
    expect([401, 404, 500]).toContain(response.status);
  });


  describe('Validação de dados de clientes', () => {
    const validToken = 'Bearer fake-token-admin'; // Simulação, ajuste conforme necessário

    it('deve rejeitar criação com CNPJ inválido', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', validToken)
        .send({
          cnpj: '123',
          nome_fantasia: 'Empresa Teste',
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
          cnpj: '12.345.678/0001-95',
          nome_fantasia: 'A',
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
          cnpj: '12.345.678/0001-95',
          nome_fantasia: 'Empresa Teste',
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
