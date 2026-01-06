# 📊 GUIA DE TESTES E COBERTURA

## 📈 Status Atual de Cobertura

```
✅ Testes Implementados:
├── Auth (7 testes)
├── Clientes (6 testes)
├── Relatórios (12 testes)
├── Peças (10 testes)
├── Serviços (11 testes)
└── NFS (16 testes)

Total: 62 testes
Cobertura: ~55%
```

## 🎯 Próximos Passos para 80%+

### 1. Middlewares - Testes para Auth, Validation, Role

```bash
# arquivo: backend/src/__tests__/middlewares.test.js
```

**Testes necessários:**
- authMiddleware: validar token JWT válido/inválido
- roleMiddleware: admin vs user permissions
- validationMiddleware: Joi schema validation
- multerMiddleware: upload de arquivo (tamanho, tipo)
- rateLimiter: bloquear após N tentativas

**Estimado:** 15 testes = 15 linhas cada = ~300 linhas

### 2. Controllers de Utilidade

```bash
# arquivo: backend/src/__tests__/utils.test.js
```

**Testes necessários:**
- PDF generation (pdfGenerator)
- Email sending
- Date utilities
- CNPJ/CPF validation
- Error formatting

**Estimado:** 10 testes = ~200 linhas

### 3. Integração com Banco de Dados

```bash
# arquivo: backend/src/__tests__/integration.test.js
```

**Testes necessários:**
- Criar cliente → Criar relatório → Criar NF (fluxo completo)
- Transações de banco (rollback em erro)
- Constraints do banco (unique, foreign keys)
- Soft delete vs hard delete

**Estimado:** 8 testes = ~400 linhas

### 4. Error Handling e Edge Cases

```bash
# arquivo: backend/src/__tests__/errors.test.js
```

**Testes necessários:**
- AppError classes (ValidationError, AuthError, etc)
- Circuit breaker behavior
- Retry logic com exponential backoff
- Unhandled promise rejections
- Global error handler

**Estimado:** 12 testes = ~300 linhas

## 🚀 EXECUTAR PARA AUMENTAR COBERTURA

### Opção 1: Rápido (55% → 65%)

```bash
# 1. Executar testes atuais
cd backend
npm test

# 2. Ver relatório de cobertura
npm test -- --coverage

# 3. Procurar linhas não cobertas (red lines)
npm test -- --coverage --verbose
```

### Opção 2: Completo (55% → 80%+)

#### Passo 1: Criar testes de middlewares

```javascript
// backend/src/__tests__/middlewares.test.js
describe('Authentication Middleware', () => {
  test('Deve aceitar token JWT válido', async () => {
    const validToken = jwt.sign(
      { id: 1, email: 'test@test.com' },
      process.env.JWT_SECRET
    );
    
    const req = {
      headers: { authorization: `Bearer ${validToken}` }
    };
    const res = {};
    const next = jest.fn();
    
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Deve rejeitar token inválido', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('Role Middleware', () => {
  test('Deve permitir admin acessar rota admin', async () => {
    const req = {
      user: { role: 'admin' }
    };
    const res = {};
    const next = jest.fn();
    
    const roleCheck = roleMiddleware('admin');
    roleCheck(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Deve bloquear usuário normal acessar rota admin', async () => {
    const req = {
      user: { role: 'user' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    
    const roleCheck = roleMiddleware('admin');
    roleCheck(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
```

#### Passo 2: Testes de Validação

```javascript
describe('Validation Middleware', () => {
  test('Deve validar CNPJ correto', async () => {
    const validCNPJ = '11222333000181';
    const req = {
      body: { cnpj: validCNPJ }
    };
    
    // Usar schema Joi
    const { error } = clienteSchema.validate(req.body);
    expect(error).toBeUndefined();
  });

  test('Deve rejeitar CNPJ inválido', async () => {
    const invalidCNPJ = '11111111111111';
    const req = {
      body: { cnpj: invalidCNPJ }
    };
    
    const { error } = clienteSchema.validate(req.body);
    expect(error).toBeDefined();
  });
});
```

#### Passo 3: Testes de Integração

```javascript
describe('User Flow Integration', () => {
  test('Fluxo completo: Registrar → Fazer Login → Criar Cliente', async () => {
    // 1. Registro
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@integration.com',
        password: 'Password123!',
      });
    expect(registerRes.status).toBe(201);
    
    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@integration.com',
        password: 'Password123!',
      });
    expect(loginRes.status).toBe(200);
    const { token } = loginRes.body;
    
    // 3. Criar cliente com token
    const clientRes = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Empresa Teste',
        cnpj: '11222333000181',
        email: 'empresa@test.com',
      });
    expect([201, 400]).toContain(clientRes.status);
  });
});
```

#### Passo 4: Testes de Error Handling

```javascript
describe('Error Classes', () => {
  test('ValidationError tem statusCode 400', () => {
    const error = new ValidationError('Campo inválido', [
      { field: 'email', message: 'Email inválido' }
    ]);
    
    expect(error.statusCode).toBe(400);
    expect(error.details).toHaveLength(1);
  });

  test('AuthError tem statusCode 401', () => {
    const error = new AuthenticationError('Token inválido');
    expect(error.statusCode).toBe(401);
  });
});

describe('Circuit Breaker', () => {
  test('Deve ficar OPEN após 5 falhas', async () => {
    const breaker = new CircuitBreaker(
      async () => { throw new Error('Fail'); },
      { threshold: 5 }
    );
    
    for (let i = 0; i < 5; i++) {
      try {
        await breaker.call();
      } catch (e) {
        // expected
      }
    }
    
    expect(breaker.state).toBe('OPEN');
  });

  test('Deve retornar para CLOSED após timeout', async () => {
    const breaker = new CircuitBreaker(
      async () => { return 'success'; },
      { timeout: 100 } // 100ms
    );
    
    breaker.state = 'OPEN';
    await new Promise(r => setTimeout(r, 150)); // Esperar timeout
    
    expect(breaker.state).toBe('HALF_OPEN');
  });
});
```

## 📊 COMANDO PARA VER COBERTURA

```bash
cd backend

# Ver cobertura em terminal
npm test -- --coverage

# Ver cobertura em HTML (abrir em navegador)
npm test -- --coverage --coverageReporters=html
open coverage/index.html  # macOS/Linux
start coverage/index.html # Windows
```

## 🎯 META DE COBERTURA

| Métrica | Atual | Meta |
|---------|-------|------|
| Statements | 55% | 80% |
| Branches | 50% | 75% |
| Functions | 60% | 85% |
| Lines | 55% | 80% |

## ✅ CHECKLIST FINAL

- [ ] 62 testes actuais passam
- [ ] Adicionar 40+ testes (middlewares, utils, integração)
- [ ] Atingir 80%+ cobertura
- [ ] Todos os controllers cobertos
- [ ] Todos os middlewares cobertos
- [ ] Edge cases cobertos (erros, validação, limites)
- [ ] Integração E2E (registro → login → CRUD)

## 📚 RECURSOS

- **Jest Docs**: https://jestjs.io/
- **Supertest**: https://github.com/visionmedia/supertest
- **Coverage**: `npm test -- --coverage`
- **Debug**: `node --inspect-brk node_modules/.bin/jest`

---

**Tempo estimado:** 6-8 horas para atingir 80%  
**Prioridade:** Alta (requerido para produção)
