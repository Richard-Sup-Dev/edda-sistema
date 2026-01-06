# 🧪 Testes Automatizados - EDDA Backend

## Visão Geral
Este projeto inclui testes automatizados com **Jest** e **Supertest** para validar os controladores principais do sistema.

## 📦 Dependências Instaladas
- **Jest**: Framework de testes
- **Supertest**: Biblioteca HTTP para testes de API REST

## 🚀 Como Rodar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes com coverage (cobertura)
```bash
npm test -- --coverage
```

### Executar apenas um arquivo de teste
```bash
npm test -- src/__tests__/auth.test.js
```

### Executar testes em modo watch (monitora mudanças)
```bash
npm test -- --watch
```

## 📋 Testes Implementados

### 1. **Auth Controller** (`src/__tests__/auth.test.js`)
Valida autenticação, registro e login:
- ✅ Registro com dados válidos
- ✅ Rejeita email duplicado
- ✅ Rejeita email inválido
- ✅ Rejeita senha muito curta
- ✅ Login com credenciais corretas
- ✅ Rejeita email incorreto
- ✅ Rejeita senha incorreta

### 2. **Clientes Controller** (`src/__tests__/clientes.test.js`)
Valida operações CRUD de clientes:
- ✅ Listar todos os clientes
- ✅ Criar novo cliente com CNPJ válido
- ✅ Rejeita CNPJ inválido
- ✅ Rejeita email inválido
- ✅ Atualizar cliente existente
- ✅ Excluir cliente

## ⚙️ Configuração

### Jest Config (`jest.config.js`)
- **Environment**: Node.js
- **Transform**: Nenhum (usando ESM nativo)
- **Test Match**: `**/__tests__/**/*.test.js`
- **Coverage Threshold**: Mínimo 50% em linhas, branches, functions

### Environment Variables
Os testes usam um arquivo `.env.test` separado para não interferir com o desenvolvimento.

```bash
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edda_test
JWT_SECRET=test_secret_key_123456789
```

## 🔍 Próximos Passos

### Adicionar mais testes para:
- [ ] Relatórios Controller
- [ ] Peças Controller
- [ ] Serviços Controller
- [ ] Validações de middleware
- [ ] Testes de integração E2E

### Melhorias:
- [ ] Setup de banco de dados de teste em memória (SQLite)
- [ ] Aumentar coverage para 80%+
- [ ] Adicionar testes de performance
- [ ] CI/CD integrado (GitHub Actions)

## 📊 Coverage

Para visualizar o relatório de cobertura em HTML:
```bash
npm test -- --coverage --coverageReporters=html
# Abrir: coverage/index.html no navegador
```

## 🛠️ Troubleshooting

### Erro: "Cannot find module"
Certifique-se de que a sua estrutura de imports corresponde ao `package.json` com `"type": "module"`

### Erro: "Connection timeout"
Verifique se o PostgreSQL está rodando e se o DATABASE_URL está correto em `.env.test`

### Erro: "Jest does not run"
Instale novamente: `npm install --save-dev jest supertest`

## 📝 Padrão de Teste

Todos os testes seguem este padrão:

```javascript
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Nome do Teste', () => {
  beforeAll(async () => {
    // Setup: Preparar dados de teste
  });

  afterAll(async () => {
    // Cleanup: Limpar após testes
  });

  it('Deve fazer algo', async () => {
    const response = await request(app)
      .post('/api/rota')
      .send({ data: 'teste' })
      .expect(200);

    expect(response.body).toHaveProperty('campo');
  });
});
```

## 🚀 Integração CI/CD

Para adicionar testes automáticos no GitHub Actions, crie `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
```

---

**Última atualização**: 05/01/2026
