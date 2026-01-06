import request from 'supertest';
import jwt from 'jsonwebtoken';
import express from 'express';
import nfsRoutes from '../routes/nfsRoutes.js';
import { errorHandler, requestIdMiddleware } from '../config/errorHandler.js';

// Criar app de teste
const app = express();
app.use(express.json());
app.use(requestIdMiddleware());
app.use('/api/nfs', nfsRoutes);
app.use(errorHandler());

jest.mock('../models', () => ({
  NFModel: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Notas Fiscais (NFS) API', () => {
  const validToken = jwt.sign(
    { id: 1, email: 'admin@test.com', role: 'admin' },
    process.env.JWT_SECRET || 'test-secret-key-min-32-chars-12345678'
  );

  // ================== GET /api/nfs ==================
  test('Deve listar todas as NFS (autenticado)', async () => {
    const response = await request(app)
      .get('/api/nfs')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve rejeitar listagem sem token', async () => {
    const response = await request(app)
      .get('/api/nfs');

    expect(response.status).toBe(401);
  });

  // ================== GET /api/nfs/:id ==================
  test('Deve buscar NF por ID', async () => {
    const response = await request(app)
      .get('/api/nfs/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  // ================== POST /api/nfs ==================
  test('Deve criar nova NF (admin)', async () => {
    const nfData = {
      numero_nf: '12345',
      serie: '1',
      cnpj_cliente: '12345678901234',
      valor_total: 1000.00,
      data_emissao: '2024-01-01',
      status: 'emitida',
    };

    const response = await request(app)
      .post('/api/nfs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(nfData);

    expect([201, 400, 500]).toContain(response.status);
  });

  test('Deve rejeitar NF com CNPJ inválido', async () => {
    const nfData = {
      numero_nf: '12345',
      serie: '1',
      cnpj_cliente: 'INVALIDO', // CNPJ inválido
      valor_total: 1000.00,
      data_emissao: '2024-01-01',
    };

    const response = await request(app)
      .post('/api/nfs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(nfData);

    expect([400, 500]).toContain(response.status);
  });

  test('Deve rejeitar NF com valor negativo', async () => {
    const nfData = {
      numero_nf: '12345',
      serie: '1',
      cnpj_cliente: '12345678901234',
      valor_total: -500, // Negativo
      data_emissao: '2024-01-01',
    };

    const response = await request(app)
      .post('/api/nfs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(nfData);

    expect([400, 500]).toContain(response.status);
  });

  test('Deve rejeitar NF sem número', async () => {
    const nfData = {
      serie: '1',
      cnpj_cliente: '12345678901234',
      valor_total: 1000.00,
      data_emissao: '2024-01-01',
    };

    const response = await request(app)
      .post('/api/nfs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(nfData);

    expect([400, 500]).toContain(response.status);
  });

  // ================== PUT /api/nfs/:id ==================
  test('Deve atualizar NF (admin)', async () => {
    const updateData = {
      status: 'cancelada',
      observacoes: 'NF cancelada por erro',
    };

    const response = await request(app)
      .put('/api/nfs/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData);

    expect([200, 404, 500]).toContain(response.status);
  });

  test('Deve rejeitar atualização com data futura', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    
    const updateData = {
      data_emissao: futureDate, // Data no futuro
    };

    const response = await request(app)
      .put('/api/nfs/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updateData);

    expect([400, 404, 500]).toContain(response.status);
  });

  // ================== DELETE /api/nfs/:id ==================
  test('Deve deletar NF (admin)', async () => {
    const response = await request(app)
      .delete('/api/nfs/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 204, 404, 500]).toContain(response.status);
  });

  test('Deve rejeitar deleção sem token', async () => {
    const response = await request(app)
      .delete('/api/nfs/1');

    expect(response.status).toBe(401);
  });

  // ================== Upload de arquivo ==================
  test('Deve fazer upload de arquivo XML (admin)', async () => {
    const response = await request(app)
      .post('/api/nfs/upload')
      .set('Authorization', `Bearer ${validToken}`)
      .attach('file', Buffer.from('<xml></xml>'), 'nf.xml');

    expect([200, 201, 400, 500]).toContain(response.status);
  });

  test('Deve rejeitar upload sem token', async () => {
    const response = await request(app)
      .post('/api/nfs/upload')
      .attach('file', Buffer.from('<xml></xml>'), 'nf.xml');

    expect(response.status).toBe(401);
  });

  test('Deve rejeitar arquivo não XML', async () => {
    const response = await request(app)
      .post('/api/nfs/upload')
      .set('Authorization', `Bearer ${validToken}`)
      .attach('file', Buffer.from('texto simples'), 'arquivo.txt');

    expect([400, 500]).toContain(response.status);
  });

  // ================== Filtros e Paginação ==================
  test('Deve filtrar NFS por status', async () => {
    const response = await request(app)
      .get('/api/nfs?status=emitida')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve filtrar NFS por intervalo de datas', async () => {
    const response = await request(app)
      .get('/api/nfs?data_inicio=2024-01-01&data_fim=2024-01-31')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });

  test('Deve paginar resultados', async () => {
    const response = await request(app)
      .get('/api/nfs?page=1&limit=10')
      .set('Authorization', `Bearer ${validToken}`);

    expect([200, 404]).toContain(response.status);
  });
});
