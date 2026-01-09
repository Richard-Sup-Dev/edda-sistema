# TESTES BACKEND - Prioridades Críticas

## Pendências identificadas na análise

### 1. Testes Redis (CRÍTICO)
**Arquivo**: `backend/src/__tests__/services/redisService.test.js` (criar)

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { redisClient } from '../../config/redis.js';
import { 
  setCache, 
  getCache, 
  deleteCache, 
  clearPattern 
} from '../../services/redisService.js';

describe('Redis Service', () => {
  beforeAll(async () => {
    await redisClient.connect();
  });

  afterAll(async () => {
    await redisClient.flushDb();
    await redisClient.quit();
  });

  it('deve armazenar e recuperar dados do cache', async () => {
    await setCache('test-key', { name: 'Test' }, 60);
    const result = await getCache('test-key');
    expect(result).toEqual({ name: 'Test' });
  });

  it('deve expirar cache após TTL', async () => {
    await setCache('expire-key', { data: 'temp' }, 1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await getCache('expire-key');
    expect(result).toBeNull();
  });

  it('deve deletar chave específica', async () => {
    await setCache('delete-key', { data: 'remove' });
    await deleteCache('delete-key');
    const result = await getCache('delete-key');
    expect(result).toBeNull();
  });

  it('deve limpar chaves por padrão', async () => {
    await setCache('user:1', { id: 1 });
    await setCache('user:2', { id: 2 });
    await clearPattern('user:*');
    
    const result1 = await getCache('user:1');
    const result2 = await getCache('user:2');
    
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
```

### 2. Testes Cache Middleware (ALTO)
**Arquivo**: `backend/src/__tests__/middlewares/cacheMiddleware.test.js` (criar)

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import cache from '../../middlewares/cacheMiddleware.js';
import { redisClient } from '../../config/redis.js';

describe('Cache Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/test',
      user: { id: 1 }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      sendResponse: null
    };
    next = vi.fn();
  });

  it('deve retornar dados do cache se existirem', async () => {
    const cachedData = { result: 'cached' };
    vi.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(cachedData));

    await cache.get(req, res, next);

    expect(res.json).toHaveBeenCalledWith(cachedData);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se cache não existir', async () => {
    vi.spyOn(redisClient, 'get').mockResolvedValue(null);

    await cache.get(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('deve armazenar resposta no cache', async () => {
    const data = { result: 'new' };
    res.sendResponse = vi.fn();
    
    vi.spyOn(redisClient, 'setEx').mockResolvedValue('OK');

    const middleware = cache.set(300);
    await middleware(req, res, next);

    const originalJson = res.json;
    res.json(data);

    expect(redisClient.setEx).toHaveBeenCalled();
  });
});
```

### 3. Testes WebSocket (ALTO)
**Arquivo**: `backend/src/__tests__/services/websocket.test.js` (criar)

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import WebSocket from 'ws';
import { setupWebSocket, notifyUser } from '../../services/websocket.js';
import http from 'http';

describe('WebSocket Service', () => {
  let server, wss, client;

  beforeAll((done) => {
    server = http.createServer();
    wss = setupWebSocket(server);
    server.listen(9001, done);
  });

  afterAll((done) => {
    client?.close();
    wss.close();
    server.close(done);
  });

  it('deve conectar cliente WebSocket', (done) => {
    client = new WebSocket('ws://localhost:9001');
    
    client.on('open', () => {
      expect(client.readyState).toBe(WebSocket.OPEN);
      done();
    });
  });

  it('deve enviar notificação para usuário', (done) => {
    client = new WebSocket('ws://localhost:9001');
    
    client.on('open', () => {
      // Autenticar usuário (simular)
      client.userId = 1;
      
      notifyUser(1, {
        type: 'notification',
        message: 'Test notification'
      });
    });

    client.on('message', (data) => {
      const message = JSON.parse(data);
      expect(message.type).toBe('notification');
      expect(message.message).toBe('Test notification');
      done();
    });
  });

  it('deve broadcast para todos os clientes', (done) => {
    const client1 = new WebSocket('ws://localhost:9001');
    const client2 = new WebSocket('ws://localhost:9001');
    
    let received = 0;

    const handler = (data) => {
      const message = JSON.parse(data);
      expect(message.type).toBe('broadcast');
      received++;
      
      if (received === 2) {
        client1.close();
        client2.close();
        done();
      }
    };

    client1.on('message', handler);
    client2.on('message', handler);

    Promise.all([
      new Promise(resolve => client1.on('open', resolve)),
      new Promise(resolve => client2.on('open', resolve))
    ]).then(() => {
      wss.clients.forEach(client => {
        client.send(JSON.stringify({ type: 'broadcast', message: 'All' }));
      });
    });
  });
});
```

### 4. Testes Notificações (MÉDIO)
**Arquivo**: `backend/src/__tests__/controllers/notificacoesController.test.js` (melhorar)

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import pool from '../../config/database.js';

describe('Notificações Controller', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Setup de usuário de teste
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', senha: 'Test123!' });
    
    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;
  });

  it('deve listar notificações do usuário', async () => {
    const res = await request(app)
      .get('/api/notificacoes')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('notificacoes');
    expect(Array.isArray(res.body.notificacoes)).toBe(true);
  });

  it('deve marcar notificação como lida', async () => {
    // Criar notificação de teste
    const notif = await pool.query(
      'INSERT INTO notificacoes (usuario_id, titulo, mensagem) VALUES ($1, $2, $3) RETURNING id',
      [userId, 'Test', 'Message']
    );

    const notifId = notif.rows[0].id;

    const res = await request(app)
      .patch(`/api/notificacoes/${notifId}/marcar-lida`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.lida).toBe(true);
  });

  it('deve marcar todas como lidas', async () => {
    const res = await request(app)
      .patch('/api/notificacoes/marcar-todas-lidas')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });
});
```

## Como executar

```bash
# Todos os testes
npm test

# Específico
npm test redisService.test.js

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Meta de cobertura
- **Atual**: 60-70%
- **Target**: 80%+

## Prioridade de implementação
1. ✅ Redis Service (CRÍTICO - cache é core)
2. ✅ Cache Middleware (ALTO - performance)
3. ✅ WebSocket (ALTO - real-time)
4. ⬜ Notificações (MÉDIO - funcionalidade)
5. ⬜ Atividades (MÉDIO - audit trail)
