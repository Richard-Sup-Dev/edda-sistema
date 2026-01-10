// backend/src/config/redis.js
// import Redis from 'ioredis'; // DESABILITADO para Render free tier
import logger from './logger.js';

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Inicializa conexão com Redis
   * Sistema funcionará normalmente mesmo sem Redis (modo degradado)
   */
  async connect() {
    // SEMPRE desabilitar Redis em produção (Render free tier)
    logger.info('Redis desabilitado - sistema funcionando sem cache');
    this.client = null;
    this.isConnected = false;
    return null;

    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0'),
        retryStrategy: (times) => {
          // Limitar tentativas de reconexão
          if (times > 3) {
            logger.warn('⚠️  Redis não disponível após 3 tentativas');
            logger.info('💡 Sistema continuará sem cache');
            return null; // Para de tentar reconectar
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false, // Não enfileirar comandos quando offline
        lazyConnect: true, // Não conectar automaticamente
      };

      // this.client = new Redis(redisConfig); // DESABILITADO

      this.client.on('connect', () => {
        logger.info('✅ Redis conectado com sucesso');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        // Suprimir TODOS os erros de conexão para não poluir logs
        this.isConnected = false;
        // Redis offline é esperado e não é um erro crítico
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        // Silenciar logs de reconexão
      });

      // Testar conexão com timeout
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
      await this.client.ping();
      logger.info('✅ Redis ping successful');

      return this.client;
    } catch (error) {
      logger.warn('⚠️  Redis não disponível:', error.message);
      logger.info('💡 Sistema funcionará sem cache (modo degradado)');
      
      // Limpar cliente com erro
      if (this.client) {
        try {
          this.client.disconnect();
        } catch (e) {
          // Ignorar erro ao desconectar
        }
      }
      
      this.client = null;
      this.isConnected = false;
      return null;
    }
  }

  /**
   * Obtém valor do cache
   */
  async get(key) {
    if (!this.isConnected || !this.client) return null;

    try {
      const value = await this.client.get(key);
      if (value) {
        logger.debug(`Cache HIT: ${key}`);
        return JSON.parse(value);
      }
      logger.debug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Erro ao buscar cache ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Define valor no cache
   */
  async set(key, value, ttlSeconds = 300) {
    if (!this.isConnected || !this.client) return false;

    try {
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttlSeconds, serialized);
      logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
      return true;
    } catch (error) {
      logger.error(`Erro ao salvar cache ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Remove valor do cache
   */
  async del(key) {
    if (!this.isConnected || !this.client) return false;

    try {
      await this.client.del(key);
      logger.debug(`Cache DEL: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Erro ao deletar cache ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Remove múltiplas chaves por padrão
   */
  async delPattern(pattern) {
    if (!this.isConnected || !this.client) return false;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
        logger.debug(`Cache DEL pattern: ${pattern} (${keys.length} keys)`);
      }
      return true;
    } catch (error) {
      logger.error(`Erro ao deletar pattern ${pattern}:`, error.message);
      return false;
    }
  }

  /**
   * Incrementa contador
   */
  async incr(key, ttlSeconds = null) {
    if (!this.isConnected || !this.client) return null;

    try {
      const value = await this.client.incr(key);
      if (ttlSeconds) {
        await this.client.expire(key, ttlSeconds);
      }
      return value;
    } catch (error) {
      logger.error(`Erro ao incrementar ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Verifica se chave existe
   */
  async exists(key) {
    if (!this.isConnected || !this.client) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Erro ao verificar ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Define tempo de expiração
   */
  async expire(key, seconds) {
    if (!this.isConnected || !this.client) return false;

    try {
      await this.client.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error(`Erro ao definir expiração ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Limpa todo o cache
   */
  async flushAll() {
    if (!this.isConnected || !this.client) return false;

    try {
      await this.client.flushdb();
      logger.info('🗑️  Cache Redis limpo completamente');
      return true;
    } catch (error) {
      logger.error('Erro ao limpar cache:', error.message);
      return false;
    }
  }

  /**
   * Fecha conexão
   */
  async disconnect() {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis desconectado');
      this.isConnected = false;
    }
  }

  /**
   * Obtém informações do Redis
   */
  async getInfo() {
    if (!this.isConnected || !this.client) {
      return { connected: false };
    }

    try {
      const info = await this.client.info();
      const dbSize = await this.client.dbsize();
      
      return {
        connected: true,
        dbSize,
        info: info.split('\r\n').slice(0, 10).join('\n')
      };
    } catch (error) {
      logger.error('Erro ao obter info Redis:', error.message);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Limpa chaves por pattern
   */
  async clearPattern(pattern) {
    if (!this.isConnected || !this.client) return 0;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      logger.debug(`Cleared ${keys.length} keys matching ${pattern}`);
      return keys.length;
    } catch (error) {
      logger.error(`Erro ao limpar pattern ${pattern}:`, error.message);
      return 0;
    }
  }

  /**
   * Retorna TTL de uma chave
   */
  async ttl(key) {
    if (!this.isConnected || !this.client) return -2;

    try {
      const ttl = await this.client.ttl(key);
      return ttl;
    } catch (error) {
      logger.error(`Erro ao obter TTL de ${key}:`, error.message);
      return -2;
    }
  }
}

// Singleton instance
const redisClient = new RedisClient();

export default redisClient;
