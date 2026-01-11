import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('Validação de dados de usuários', () => {
  const validToken = 'Bearer fake-token-admin'; // Simulação, ajuste conforme necessário

  it('deve rejeitar criação sem nome', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', validToken)
      .send({ email: 'user@email.com', senha: '123456' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('deve rejeitar criação com email inválido', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', validToken)
      .send({ nome: 'Usuário', email: 'email-invalido', senha: '123456' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('deve rejeitar criação com senha curta', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', validToken)
      .send({ nome: 'Usuário', email: 'user@email.com', senha: '123' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });

  it('deve rejeitar role inválida', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', validToken)
      .send({ nome: 'Usuário', email: 'user@email.com', senha: '123456', role: 'superadmin' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });
});
