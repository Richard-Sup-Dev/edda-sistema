// backend/src/__tests__/relatorios.test.js
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

// App de teste simplificado
const app = express();
app.use(express.json());




app.use('/api/relatorios', relatoriosRoutes);

describe('Relatórios API Integration', () => {
  it('deve retornar 401 sem autenticação', async () => {
    const response = await request(app).get('/api/relatorios');
    expect(response.status).toBe(401);
  });

  it('deve retornar 401 ao tentar criar sem auth', async () => {
    const response = await request(app)
      .post('/api/relatorios')
      .send({ os_numero: '123' });
    
    expect(response.status).toBe(401);
  });

  it('deve retornar 401 ao tentar criar sem auth e com dados inválidos', async () => {
    const response = await request(app)
      .post('/api/relatorios')
      .send({}); // corpo vazio, inválido
    expect(response.status).toBe(401);
  });

  // Nota: Testes completos com autenticação requerem setup complexo
  // Para testes E2E: usar tokens JWT reais e banco de teste
});
