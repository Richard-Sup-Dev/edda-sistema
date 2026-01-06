# 📋 TEMPLATE .env PARA PRODUÇÃO

## Copie e Cole Este Conteúdo

### PASSO 1: Gerar JWT_SECRET Seguro

Abra o terminal e execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Você vai receber algo como:
```
a7f3c9e1b2d4f6h8j0k1l3m5n7p9r2t4v6w8x0y2z4a6c8e0g2i4k6m8o0
```

**Copie este valor**, você precisará dele!

---

### PASSO 2: Copie o Conteúdo Abaixo

```bash
# ====================================
# CONFIGURAÇÃO DE PRODUÇÃO
# ====================================

# ====== SERVIDOR ======
PORT=3001
NODE_ENV=production

# ====== BANCO DE DADOS ======
# Exemplo PostgreSQL:
# postgresql://user:password@db.neon.tech:5432/edda_db?sslmode=require
DATABASE_URL=postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:5432/edda_db?sslmode=require

# ====== JWT ======
# Cole aqui o valor gerado acima
JWT_SECRET=COLE_AQUI_O_JWT_SECRET_GERADO
JWT_EXPIRY=8

# ====== URLs DINÂMICAS ======
# Seu domínio do frontend
ALLOWED_ORIGINS=https://seu-dominio.com

# URL do frontend (para links de reset de senha)
FRONTEND_URL=https://seu-dominio.com

# URL do backend (para gerar URLs de acesso a arquivos)
SERVER_BASE_URL=https://api.seu-dominio.com

# URL alternativa da aplicação
APP_URL=https://seu-dominio.com

# ====== EMAIL ======
# Seu email (Gmail, Outlook, etc)
EMAIL_USER=seu-email@gmail.com

# Senha de app gerada no seu provedor
# Para Gmail: https://myaccount.google.com/apppasswords
EMAIL_APP_PASS=SUA_SENHA_DE_APP_AQUI

# Endereço que aparece no "From" dos emails
EMAIL_FROM="EDDA Energia <seu-email@gmail.com>"

# Serviço de email (gmail, outlook, etc)
EMAIL_SERVICE=gmail

# ====== UPLOAD ======
MAX_FILE_SIZE=100000000
UPLOAD_DIR=./uploads

# ====== AUTENTICAÇÃO ======
# Tempo de bloqueio após 5 tentativas falhadas (minutos)
BRUTE_FORCE_LOCKOUT_MINUTES=15
BRUTE_FORCE_MAX_ATTEMPTS=5

# ====== DEBUG ======
DEBUG_MODE=false
```

---

## Instruções Específicas por Campo

### DATABASE_URL

**Se usar Neon (recomendado)**:
1. Crie conta em https://neon.tech
2. Crie novo projeto
3. Copie connection string que fica assim:
```
postgresql://neon_user:password@ep-xyz.region.neon.tech/edda?sslmode=require
```
4. Cole no `DATABASE_URL`

**Se usar outro provedor**:
- Supabase: https://supabase.io
- Railway: https://railway.app
- Render: https://render.com

---

### JWT_SECRET

**NUNCA USE O MESMO QUE DEVELOPMENT!**

Gere um novo:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Resultado será algo como:
```
a7f3c9e1b2d4f6h8j0k1l3m5n7p9r2t4v6w8x0y2z4a6c8e0g2i4k6m8o0
```

---

### ALLOWED_ORIGINS

Sua URL do frontend em produção:

```bash
# Um domínio
ALLOWED_ORIGINS=https://seu-dominio.com

# Múltiplos domínios (separados por vírgula)
ALLOWED_ORIGINS=https://seu-dominio.com,https://app.seu-dominio.com,https://www.seu-dominio.com
```

**IMPORTANTE**: Deve ser EXATA. Se seu frontend está em `https://meusite.com`, então:
```bash
ALLOWED_ORIGINS=https://meusite.com  # Sem www, se não usar www
```

---

### FRONTEND_URL

A mesma URL de produção do frontend:
```bash
FRONTEND_URL=https://seu-dominio.com
```

Será usada para gerar links de reset de senha no email:
```
Clique aqui para resetar sua senha:
https://seu-dominio.com/redefinir-senha/TOKEN_AQUI
```

---

### SERVER_BASE_URL

A URL do backend em produção:
```bash
SERVER_BASE_URL=https://api.seu-dominio.com
```

Será usada para gerar URLs de acesso a PDFs e uploads:
```
https://api.seu-dominio.com/uploads/nfs/2026/documento.pdf
```

---

### EMAIL_USER e EMAIL_APP_PASS

**Para Gmail**:
1. Acesse https://myaccount.google.com/apppasswords
2. Selecione "Mail" e "Windows Computer"
3. Copia a senha gerada (formato: `xxxx xxxx xxxx xxxx`)
4. Cole em `EMAIL_APP_PASS` (sem espaços)

```bash
EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=xxxxxxxxxxxxxxxxxxxx
```

**Para Outlook/Hotmail**:
1. Use sua senha normal
```bash
EMAIL_USER=seu-email@outlook.com
EMAIL_APP_PASS=sua_senha_normal
```

**Para SendGrid** (opcional):
```bash
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=sua_chave_sendgrid
```

---

## Template Final Completo

Cole todo este conteúdo em um arquivo chamado `.env`:

```ini
# SERVIDOR
PORT=3001
NODE_ENV=production

# BANCO DE DADOS
DATABASE_URL=postgresql://user:password@host:5432/edda_db?sslmode=require

# JWT
JWT_SECRET=a7f3c9e1b2d4f6h8j0k1l3m5n7p9r2t4v6w8x0y2z4a6c8e0g2i4k6m8o0
JWT_EXPIRY=8

# URLs
ALLOWED_ORIGINS=https://seu-dominio.com
FRONTEND_URL=https://seu-dominio.com
SERVER_BASE_URL=https://api.seu-dominio.com
APP_URL=https://seu-dominio.com

# EMAIL
EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=sua_senha_app
EMAIL_FROM="EDDA Energia <seu-email@gmail.com>"
EMAIL_SERVICE=gmail

# UPLOAD
MAX_FILE_SIZE=100000000
UPLOAD_DIR=./uploads

# AUTENTICAÇÃO
BRUTE_FORCE_LOCKOUT_MINUTES=15
BRUTE_FORCE_MAX_ATTEMPTS=5

# DEBUG
DEBUG_MODE=false
```

---

## Valores Padrão (Development)

Se quiser valores para testing/development:

```bash
PORT=3001
NODE_ENV=production

DATABASE_URL=postgresql://user:password@localhost:5432/edda_dev?sslmode=disable

JWT_SECRET=seu_jwt_secret_desenvolvimento_aqui_32_caracteres

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
SERVER_BASE_URL=http://localhost:3001
APP_URL=http://localhost:3001

EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=sua_senha_app

MAX_FILE_SIZE=100000000
UPLOAD_DIR=./uploads

BRUTE_FORCE_LOCKOUT_MINUTES=15
BRUTE_FORCE_MAX_ATTEMPTS=5

DEBUG_MODE=true
```

---

## ✅ Validação de Campos

Antes de fazer deploy, verifique:

- [ ] PORT = número inteiro (3001)
- [ ] NODE_ENV = "production"
- [ ] DATABASE_URL = começa com postgresql://
- [ ] JWT_SECRET = 32+ caracteres (aleatório)
- [ ] ALLOWED_ORIGINS = seu domínio com https://
- [ ] FRONTEND_URL = seu domínio com https://
- [ ] SERVER_BASE_URL = seu domínio API com https://
- [ ] EMAIL_USER = email válido
- [ ] EMAIL_APP_PASS = senha de app (não senha normal!)
- [ ] EMAIL_FROM = formato: "Nome <email@gmail.com>"
- [ ] EMAIL_SERVICE = "gmail" ou outro provedor

---

## 🚀 Como Usar Este Template

### Opção 1: Local (Teste)
```bash
cd backend
cat > .env << 'EOF'
# Cole o template completo aqui
EOF

npm start
```

### Opção 2: Vercel
```bash
vercel env add DATABASE_URL
# (Cole o valor, pressione Enter)

vercel env add JWT_SECRET
# (Cole o valor gerado, pressione Enter)

# ... repita para cada variável
```

### Opção 3: Railway
```bash
railway link
# Adicione variáveis no painel web
# https://dashboard.railway.app
```

### Opção 4: Render
```bash
# Abra o dashboard em https://dashboard.render.com
# Environment → Add Environment Variable
# (Adicione cada variável manualmente)
```

---

## ⚠️ SEGURANÇA

**NUNCA**:
- ❌ Commit do .env no git
- ❌ Use JWT_SECRET fraco
- ❌ Compartilhe .env com ninguém
- ❌ Use email/senha de login no EMAIL_APP_PASS
- ❌ Use http:// em ALLOWED_ORIGINS (sempre https://)

**SEMPRE**:
- ✅ Use .env com permissions 600
- ✅ Gere JWT_SECRET aleatório
- ✅ Proteja .env com .gitignore
- ✅ Use senha de app do email (app-specific password)
- ✅ Use https:// em todas URLs

---

## 🧪 Teste Antes de Deploy

```bash
# 1. Criar .env com valores
cp .env.production.example .env
# (editar .env com seus valores)

# 2. Testar com NODE_ENV=production
NODE_ENV=production npm start

# 3. Testar endpoints
curl http://localhost:3001/api/test
# Deve retornar: {"mensagem":"EDDA 2025 RODANDO!","status":"OK"}

# 4. Testar CORS
curl -H "Origin: https://seu-dominio.com" http://localhost:3001/api/test
# Deve funcionar sem erro

# 5. Testar login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edda.com","senha":"Admin@2025EDDA"}'
# Deve retornar token JWT
```

---

## 📞 Precisa de Ajuda?

- Leia: `GUIA_SEGURANCA_PRODUCAO.md`
- Leia: `TESTES_VALIDACAO.md`
- Leia: `.env.production.example` (original com comentários)

---

**Arquivo de referência**: `backend/.env.production.example`

Contém TODAS as opções com comentários detalhados!
