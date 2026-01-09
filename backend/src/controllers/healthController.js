// backend/src/controllers/healthController.js
import sequelize from '../config/database.js';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    return null; // Não retentar em health checks
  },
  maxRetriesPerRequest: 1
});

class HealthController {
  /**
   * Health check básico - verifica se API está respondendo
   * Retorna 200 OK sempre (útil para ALB/ELB básicos)
   */
  async ping(req, res) {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  /**
   * Liveness probe - verifica se aplicação está viva
   * Kubernetes: Se falhar, reinicia o pod
   * Deve retornar 200 se processo está funcionando
   */
  async liveness(req, res) {
    // Checagens mínimas: processo está rodando?
    const isAlive = process.uptime() > 0;

    if (!isAlive) {
      return res.status(503).json({
        status: 'error',
        message: 'Application is not alive'
      });
    }

    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  /**
   * Readiness probe - verifica se aplicação está pronta para receber tráfego
   * Kubernetes: Se falhar, remove do load balancer
   * Deve verificar: DB, Redis, dependências críticas
   */
  async readiness(req, res) {
    const checks = {
      database: false,
      redis: false,
      overall: false
    };

    const errors = [];

    // 1. Check PostgreSQL
    try {
      await sequelize.authenticate();
      checks.database = true;
    } catch (error) {
      errors.push(`Database: ${error.message}`);
      checks.database = false;
    }

    // 2. Check Redis
    try {
      await redis.ping();
      checks.redis = true;
    } catch (error) {
      errors.push(`Redis: ${error.message}`);
      checks.redis = false;
    }

    // 3. Overall status
    checks.overall = checks.database && checks.redis;

    const status = checks.overall ? 200 : 503;

    return res.status(status).json({
      status: checks.overall ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      checks,
      ...(errors.length > 0 && { errors })
    });
  }

  /**
   * Health check detalhado - diagnóstico completo
   * Útil para monitoramento e debugging
   */
  async detailed(req, res) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: { status: 'unknown', latency: 0 },
        redis: { status: 'unknown', latency: 0 }
      }
    };

    // Check Database com latência
    try {
      const start = Date.now();
      await sequelize.authenticate();
      health.checks.database = {
        status: 'healthy',
        latency: Date.now() - start
      };
    } catch (error) {
      health.status = 'unhealthy';
      health.checks.database = {
        status: 'unhealthy',
        error: error.message,
        latency: 0
      };
    }

    // Check Redis com latência
    try {
      const start = Date.now();
      await redis.ping();
      health.checks.redis = {
        status: 'healthy',
        latency: Date.now() - start
      };
    } catch (error) {
      health.status = 'degraded';
      health.checks.redis = {
        status: 'unhealthy',
        error: error.message,
        latency: 0
      };
    }

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

    return res.status(statusCode).json(health);
  }
}

export default new HealthController();
