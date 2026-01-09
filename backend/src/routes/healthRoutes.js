// backend/src/routes/healthRoutes.js
import express from 'express';
import redisClient from '../config/redis.js';
import sequelize from '../config/database.js';

const router = express.Router();

/**
 * Health Check completo do sistema
 * GET /api/health
 */
router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      api: 'up',
      database: 'unknown',
      cache: 'unknown'
    }
  };

  try {
    // Verificar PostgreSQL
    await sequelize.authenticate();
    healthCheck.services.database = 'up';
  } catch (error) {
    healthCheck.services.database = 'down';
    healthCheck.status = 'degraded';
  }

  try {
    // Verificar Redis
    if (redisClient.isConnected) {
      await redisClient.client.ping();
      healthCheck.services.cache = 'up';
    } else {
      healthCheck.services.cache = 'down';
    }
  } catch (error) {
    healthCheck.services.cache = 'down';
  }

  // Status final
  const allServicesUp = Object.values(healthCheck.services).every(status => status === 'up');
  healthCheck.status = allServicesUp ? 'ok' : 'degraded';

  const statusCode = healthCheck.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(healthCheck);
});

/**
 * Informações detalhadas do Redis
 * GET /api/health/redis
 */
router.get('/redis', async (req, res) => {
  try {
    const info = await redisClient.getInfo();
    return res.json(info);
  } catch (error) {
    return res.status(503).json({
      connected: false,
      error: error.message
    });
  }
});

/**
 * Limpar cache (apenas em desenvolvimento)
 * DELETE /api/health/cache
 */
router.delete('/cache', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      erro: 'Operação não permitida em produção'
    });
  }

  try {
    await redisClient.flushAll();
    return res.json({
      sucesso: true,
      mensagem: 'Cache limpo com sucesso'
    });
  } catch (error) {
    return res.status(500).json({
      erro: 'Falha ao limpar cache',
      detalhes: error.message
    });
  }
});

export default router;
