// backend/src/__tests__/middlewares/cacheMiddleware.test.js
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock do redisClient ANTES de importar o middleware
const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  isConnected: false // Simula Redis offline para testes
};

jest.unstable_mockModule('../../config/redis.js', () => ({
  default: mockRedisClient
}));

// Import dinâmico após mock
const { cache } = await import('../../middlewares/cacheMiddleware.js');

describe('Cache Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/api/test',
      user: { id: 1 }
    };
    
    res = {
      json: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();

    // Limpar mocks
    mockRedisClient.get.mockClear();
    mockRedisClient.set.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar next() se método não for GET', async () => {
    req.method = 'POST';
    
    const middleware = cache(300);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockRedisClient.get).not.toHaveBeenCalled();
  });

  it('deve retornar dados do cache se existirem (CACHE HIT)', async () => {
    const cachedData = { result: 'cached', items: [1, 2, 3] };
    mockRedisClient.get.mockResolvedValue(cachedData);

    const middleware = cache(300);
    await middleware(req, res, next);

    expect(mockRedisClient.get).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('X-Cache', 'HIT');
    expect(res.json).toHaveBeenCalledWith(cachedData);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se cache não existir (CACHE MISS)', async () => {
    mockRedisClient.get.mockResolvedValue(null);

    const middleware = cache(300);
    await middleware(req, res, next);

    expect(mockRedisClient.get).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    // Não verifica res.json pois é interceptado pelo middleware
  });

  it('deve armazenar resposta no cache quando res.json() é chamado', async () => {
    mockRedisClient.get.mockResolvedValue(null);
    mockRedisClient.set.mockResolvedValue('OK');

    const responseData = { result: 'new', items: [4, 5, 6] };
    
    const middleware = cache(300);
    await middleware(req, res, next);

    // Simular que o controller chamou res.json()
    expect(next).toHaveBeenCalled();
    
    // res.json foi interceptado pelo middleware
    const interceptedJson = res.json;
    expect(typeof interceptedJson).toBe('function');
    
    // Chamar res.json() manualmente para testar
    await interceptedJson(responseData);

    // Verificar se dados foram armazenados no cache
    expect(mockRedisClient.set).toHaveBeenCalled();
    const setCall = mockRedisClient.set.mock.calls[0];
    expect(setCall[1]).toEqual(responseData);
    expect(setCall[2]).toBe(300); // TTL
  });

  it('deve usar keyGenerator customizado se fornecido', async () => {
    const customKeyGen = (req) => `custom:${req.user.id}:${req.originalUrl}`;
    mockRedisClient.get.mockResolvedValue(null);

    const middleware = cache(300, customKeyGen);
    await middleware(req, res, next);

    expect(mockRedisClient.get).toHaveBeenCalledWith('custom:1:/api/test');
  });

  it('deve usar chave padrão se keyGenerator não fornecido', async () => {
    mockRedisClient.get.mockResolvedValue(null);

    const middleware = cache(300);
    await middleware(req, res, next);

    const expectedKey = 'cache:/api/test:user:1';
    expect(mockRedisClient.get).toHaveBeenCalledWith(expectedKey);
  });

  it('deve lidar com usuário anônimo (sem req.user)', async () => {
    req.user = undefined;
    mockRedisClient.get.mockResolvedValue(null);

    const middleware = cache(300);
    await middleware(req, res, next);

    const expectedKey = 'cache:/api/test:user:anonymous';
    expect(mockRedisClient.get).toHaveBeenCalledWith(expectedKey);
  });

  it('deve respeitar TTL customizado', async () => {
    mockRedisClient.get.mockResolvedValue(null);
    mockRedisClient.set.mockResolvedValue('OK');

    const customTTL = 600;
    const middleware = cache(customTTL);
    await middleware(req, res, next);

    const responseData = { test: 'data' };
    await res.json(responseData);

    const setCall = mockRedisClient.set.mock.calls[0];
    expect(setCall[2]).toBe(customTTL);
  });

  it('deve adicionar headers de cache em HIT', async () => {
    const cachedData = { cached: true };
    mockRedisClient.get.mockResolvedValue(cachedData);

    const middleware = cache(300);
    await middleware(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Cache', 'HIT');
    expect(res.setHeader).toHaveBeenCalledWith('X-Cache-Key', expect.any(String));
  });

  it('deve continuar funcionando se Redis falhar', async () => {
    mockRedisClient.get.mockRejectedValue(new Error('Redis connection failed'));

    const middleware = cache(300);
    await middleware(req, res, next);

    // Deve chamar next() mesmo com erro no Redis
    expect(next).toHaveBeenCalled();
  });

  it('deve ignorar cache se NODE_ENV=development e DISABLE_CACHE=true', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalDisable = process.env.DISABLE_CACHE;
    
    process.env.NODE_ENV = 'development';
    process.env.DISABLE_CACHE = 'true';

    const middleware = cache(300);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockRedisClient.get).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
    process.env.DISABLE_CACHE = originalDisable;
  });

  it('deve cachear diferentes URLs separadamente', async () => {
    mockRedisClient.get.mockResolvedValue(null);

    const middleware = cache(300);
    
    // Primeira URL
    req.originalUrl = '/api/clientes';
    await middleware(req, res, next);
    
    // Segunda URL
    req.originalUrl = '/api/relatorios';
    await middleware(req, res, next);

    expect(mockRedisClient.get).toHaveBeenCalledTimes(2);
    expect(mockRedisClient.get).toHaveBeenCalledWith('cache:/api/clientes:user:1');
    expect(mockRedisClient.get).toHaveBeenCalledWith('cache:/api/relatorios:user:1');
  });

  it('deve cachear diferentes usuários separadamente', async () => {
    mockRedisClient.get.mockResolvedValue(null);

    const middleware = cache(300);
    
    // Usuário 1
    req.user = { id: 1 };
    await middleware(req, res, next);
    
    // Usuário 2
    req.user = { id: 2 };
    await middleware(req, res, next);

    expect(mockRedisClient.get).toHaveBeenCalledTimes(2);
    expect(mockRedisClient.get).toHaveBeenCalledWith('cache:/api/test:user:1');
    expect(mockRedisClient.get).toHaveBeenCalledWith('cache:/api/test:user:2');
  });
});
