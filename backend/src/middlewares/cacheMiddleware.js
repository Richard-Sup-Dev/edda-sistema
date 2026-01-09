// backend/src/middlewares/cacheMiddleware.js
import redisClient from '../config/redis.js';
import logger from '../config/logger.js';

/**
 * Middleware de cache para respostas HTTP
 * 
 * Uso:
 * router.get('/clientes', cache(300), clientesController.listarClientes);
 * 
 * @param {number} ttl - Tempo de vida em segundos (padrão: 300s / 5min)
 * @param {function} keyGenerator - Função para gerar chave customizada
 */
export function cache(ttl = 300, keyGenerator = null) {
  return async (req, res, next) => {
    // Não usar cache em desenvolvimento (opcional)
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_CACHE === 'true') {
      return next();
    }

    // Não usar cache para métodos que não sejam GET
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Gerar chave do cache
      const cacheKey = keyGenerator 
        ? keyGenerator(req)
        : `cache:${req.originalUrl}:user:${req.user?.id || 'anonymous'}`;

      // Buscar no cache
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        logger.debug(`[CACHE HIT] ${cacheKey}`);
        
        // Adicionar header indicando cache
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);
        
        return res.json(cachedData);
      }

      logger.debug(`[CACHE MISS] ${cacheKey}`);

      // Interceptar res.json para salvar no cache
      const originalJson = res.json.bind(res);
      
      res.json = function(data) {
        // Salvar no cache (sem await para não bloquear resposta)
        redisClient.set(cacheKey, data, ttl)
          .then(() => logger.debug(`[CACHE SET] ${cacheKey}`))
          .catch(error => logger.error(`[CACHE ERROR] ${cacheKey}:`, error.message));

        // Adicionar header indicando cache miss
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);

        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('[CACHE MIDDLEWARE ERROR]:', error.message);
      // Em caso de erro, continuar sem cache
      next();
    }
  };
}

/**
 * Middleware para invalidar cache após operações de escrita
 * 
 * Uso:
 * router.post('/clientes', invalidateCache('clientes'), clientesController.criarCliente);
 */
export function invalidateCache(pattern) {
  return async (req, res, next) => {
    // Armazenar o padrão para invalidar após a resposta
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const fullPattern = `cache:*${pattern}*`;
          await redisClient.delPattern(fullPattern);
          logger.debug(`[CACHE INVALIDATE] ${fullPattern}`);
        } catch (error) {
          logger.error('[CACHE INVALIDATE ERROR]:', error.message);
        }
      }
    });

    next();
  };
}

/**
 * Cache para rotas específicas do sistema
 */
export const cacheStrategies = {
  // Cache curto para dados que mudam frequentemente (1 minuto)
  short: cache(60),
  
  // Cache médio para dados moderadamente estáveis (5 minutos)
  medium: cache(300),
  
  // Cache longo para dados raramente alterados (30 minutos)
  long: cache(1800),
  
  // Cache muito longo para dados quase estáticos (1 hora)
  veryLong: cache(3600),
};

export default cache;
