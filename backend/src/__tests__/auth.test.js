import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import models from '../models/index.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from '../routes/auth.js';

const { sequelize, User } = models;

// Criar um app de teste mínimo
const testApp = express();
testApp.use(helmet());
testApp.use(cors());
testApp.use(express.json());
testApp.use('/api/auth', authRoutes);

// ============================================
// SETUP GLOBAL - EXECUTADO UMA VEZ
// ============================================
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Banco de dados de teste conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de testes:', error);
    throw error;
  }
});
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexão com banco de testes fechada');
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error);
  }
});
// ============================================
// TESTES DE REGISTRO
// ============================================
describe('Auth Controller - POST /api/auth/register', () => {

  it('Deve registrar um novo usuário com sucesso', async () => {
    const response = await request(testApp)
      .post('/api/auth/register')
      .send({
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'senha123456'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('mensagem');
    expect(response.body.usuario).toHaveProperty('email', 'joao@example.com');
  });

  it('Deve rejeitar registro com email duplicado', async () => {
    // Primeiro registro
    await request(testApp)
      .post('/api/auth/register')
      .send({
        nome: 'Maria Silva',
        email: 'maria@example.com',
        senha: 'senha123456'
      });

    // Tentativa de registro duplicado
    const response = await request(testApp)
      .post('/api/auth/register')
      .send({
        nome: 'Outro Usuário',
        email: 'maria@example.com',
        senha: 'outresenha123'
      });

    expect(response.status).toBe(400);
    expect(response.body.erro).toContain('já está cadastrado');
  });

  it('Deve rejeitar registro com email inválido', async () => {
    const response = await request(testApp)
      .post('/api/auth/register')
      .send({
        nome: 'Test User',
        email: 'email-invalido',
        senha: 'senha123456'
      });

    expect(response.status).toBe(400);
  });

  it('Deve rejeitar registro com senha muito curta', async () => {
    const response = await request(testApp)
      .post('/api/auth/register')
      .send({
        nome: 'Test User',
        email: 'test@example.com',
        senha: '123'
      });

    expect(response.status).toBe(400);
    expect(response.body.erro).toContain('mínimo');
  });
});

// ============================================
// TESTES DE LOGIN
// ============================================
describe('Auth Controller - POST /api/auth/login', () => {
  beforeAll(async () => {
    // Timeout aumentado para 30s
  }, 30000);
    try {
      // Criar usuário de teste para login
      const bcrypt = (await import('bcryptjs')).default;
      const hash = await bcrypt.hash('teste123456', 12);
      await User.create({
        nome: 'Test User',
        email: 'test@example.com',
        senha: hash,
        role: 'user'
      });
      console.log('✅ Usuário de teste criado para login');
    } catch (error) {
      console.error('❌ Erro ao criar usuário de teste:', error.message);
    }
  });

  it('Deve fazer login com credenciais corretas', async () => {
    const response = await request(testApp)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        senha: 'teste123456'
      });
    if (response.status !== 200) {
      console.log('DEBUG - Status:', response.status);
      console.log('DEBUG - Body:', response.body);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('Deve rejeitar login com email incorreto', async () => {
    const response = await request(testApp)
      .post('/api/auth/login')
      .send({
        email: 'naoexiste@example.com',
        senha: 'teste123456'
      });

    expect(response.status).toBe(401);
    expect(response.body.erro).toBeDefined();
  });

  it('Deve rejeitar login com senha incorreta', async () => {
    const response = await request(testApp)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        senha: 'senhaerrada'
      });

    expect(response.status).toBe(401);
    expect(response.body.erro).toBeDefined();
  });
});
