import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import models from '../models/index.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import clientesRoutes from '../routes/clientes.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import bcrypt from 'bcryptjs';

const { sequelize, User } = models;

// Mock do middleware de auth para testes
const mockAuth = (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
};

// Criar um app de teste mínimo
const testApp = express();
testApp.use(helmet());
testApp.use(cors());
testApp.use(express.json());
testApp.use(mockAuth); // Usar mock auth
testApp.use('/api/clientes', clientesRoutes);

describe('Clientes Controller - CRUD', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
      
      // Criar usuário admin para testes
      const hash = await bcrypt.hash('admin123456', 12);
      await User.create({
        nome: 'Admin Test',
        email: 'admin@test.com',
        senha: hash,
        role: 'admin'
      });
    } catch (error) {
      console.error('Erro ao configurar testes:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('Deve listar todos os clientes', async () => {
    const response = await request(testApp)
      .get('/api/clientes')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve criar um novo cliente com CNPJ válido', async () => {
    const response = await request(testApp)
      .post('/api/clientes')
      .send({
        cnpj: '11222333000181',
        nome_fantasia: 'Empresa Teste LTDA',
        email: 'contato@empresateste.com',
        telefone: '1122334455'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nome_fantasia).toBe('Empresa Teste LTDA');
  });

  it('Deve rejeitar cliente com CNPJ inválido', async () => {
    const response = await request(testApp)
      .post('/api/clientes')
      .send({
        cnpj: '00000000000000',
        nome_fantasia: 'Empresa Inválida',
        email: 'invalido@test.com',
        telefone: '1122334455'
      })
      .expect(400);

    expect(response.body.erro).toBeDefined();
  });

  it('Deve rejeitar cliente com email inválido', async () => {
    const response = await request(testApp)
      .post('/api/clientes')
      .send({
        cnpj: '11222333000181',
        nome_fantasia: 'Empresa Teste',
        email: 'email-invalido',
        telefone: '1122334455'
      })
      .expect(400);

    expect(response.body.erro).toBeDefined();
  });

  it('Deve atualizar um cliente existente', async () => {
    // Primeiro criar um cliente
    const createResponse = await request(testApp)
      .post('/api/clientes')
      .send({
        cnpj: '11222333000181',
        nome_fantasia: 'Empresa Original',
        email: 'original@test.com',
        telefone: '1122334455'
      });

    const clienteId = createResponse.body.id;

    // Atualizar o cliente
    const updateResponse = await request(testApp)
      .put(`/api/clientes/${clienteId}`)
      .send({
        cnpj: '11222333000181',
        nome_fantasia: 'Empresa Atualizada',
        email: 'atualizado@test.com',
        telefone: '1199887766'
      })
      .expect(200);

    expect(updateResponse.body.nome_fantasia).toBe('Empresa Atualizada');
  });

  it('Deve excluir um cliente', async () => {
    // Criar um cliente
    const createResponse = await request(testApp)
      .post('/api/clientes')
      .send({
        cnpj: '11222333000181',
        nome_fantasia: 'Empresa para Deletar',
        email: 'deletar@test.com',
        telefone: '1122334455'
      });

    const clienteId = createResponse.body.id;

    // Deletar o cliente
    const deleteResponse = await request(testApp)
      .delete(`/api/clientes/${clienteId}`)
      .expect(200);

    expect(deleteResponse.body.mensagem).toContain('deletado');
  });
});
