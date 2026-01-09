# Documentação Swagger - Sistema EDDA

## 📊 Status da Documentação: **100%** ✅

Todos os endpoints da API REST estão documentados com especificação OpenAPI 3.0 (Swagger).

## 🚀 Acessar Documentação

**URL**: `http://localhost:3001/api-docs`

A documentação interativa permite:
- ✅ Visualizar todos os endpoints
- ✅ Testar endpoints diretamente no navegador
- ✅ Ver schemas de request/response
- ✅ Autenticação com Bearer Token
- ✅ Exemplos de uso

## 📚 Tags e Endpoints Documentados

### 1. **Health** (4 endpoints)
Monitoramento e health checks para Kubernetes/Docker

- `GET /health/ping` - Ping básico (sempre 200)
- `GET /health/live` - Liveness probe (Kubernetes)
- `GET /health/ready` - Readiness probe (verifica DB + Redis)
- `GET /health` - Diagnóstico detalhado

**Status**: ✅ 100% documentado

---

### 2. **Autenticação** (4 endpoints)
Gestão de usuários, login, registro e recuperação de senha

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login (retorna JWT)
- `POST /api/auth/forgot-password` - Solicitar reset de senha
- `POST /api/auth/reset-password/:token` - Redefinir senha

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/auth.js](src/routes/auth.js)

---

### 3. **Clientes** (5 endpoints)
CRUD completo de clientes

- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/clientes.js](src/routes/clientes.js)

---

### 4. **Relatórios** (6+ endpoints)
Gestão completa de relatórios técnicos

- `GET /api/relatorios` - Listar relatórios (com filtros)
- `GET /api/relatorios/:id` - Buscar relatório por ID
- `POST /api/relatorios` - Criar novo relatório
- `PUT /api/relatorios/:id` - Atualizar relatório
- `DELETE /api/relatorios/:id` - Deletar relatório
- `GET /api/relatorios/:id/pdf` - Gerar PDF do relatório

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/relatoriosRoutes.js](src/routes/relatoriosRoutes.js)

---

### 5. **Peças** (5 endpoints)
Catálogo de peças com cache

- `GET /api/pecas` - Listar todas as peças (cache 5min)
- `GET /api/pecas/:id` - Buscar peça por ID (cache 30min)
- `POST /api/pecas` - Criar nova peça (admin only)
- `PUT /api/pecas/:id` - Atualizar peça (admin only)
- `DELETE /api/pecas/:id` - Deletar peça (admin only)

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/pecasRoutes.js](src/routes/pecasRoutes.js)

---

### 6. **Serviços** (5 endpoints)
Catálogo de serviços com cache

- `GET /api/servicos` - Listar todos os serviços (público, cache 5min)
- `GET /api/servicos/:id` - Buscar serviço por ID (público, cache 30min)
- `POST /api/servicos` - Criar novo serviço (admin only)
- `PUT /api/servicos/:id` - Atualizar serviço (admin only)
- `DELETE /api/servicos/:id` - Deletar serviço (admin only)

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/servicosRoutes.js](src/routes/servicosRoutes.js)

---

### 7. **Notas Fiscais** (2 endpoints)
Geração de notas fiscais eletrônicas

- `POST /api/nfs/generate` - Gerar nota fiscal (admin/emissor)
- `POST /api/nfs/gerar` - Endpoint alternativo em PT-BR (admin/emissor)

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/nfsRoutes.js](src/routes/nfsRoutes.js)

---

### 8. **Notificações** (6 endpoints)
Sistema de notificações em tempo real

- `GET /api/notificacoes` - Listar notificações do usuário
- `GET /api/notificacoes/nao-lidas/count` - Contar não lidas
- `PUT /api/notificacoes/marcar-todas-lidas` - Marcar todas como lidas
- `PUT /api/notificacoes/:id/lida` - Marcar uma como lida
- `DELETE /api/notificacoes/:id` - Deletar notificação
- `DELETE /api/notificacoes/lidas/limpar` - Limpar todas lidas

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/notificacoesRoutes.js](src/routes/notificacoesRoutes.js)

---

### 9. **Atividades** (3 endpoints)
Log de atividades e auditoria

- `GET /api/atividades` - Listar atividades (paginado)
- `GET /api/atividades/recentes` - Atividades recentes (dashboard)
- `GET /api/atividades/estatisticas` - Estatísticas agregadas

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/atividadesRoutes.js](src/routes/atividadesRoutes.js)

---

### 10. **Financeiro** (1 endpoint)
Dashboard e relatórios financeiros

- `GET /api/financeiro/resumo` - Resumo financeiro completo (admin/técnico)
  - Total acumulado no ano
  - Valores pendentes/concluídos/faturados
  - Variações percentuais
  - Contadores de OS
  - Evolução mensal

**Status**: ✅ 100% documentado  
**Arquivo**: [backend/src/routes/financeiroRoutes.js](src/routes/financeiroRoutes.js)

---

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via Bearer Token JWT.

**Como autenticar no Swagger:**
1. Fazer login em `POST /api/auth/login`
2. Copiar o `token` da resposta
3. Clicar no botão **Authorize** 🔒 no topo da página Swagger
4. Inserir: `Bearer <seu-token>`
5. Testar endpoints protegidos

**Exemplo de token**:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Estatísticas da Documentação

| Categoria | Endpoints | Status |
|-----------|-----------|--------|
| Health Checks | 4 | ✅ 100% |
| Autenticação | 4 | ✅ 100% |
| Clientes | 5 | ✅ 100% |
| Relatórios | 6+ | ✅ 100% |
| Peças | 5 | ✅ 100% |
| Serviços | 5 | ✅ 100% |
| Notas Fiscais | 2 | ✅ 100% |
| Notificações | 6 | ✅ 100% |
| Atividades | 3 | ✅ 100% |
| Financeiro | 1 | ✅ 100% |
| **TOTAL** | **41+** | **✅ 100%** |

## 🎯 Recursos Documentados

### Schemas
- ✅ Cliente
- ✅ Relatório
- ✅ Peça
- ✅ Serviço
- ✅ Notificação
- ✅ Atividade
- ✅ Error

### Security Schemes
- ✅ Bearer JWT Authentication

### Tags
- ✅ 10 tags organizacionais

### Response Codes
- ✅ 200 OK
- ✅ 201 Created
- ✅ 400 Bad Request
- ✅ 401 Unauthorized
- ✅ 403 Forbidden
- ✅ 404 Not Found
- ✅ 500 Internal Server Error
- ✅ 503 Service Unavailable

## 📝 Exemplos de Uso

### 1. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@edda.com", "senha": "Admin@2025EDDA"}'
```

### 2. Listar Clientes (com token)
```bash
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer <seu-token>"
```

### 3. Health Check
```bash
curl http://localhost:3001/health/ready
```

## 🚀 Configuração Swagger

**Arquivo**: [backend/src/config/swagger.js](src/config/swagger.js)

```javascript
{
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EDDA Sistema API',
      version: '1.0.0',
      description: 'API REST para sistema de gestão de relatórios técnicos'
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Desenvolvimento' },
      { url: 'https://api.edda.com', description: 'Produção' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/docs/*.js']
}
```

## 📦 Exportar Documentação

### JSON
```
http://localhost:3001/api-docs.json
```

### YAML (via conversão)
Use ferramentas como `swagger-cli` ou Postman para exportar em YAML.

## 🎨 Personalização

A interface Swagger está customizada:
- ✅ Logo EDDA
- ✅ Cores personalizadas
- ✅ Topbar oculto
- ✅ Título customizado

## 📚 Próximos Passos

- [ ] Adicionar mais exemplos de request/response
- [ ] Documentar webhooks (se houver)
- [ ] Adicionar mais schemas complexos
- [ ] Gerar client SDKs automaticamente
- [ ] Integrar com Postman Collection

## 🔗 Links Úteis

- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/)

---

**Documentação Completa**: ✅ 100%  
**Última Atualização**: 09/01/2026  
**Versão**: 1.0.0
