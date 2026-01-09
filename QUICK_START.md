# 🚀 Quick Start - Sistema de Relatórios

Guia rápido para colocar o sistema no ar em menos de 5 minutos!

## ✅ Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Opcional (para cache)
- **Redis** ([Download](https://redis.io/download))

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-relatorios.git
cd sistema-relatorios
```

### 2. Configure o Banco de Dados

```bash
# Crie o banco PostgreSQL
createdb relatorios_db

# Ou via psql
psql -U postgres
CREATE DATABASE relatorios_db;
\q
```

### 3. Configure Backend

```bash
cd backend

# Instale dependências
npm install

# Copie arquivo de ambiente
cp .env.example .env

# Edite .env com suas configurações:
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=relatorios_db
# - DB_USER=postgres
# - DB_PASSWORD=sua_senha
# - JWT_SECRET=chave_secreta_aleatoria
# - PORT=3000

# Execute as migrations
npm run migrate

# Inicie o servidor
npm start
```

✅ Backend rodando em **http://localhost:3000**

### 4. Configure Frontend

```bash
# Abra novo terminal
cd frontend

# Instale dependências
npm install

# Copie arquivo de ambiente
cp .env.example .env

# Edite .env:
# VITE_API_URL=http://localhost:3000/api

# Inicie o dev server
npm run dev
```

✅ Frontend rodando em **http://localhost:5174**

---

## 🎯 Acesso Inicial

### Criar primeiro usuário (Admin)

```bash
cd backend
node scripts/create-admin.js
```

Ou via SQL:

```sql
INSERT INTO usuarios (nome, email, senha, role) 
VALUES (
  'Admin', 
  'admin@empresa.com', 
  '$2b$10$hash...', -- use bcrypt para gerar
  'admin'
);
```

### Login

1. Acesse http://localhost:5174
2. Login: `admin@empresa.com`
3. Senha: (que você definiu)

---

## 🧪 Testes

### Frontend (99.1% cobertura)

```bash
cd frontend
npm test
```

### Backend (63% cobertura)

```bash
cd backend
npm test
```

---

## 📊 Status do Sistema

| Componente | Status | Cobertura |
|------------|--------|-----------|
| Frontend Tests | ✅ | 99.1% (115/116) |
| Backend Tests | ⚡ | 63.0% (138/219) |
| Build Frontend | ✅ | Sem erros |
| Build Backend | ✅ | Funcional |
| PostgreSQL | ✅ | Conectado |
| Redis | ⚠️ | Opcional |

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando: `pg_isready`
- Confira credenciais no `.env`
- Teste conexão: `psql -U postgres -d relatorios_db`

### Erro: "Port 3000 already in use"
- Mate processo: `npx kill-port 3000`
- Ou mude porta no `.env`

### Erro: "Module not found"
- Delete `node_modules` e reinstale:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Frontend não carrega dados
- Verifique se backend está rodando
- Confira `VITE_API_URL` no frontend/.env
- Abra DevTools (F12) → Network → veja erros

---

## 📚 Próximos Passos

1. ✅ Sistema rodando
2. 📖 Leia [README.md](README.md) completo
3. 🔐 Configure [autenticação](backend/README.md#autenticação)
4. 📧 Configure [email](backend/README.md#configuração-de-email)
5. 🚀 Veja [guia de deploy](DEPLOY.md)

---

## 💡 Comandos Úteis

```bash
# Backend
npm start              # Inicia servidor
npm run dev            # Modo desenvolvimento (nodemon)
npm test               # Executa testes
npm run migrate        # Roda migrations
npm run seed           # Popula banco com dados de teste

# Frontend
npm run dev            # Dev server (Vite)
npm run build          # Build produção
npm run preview        # Preview do build
npm test               # Testes com Vitest
npm run lint           # ESLint

# Docker (alternativa)
docker-compose up -d   # Sobe tudo (backend + postgres + redis)
```

---

## 🆘 Precisa de Ajuda?

- 📖 [Documentação Completa](README.md)
- 🐛 [Reportar Bug](https://github.com/seu-usuario/sistema-relatorios/issues)
- 💬 [Discussões](https://github.com/seu-usuario/sistema-relatorios/discussions)

---

**Tempo estimado de setup**: ⏱️ 5-10 minutos

**Última atualização**: Janeiro 2026
