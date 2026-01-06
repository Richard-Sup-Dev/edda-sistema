# Configuração de API - Frontend

## 📋 Visão Geral

A configuração centralizada de API está em `src/config/api.js`. Isso permite que você use diferentes URLs de API para diferentes ambientes (desenvolvimento, staging, produção) usando variáveis de ambiente do Vite.

## 🔧 Como Usar

### 1. **Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto (não versione este arquivo):

```bash
# .env.local
VITE_API_URL=http://localhost:3001
VITE_ENV=development
VITE_DEBUG=true
```

Para produção, use `.env.production`:

```bash
# .env.production
VITE_API_URL=https://api.sua-empresa.com
VITE_ENV=production
VITE_DEBUG=false
```

### 2. **Usar nos Componentes**

Ao invés de hardcoded:
```javascript
// ❌ NÃO FAÇA
const BASE_API_URL = 'http://localhost:3001/api';
```

Use a configuração centralizada:
```javascript
// ✅ FAÇA ASSIM
import { API_ENDPOINTS } from '@/config/api';

// Usar os endpoints
axios.get(API_ENDPOINTS.RELATORIOS);
axios.get(API_ENDPOINTS.CLIENTES);
```

### 3. **Endpoints Disponíveis**

```javascript
import { API_ENDPOINTS, UPLOAD_BASE_URL, DEBUG_MODE, logger } from '@/config/api';

// Endpoints
API_ENDPOINTS.AUTH_LOGIN
API_ENDPOINTS.AUTH_REGISTER
API_ENDPOINTS.AUTH_ME
API_ENDPOINTS.CLIENTES
API_ENDPOINTS.PECAS
API_ENDPOINTS.SERVICOS
API_ENDPOINTS.RELATORIOS
API_ENDPOINTS.NF

// URLs
UPLOAD_BASE_URL // URL para downloads/uploads

// Debug
DEBUG_MODE // true/false based on VITE_DEBUG
logger.log(msg, data)
logger.error(msg, error)
logger.warn(msg, data)
```

## 🚀 Deploy

### Local/Desenvolvimento
```bash
npm run dev
# Usa VITE_API_URL=http://localhost:3001
```

### Build para Produção
```bash
npm run build
# Usa VITE_API_URL do .env.production
```

### Preview (Teste da Build)
```bash
npm run preview
# Usa VITE_API_URL do .env.production
```

## 📝 Estrutura de Arquivos

```
frontend/
├── .env.example          # Template das variáveis necessárias
├── .env.local            # Local development (não versione)
├── .env.production       # Production (não versione ou use secrets do host)
├── src/
│   └── config/
│       └── api.js        # Configuração centralizada
└── ... outros arquivos
```

## 🔒 Segurança

- **Nunca** commite `.env.local` ou `.env.production`
- Use `.env.example` como template para colaboradores
- Em produção, configure as variáveis no servidor/host (vercel, netlify, etc.)

## ✅ Checklist de Setup

- [ ] Criar `.env.local` na raiz (copiar de `.env.example`)
- [ ] Configurar `VITE_API_URL` com a URL do seu backend
- [ ] Verificar se todos os 13 arquivos foram atualizados
- [ ] Testar `npm run dev` 
- [ ] Testar `npm run build`
- [ ] Verificar `.gitignore` contém `.env*`

## 🐛 Troubleshooting

**"import não encontrado"**
```javascript
// Verifique se o import está correto
import { API_ENDPOINTS } from '@/config/api';
```

**"VITE_API_URL não está definido"**
```bash
# Crie o arquivo .env.local
VITE_API_URL=http://localhost:3001
```

**"URL incorreta em produção"**
- Verifique `.env.production` tem a URL correta
- Execute `npm run build` antes de deployar
- Confirme que o host tem as variáveis de ambiente configuradas

---

Qualquer dúvida, consulte [Documentação do Vite - Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
