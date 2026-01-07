// src/server.js - Versão ESM (Otimizada)

import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import bcrypt from 'bcryptjs';
import models from './models/index.js';
import logger from './config/logger.js';
import { validateEnvironment } from './config/validateEnv.js';
import { 
  errorHandler, 
  requestIdMiddleware, 
  setupGlobalErrorHandlers 
} from './config/errorHandler.js';

// Swagger (quando instalado)
let swaggerUi, swaggerJsdoc, swaggerSpec;
try {
  swaggerUi = await import('swagger-ui-express').then(m => m.default);
  swaggerJsdoc = await import('swagger-jsdoc').then(m => m.default);
  const swaggerConfig = await import('./swagger.config.js').then(m => m.default);
  swaggerSpec = swaggerJsdoc(swaggerConfig);
} catch (err) {
  logger.info('Swagger não disponível - instale com: npm install swagger-jsdoc swagger-ui-express');
}

const { sequelize, User } = models;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === IMPORTAÇÃO DAS ROTAS ===
import relatoriosRoutes from './routes/relatoriosRoutes.js';
import authRoutes from './routes/auth.js';
import financeiroRoutes from './routes/financeiroRoutes.js';
import pecasRoutes from './routes/pecasRoutes.js';
import servicosRoutes from './routes/servicosRoutes.js';
import clientesRoutes from './routes/clientes.js';
import adminRoutes from './routes/adminRoutes.js';
import nfsRoutes from './routes/nfsRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

// === CONFIGURAÇÃO DINÂMICA DE CORS ===
// Suporta variantes com/sem porta (ex: http://localhost e http://localhost:80)
const allowedOriginsRaw = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Normalize allowed origins: keep original and hostname-only variant
const allowedOriginsSet = new Set();
allowedOriginsRaw.forEach(o => {
  allowedOriginsSet.add(o);
  try {
    const u = new URL(o);
    allowedOriginsSet.add(`${u.protocol}//${u.hostname}`);
  } catch (e) {
    // ignore invalid URL parse
  }
});

// === MIDDLEWARES ===
// Adicionar ID único a cada requisição
app.use(requestIdMiddleware());

// Security headers com Helmet
app.use(helmet());

// === RATE LIMITING ===
// Proteção contra ataques de força bruta e DDoS
const limiterGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP por janela de 15 minutos
  message: 'Muitas requisições, tente novamente mais tarde.',
  standardHeaders: true, // Retorna rate limit info nos headers
  skip: (req) => {
    // Não limitar GET /api/test
    return req.method === 'GET' && req.path === '/api/test';
  }
});

// Rate limiting mais restritivo para autenticação (previne brute force)
const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP em 15 minutos
  message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  standardHeaders: true,
  skip: (req) => req.method !== 'POST'
});

// Aplicar rate limit geral
app.use(limiterGeral);

// Aplicar rate limit restritivo para auth
app.use('/api/auth', limiterAuth);

// CORS com validação de origem
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOriginsSet.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS não permitido para: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Capture raw body for debugging (verify) while still parsing JSON
app.use(express.json({
  limit: '100mb',
  verify: (req, res, buf) => {
    try {
      req.rawBody = buf.toString();
    } catch (e) {
      req.rawBody = undefined;
    }
  }
}));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Servir uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// === HEALTH CHECK ===
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// === SWAGGER API DOCUMENTATION ===
if (swaggerUi && swaggerSpec) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'EDDA Sistema API Docs'
  }));
  logger.info('📚 Swagger docs disponível em: /api-docs');
}

// === ROTAS ===
/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 data:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 */
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/pecas', pecasRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nfs', nfsRoutes);

// Rota de saúde/teste
app.get('/api/test', (req, res) => {
  res.json({ 
    mensagem: 'EDDA 2025 RODANDO!', 
    data: new Date().toISOString(),
    status: 'OK'
  });
});

// === TRATAMENTO DE ROTAS NÃO ENCONTRADAS (404) ===
app.use('*', (req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// === ERROR HANDLER GLOBAL (deve ser o último middleware) ===
app.use(errorHandler());

// === INICIALIZAÇÃO ===
(async () => {
  try {
    // Setup de handlers de erro global
    setupGlobalErrorHandlers(logger);
    
    // Validar variáveis de ambiente antes de qualquer coisa
    validateEnvironment();
    
    await sequelize.authenticate();
    logger.info('✅ Conectado ao PostgreSQL com sucesso!');

    await sequelize.sync({ alter: true });
    logger.info('✅ Modelos Sequelize sincronizados.');

    const adminExiste = await User.findOne({ where: { email: 'admin@edda.com' } });

    if (!adminExiste) {
      const hash = await bcrypt.hash('Admin@2025EDDA', 12);
      await User.create({
        nome: 'Administrador EDDA',
        email: 'admin@edda.com',
        senha: hash,
        role: 'admin'
      });
      logger.info('✅ Admin criado: admin@edda.com / Admin@2025EDDA');
    } else {
      logger.info('✅ Admin já existe.');
    }

    app.listen(port, '0.0.0.0', () => {
      logger.info('');
      logger.info('🚀 SERVIDOR EDDA RODANDO COM SUCESSO!');
      logger.info(`📍 Listening on http://0.0.0.0:${port}`);
      logger.info(`🔐 Default Login: admin@edda.com / Admin@2025EDDA`);
      logger.info('');
    });

  } catch (erro) {
    logger.error('❌ FALHA AO INICIAR O SERVIDOR', { 
      message: erro.message, 
      stack: erro.stack 
    });
    process.exit(1);
  }
})();