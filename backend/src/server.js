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
import healthRoutes from './routes/health.js';
import financeiroRoutes from './routes/financeiroRoutes.js';
import pecasRoutes from './routes/pecasRoutes.js';
import servicosRoutes from './routes/servicosRoutes.js';
import clientesRoutes from './routes/clientes.js';
import adminRoutes from './routes/adminRoutes.js';
import nfsRoutes from './routes/nfsRoutes.js';
import notificacoesRoutes from './routes/notificacoesRoutes.js';
import atividadesRoutes from './routes/atividadesRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
// Importar WebSocket service
import websocketService from './services/websocketService.js';
// Importar Redis client
import redisClient from './config/redis.js';

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

// === CORS - DEVE VIR ANTES DE TUDO ===
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Em desenvolvimento, aceita tudo
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Em produção, verifica lista de origens permitidas
    if (allowedOriginsSet.has(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// === MIDDLEWARES ===
// Adicionar ID único a cada requisição
app.use(requestIdMiddleware());

// Security headers com Helmet
app.use(helmet());

// === RATE LIMITING ===
// Proteção contra ataques de força bruta e DDoS
const limiterGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 em prod, 1000 em dev
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
  max: process.env.NODE_ENV === 'production' ? 10 : 100, // 10 em prod, 100 em dev
  message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  standardHeaders: true,
  skip: (req) => req.method !== 'POST'
});

// Rate limiting específico para login (ainda mais restritivo)
const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // 5 em prod, 50 em dev
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  skipSuccessfulRequests: true // Não conta requisições bem-sucedidas
});

// Aplicar rate limit geral
app.use(limiterGeral);

// Aplicar rate limit restritivo para auth
app.use('/api/auth', limiterAuth);

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
// Health checks (ANTES de outras rotas - sem autenticação)
app.use('/health', healthRoutes);

app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth/login', limiterLogin); // Rate limiter específico para login
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/pecas', pecasRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nfs', nfsRoutes);
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/atividades', atividadesRoutes);
app.use('/api/users', profileRoutes); // Rotas de perfil de usuário

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
    
    // Validar variáveis de ambiente antes de qualquer coisa (exceto em testes)
    if (process.env.NODE_ENV !== 'test') {
      validateEnvironment();
    }
    
    await sequelize.authenticate();
    logger.info('Conectado ao PostgreSQL');

    // Redis desabilitado para Render free tier
    // try {
    //   await redisClient.connect();
    // } catch (error) {
    //   logger.warn('⚠️  Redis não disponível - sistema funcionará sem cache');
    // }

    // Sincronizar models sem alterar estrutura em produção
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      logger.info('Modelos Sequelize sincronizados');
    } else {
      logger.info('⚠️ Modo produção - sync desabilitado (use migrations)');
    }

    const adminExiste = await User.findOne({ where: { email: 'admin@edda.com' } });

    if (!adminExiste) {
      const hash = await bcrypt.hash('Admin@2025EDDA', 12);
      await User.create({
        nome: 'Administrador EDDA',
        email: 'admin@edda.com',
        senha: hash,
        role: 'admin'
      });
      logger.info('Usuário admin criado: admin@edda.com');
    } else {
      logger.info('Usuário admin já existe');
    }

    // Iniciar servidor HTTP
    const server = app.listen(port, '0.0.0.0', () => {
      logger.info('');
      logger.info('Servidor EDDA iniciado com sucesso');
      logger.info(`📍 Listening on http://0.0.0.0:${port}`);
      logger.info(`🔐 Default Login: admin@edda.com / Admin@2025EDDA`);
      logger.info('');
    });

    // Inicializar WebSocket server
    websocketService.initialize(server);
    logger.info('WebSocket server inicializado');
    logger.info(`🔌 WebSocket disponível em ws://0.0.0.0:${port}`);
    logger.info('');

  } catch (erro) {
    console.error('❌ ERRO AO INICIAR SERVIDOR:', erro);
    console.error('Stack trace:', erro.stack);
    logger.error('Falha ao iniciar o servidor', { 
      message: erro.message, 
      stack: erro.stack 
    });
    process.exit(1);
  }
})();

// Exportar app para testes
export default app;