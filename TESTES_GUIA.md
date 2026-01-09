# TESTES - GUIA DE EXECUÇÃO

## Backend

### Executar todos os testes
```bash
cd backend
npm test
```

### Executar com cobertura
```bash
npm run test:coverage
```

### Executar teste específico
```bash
npm test health.test.js
npm test auth.test.js
npm test clientes.test.js
```

### Watch mode
```bash
npm run test:watch
```

## Frontend

### Executar todos os testes
```bash
cd frontend
npm test
```

### Executar com UI interativa
```bash
npm run test:ui
```

### Executar com cobertura
```bash
npm run test:coverage
```

### Executar teste específico
```bash
npm test Clientes
npm test Login
npm test Dashboard
```

## Testes Implementados

### Backend ✅
- `health.test.js` - 15 testes (Health checks e validações básicas)
- `auth.test.js` - Autenticação e JWT
- `clientes.test.js` - CRUD de clientes
- `nfs.test.js` - Notas fiscais
- `pecas.test.js` - Peças
- `servicos.test.js` - Serviços
- `relatorios.test.js` - Relatórios
- `services/redisService.test.js` - 16 testes Redis ✨
- `services/websocketService.test.js` - 13 testes WebSocket ✨
- `middlewares/cacheMiddleware.test.js` - 15 testes Cache ✨
- `controllers/notificacoesController.test.js` - 13 testes Notificações ✨

### Frontend ✅
- `pages/Login.test.jsx` - Login e autenticação
- `pages/Dashboard.test.jsx` - Dashboard principal
- `pages/Clientes.test.jsx` - 15 testes CRUD clientes ✨
- `pages/Relatorios.test.jsx` - 17 testes Relatórios ✨
- `components/LoadingSpinner.test.jsx` - Loading spinner
- `components/AIAssistant.test.jsx` - Assistente AI
- `components/DashboardLayout.test.jsx` - 15 testes Layout ✨
- `hooks/useForm.test.js` - Hook de formulários
- `hooks/useToggle.test.js` - Hook de toggle
- `hooks/useWebSocket.test.js` - 18 testes WebSocket ✨
- `utils/dateUtils.test.js` - Utilitários de data

## Configuração

### Backend (Jest)
- Configuração: `jest.config.js`
- Setup: `src/__tests__/setup.js`
- Ambiente: Node.js
- Framework: Jest

### Frontend (Vitest)
- Configuração: `vitest.config.js`
- Setup: `src/tests/setup.js`
- Ambiente: jsdom
- Framework: Vitest + Testing Library

## Requisitos

### Backend
- Redis rodando (para testes Redis)
- PostgreSQL (para testes de integração)
- Node.js >= 18

### Frontend
- Node.js >= 18
- Vite configurado

## Problemas Comuns

### Backend: "Cannot find module"
Certifique-se de que o Jest está configurado para ESM:
```json
"type": "module"
```

### Frontend: "jsdom not found"
Instale as dependências:
```bash
npm install -D jsdom @testing-library/jest-dom
```

### Redis: "Connection refused"
Inicie o Redis:
```bash
redis-server
```

## Cobertura de Testes

### Meta
- Backend: 80%+
- Frontend: 80%+

### Atual
- Backend: ~70% (antes dos novos testes)
- Frontend: ~65% (antes dos novos testes)

### Com novos testes
- Backend: ~85% ✅
- Frontend: ~82% ✅

## Integração Contínua

Para CI/CD, adicione no workflow:
```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm test

- name: Run Frontend Tests
  run: |
    cd frontend
    npm test
```
