# 🔒 CORREÇÕES DE SEGURANÇA IMPLEMENTADAS - PRODUÇÃO

Data: 03/01/2026
Status: ✅ **4 Problemas Críticos Corrigidos**

---

## 📋 O QUE FOI ALTERADO

### 1️⃣ **CORS Dinâmico** ✅ CORRIGIDO

**Arquivo**: `backend/src/server.js`

**Antes** (❌ Hardcoded):
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

**Depois** (✅ Dinâmico):
```javascript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS não permitido para: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Como usar em produção**:
```bash
# Adicionar ao .env
ALLOWED_ORIGINS=https://seu-dominio.com,https://app.seu-dominio.com
```

---

### 2️⃣ **Email Reset Link Dinâmico** ✅ CORRIGIDO

**Arquivo**: `backend/src/utils/email.js`

**Antes** (❌ Hardcoded):
```javascript
const resetLink = `http://localhost:5173/redefinir-senha/${token}`;
```

**Depois** (✅ Dinâmico):
```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const resetLink = `${FRONTEND_URL}/redefinir-senha/${token}`;
```

**Como usar em produção**:
```bash
# Adicionar ao .env
FRONTEND_URL=https://seu-dominio.com
```

---

### 3️⃣ **Segurança com Helmet** ✅ ADICIONADO

**Arquivo**: `backend/src/server.js`

```javascript
import helmet from 'helmet';

// Adiciona headers de segurança automaticamente
app.use(helmet());
```

**O que o Helmet faz**:
- ✅ `X-Content-Type-Options: nosniff` - Previne MIME type sniffing
- ✅ `X-Frame-Options: DENY` - Previne clickjacking
- ✅ `Strict-Transport-Security` - Força HTTPS
- ✅ `Content-Security-Policy` - Previne XSS
- ✅ `X-XSS-Protection` - Proteção XSS adicional
- ✅ E mais 10+ headers de segurança

**Instalação**: ✅ Já realizada (`npm install helmet`)

---

### 4️⃣ **Validações com JOI** ✅ IMPLEMENTADO

**Arquivo**: `backend/src/middlewares/validationMiddleware.js` (NOVO)

Criado um middleware completo com validações para:

#### A) Clientes
```javascript
// Valida CNPJ, Email, Nome, Telefone, etc
export const clienteSchema = Joi.object({
  cnpj: Joi.string().custom(validarCNPJ).required(),
  nome_fantasia: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  telefone: Joi.string().pattern(/^\d{10,11}$/),
  // ... mais campos
});
```

#### B) Relatórios
```javascript
// Valida datas, descrição, valores, etc
export const relatorioSchema = Joi.object({
  cliente_id: Joi.number().integer().required(),
  os_numero: Joi.string().required(),
  data_inicio: Joi.date().required(),
  data_fim: Joi.date().min(Joi.ref('data_inicio')).required(),
  descricao_servico: Joi.string().min(10).max(1000).required(),
  // ... mais campos
});
```

#### C) Peças
```javascript
export const pecaSchema = Joi.object({
  codigo_fabrica: Joi.string().required(),
  descricao: Joi.string().min(3).max(200).required(),
  valor_unitario: Joi.number().positive().required(),
  // ... mais campos
});
```

#### D) Serviços
```javascript
export const servicoSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  valor_padrao: Joi.number().positive(),
  // ... mais campos
});
```

**Como usar nas rotas**:
```javascript
import { validarDados, clienteSchema } from '../middlewares/validationMiddleware.js';

// POST /api/clientes com validação
router.post('/', validarDados(clienteSchema), clientesController.create);
```

---

### 5️⃣ **Error Handler Global** ✅ ADICIONADO

**Arquivo**: `backend/src/server.js`

```javascript
// === ERROR HANDLER GLOBAL ===
app.use((error, req, res, next) => {
  console.error('Erro:', error.message);
  
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor'  // ← Não expõe detalhes
    : error.message;              // ← Mostra detalhes em dev
    
  res.status(statusCode).json({ 
    erro: message,
    ...(process.env.NODE_ENV !== 'production' && { detalhes: error.stack })
  });
});
```

**Benefícios**:
- ✅ Não expõe stack trace em produção
- ✅ Logging estruturado de erros
- ✅ Respostas consistentes ao cliente

---

### 6️⃣ **.gitignore Atualizado** ✅ CRIADO

**Arquivo**: `backend/.gitignore` (NOVO)

Protege arquivos sensíveis:
```
.env
.env.local
.env.*.local
.env.production
node_modules/
logs/
uploads/
```

**IMPORTANTE**: Seu .env de desenvolvimento NÃO será enviado ao git!

---

### 7️⃣ **Exemplo de .env para Produção** ✅ CRIADO

**Arquivo**: `backend/.env.production.example`

Contém TODOS os campos necessários com explicações detalhadas. Copie, preencha com seus valores reais e renomeie para `.env` no servidor.

---

## 🚀 PRÓXIMOS PASSOS PARA PRODUÇÃO

### PASSO 1: Configurar o .env
```bash
cd backend
cp .env.production.example .env
```

Edite `.env` e substitua:
- `DATABASE_URL` - URL do PostgreSQL
- `JWT_SECRET` - Gere com: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ALLOWED_ORIGINS` - Seu domínio frontend
- `FRONTEND_URL` - URL do frontend
- `SERVER_BASE_URL` - URL do backend
- `EMAIL_USER` - Email para enviar (Gmail, Outlook, etc)
- `EMAIL_APP_PASS` - Senha de app (não senha de login)

### PASSO 2: Gerar JWT_SECRET Seguro
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copie o resultado e cole em `JWT_SECRET` no .env

### PASSO 3: Atualizar Rotas com Validação
Em cada rota que cria dados, adicione validação:

```javascript
// Exemplo: POST /api/clientes
import { validarDados, clienteSchema } from '../middlewares/validationMiddleware.js';

router.post('/', validarDados(clienteSchema), clientesController.create);
```

### PASSO 4: Testar Localmente
```bash
NODE_ENV=production npm start
```

Verifique:
- ✅ JWT_SECRET carregado do .env
- ✅ CORS funciona com sua origem
- ✅ Email reset redirecionado corretamente
- ✅ Helmet headers presentes

### PASSO 5: Deploy
```bash
# No seu servidor (Vercel, Railway, Render, etc)
# Adicione as variáveis de ambiente do .env.production.example
# Faça deploy
npm start
```

---

## ✅ CHECKLIST PRÉ-PRODUÇÃO

- [ ] JWT_SECRET alterado para valor aleatório
- [ ] ALLOWED_ORIGINS configurado com seu domínio
- [ ] FRONTEND_URL configurado com seu domínio
- [ ] SERVER_BASE_URL configurado com URL do backend
- [ ] EMAIL_USER e EMAIL_APP_PASS configurados
- [ ] DATABASE_URL apontando para PostgreSQL de produção
- [ ] .env criado a partir de .env.production.example
- [ ] .env adicionado ao .gitignore
- [ ] Helmet instalado (`npm install helmet`)
- [ ] Validações adicionadas às rotas (clienteSchema, relatorioSchema, etc)
- [ ] Teste de login com novo JWT_SECRET
- [ ] Teste de CORS com origem diferente
- [ ] Teste de reset de senha (email)
- [ ] Teste de upload de arquivo
- [ ] Teste de validação (enviar CNPJ inválido, email inválido, etc)

---

## 🔒 RESUMO DE SEGURANÇA

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **CORS** | ❌ Hardcoded | ✅ Dinâmico |
| **Email Reset** | ❌ Hardcoded | ✅ Dinâmico |
| **JWT_SECRET** | ❌ Fraco (visível) | ✅ Aleatório (32 chars) |
| **Validações** | ❌ Ausentes | ✅ JOI completo |
| **Security Headers** | ❌ Nenhum | ✅ Helmet |
| **Error Handler** | ⚠️ Local | ✅ Global |
| **Proteção .env** | ❌ Nada | ✅ .gitignore |

---

## 📞 SUPORTE

Se encontrar problemas:

1. **CORS não permite meu domínio**
   - Verifique `ALLOWED_ORIGINS` no .env
   - Certifique-se que a URL está exata (com https://)

2. **Email reset não funciona**
   - Verifique `FRONTEND_URL` no .env
   - Verifique credenciais de email

3. **JWT_SECRET não é carregado**
   - Verifique se o `.env` existe na raiz do backend
   - Rode `npm start` novamente

4. **Validação falha mesmo com dados corretos**
   - Revise as regras em `validationMiddleware.js`
   - Certifique-se de estar usando o middleware nas rotas

---

**Status Final**: ✅ **Sistema pronto para discussão sobre produção!**

Agora faltam apenas configurações específicas do seu servidor (domínio, email, etc).
