# Sistema de Relatórios Técnicos

Sistema completo para gestão e geração de relatórios técnicos de manutenção industrial, desenvolvido com React, Node.js e PostgreSQL.

## Funcionalidades

### Gestão de Relatórios
- Criação de relatórios técnicos com múltiplas fotos
- Registro de medições técnicas (resistência, batimento)
- Geração automática de PDF formatado
- Histórico completo por cliente

### Gestão de Clientes
- Cadastro com CNPJ, endereço e contatos
- Upload de logo para personalização
- Histórico de atendimentos

### Orçamentos
- Catálogo de peças e serviços
- Geração de orçamentos integrados
- Cálculo automático de totais

### Segurança
- Autenticação JWT com roles
- Rate limiting
- Validação de dados
### Backend
- Node.js 20+
- Sequelize ORM
- Jest para testes
- Vite 7
- Tailwind CSS 4
## Instalação

### Pré-requisitos
- Node.js 20 ou superior
cd backend
npm install

```bash
cd frontend
npm install
```

## Configuração

### Variáveis de Ambiente

**Backend (.env)**
```env
npm start
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=sua_chave_secreta
ALLOWED_ORIGINS=http://localhost:5173
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_APP_PASS=senha_app
```

# Sistema de Relatórios Técnicos

Sistema completo para gestão e geração de relatórios técnicos de manutenção industrial, desenvolvido com React, Node.js e PostgreSQL.

[![Build Status](https://img.shields.io/github/actions/workflow/status/Richard-Sup-Dev/edda-sistema/ci.yml?branch=main)](https://github.com/Richard-Sup-Dev/edda-sistema/actions)
[![License](https://img.shields.io/github/license/Richard-Sup-Dev/edda-sistema)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Richard-Sup-Dev/edda-sistema)](https://github.com/Richard-Sup-Dev/edda-sistema/issues)

## Funcionalidades

### Gestão de Relatórios
- Criação de relatórios técnicos com múltiplas fotos
- Registro de medições técnicas (resistência, batimento)
- Geração automática de PDF formatado
- Histórico completo por cliente

### Gestão de Clientes
- Cadastro com CNPJ, endereço e contatos
- Upload de logo para personalização
- Histórico de atendimentos

### Orçamentos
- Catálogo de peças e serviços
- Geração de orçamentos integrados
- Cálculo automático de totais

### Segurança
- Autenticação JWT com roles
- Rate limiting
- Validação de dados
- Logs estruturados

## Tecnologias

### Backend
- Node.js 20+
- Express 4.18
- PostgreSQL 14+
- JWT para autenticação
- Sequelize ORM
- Jest para testes

### Frontend
- React 19
- Vite 7
- Tailwind CSS 4
- React Router 7
- Axios
- Vitest para testes

## Instalação

### Pré-requisitos
- Node.js 20 ou superior
- PostgreSQL 14 ou superior
- npm ou yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variáveis no .env
npm run migrate # Executa as migrações do banco
npm run seed    # (Opcional) Popula dados de teste
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm run test
```

## Documentação
- [Swagger API](./backend/SWAGGER_DOCUMENTATION.md)
- [Exemplos de uso da API](./API_EXEMPLOS.md)
- [Checklist de backup/restore](./BACKUP_RESTORE_CHECKLIST.md)

## Contribuição
Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de contribuição.

## Segurança
Consulte [SECURITY.md](SECURITY.md) para políticas de segurança e reporte de vulnerabilidades.

## Checklist Profissional
- [x] CI/CD (GitHub Actions)
- [x] Testes automatizados
- [x] Documentação de API
- [x] Templates de issues e PRs
- [x] Checklist de backup
- [x] Segurança avançada
- [x] Docker e deploy

## Contato
Dúvidas ou sugestões? Abra uma issue ou envie um e-mail para richard@seudominio.com

---

<p align="center">
	<img src="https://user-images.githubusercontent.com/your-demo-image.png" width="400" alt="Demonstração do sistema" />
</p>
**Frontend (.env.local)**
```env
VITE_API_URL=http://localhost:3001
VITE_ENV=development
```

## Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deploy

Ver [CHECKLIST_PRODUCAO.md](CHECKLIST_PRODUCAO.md) para instruções detalhadas.

### Backend (Render)
1. Criar conta em render.com
2. New Web Service → Connect GitHub
3. Build: `cd backend && npm install`
4. Start: `cd backend && npm start`
5. Adicionar variáveis de ambiente

### Frontend (Vercel)
```bash
npm i -g vercel
cd frontend
vercel --prod
```

## API Endpoints

### Autenticação
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### Relatórios
- GET /api/relatorios
- GET /api/relatorios/:id
- POST /api/relatorios
- PUT /api/relatorios/:id
- DELETE /api/relatorios/:id
- GET /api/relatorios/:id/pdf

### Clientes
- GET /api/clientes
- POST /api/clientes
- PUT /api/clientes/:id
- DELETE /api/clientes/:id

## Licença

MIT


### 📊 Dashboard
- Visão geral de estatísticas
- Relatórios recentes
- Clientes ativos
- Métricas do sistema

### 🆕 Recursos Avançados (2026)
- ✅ **WebSocket** - Notificações em tempo real
- ✅ **Layout Modular** - Dashboard refatorado (95% menor)
- ✅ **Testes Automatizados** - Vitest + React Testing Library
- ✅ **AI Assistant** - Assistente inteligente com NLP
- ✅ **Upload Avançado** - Drag & drop com preview
- ✅ **Busca Inteligente** - Filtros múltiplos e keyboard shortcuts
- ✅ **Backup Automatizado** - Scripts para AWS S3/GCS/Azure

## 🛠️ Tecnologias

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express 4** - Framework web
- **PostgreSQL 14+** - Banco de dados
- **Sequelize** - ORM para banco de dados
- **JWT** - Autenticação segura
- **Multer** - Upload de arquivos
- **PDFKit** - Geração de PDFs

### Frontend
- **React 19** - Biblioteca UI
- **Vite 7** - Build tool rápida
- **TailwindCSS 4** - Framework CSS
- **Framer Motion** - Animações
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **GitHub Actions** - CI/CD (planejado)

## 📦 Instalação

> **🚀 Quick Start**: Veja o [Guia de Início Rápido](QUICK_START.md) para setup em 5 minutos!

### Pré-requisitos

Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) 20 ou superior
- [PostgreSQL](https://www.postgresql.org/) 14 ou superior
- [Git](https://git-scm.com/)

### Clonando o Repositório

```bash
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema
```

### Configuração do Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais:
```env
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
```

5. Crie o banco de dados:
```bash
# Via psql
psql -U postgres
CREATE DATABASE seu_banco;
```

6. Execute as migrations (opcional):
```bash
npm run migrate
```

7. Inicie o servidor:
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### Configuração do Frontend

1. Em outro terminal, entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API (se necessário):
```bash
# Edite frontend/src/config/api.js
# Por padrão usa http://localhost:3001
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 🚀 Instalação Automática (Recomendado)

Para instalar todas as melhorias recentes (WebSocket, Testes, etc):

**Windows (PowerShell):**
```powershell
.\install-updates.ps1
```

**Linux/Mac:**
```bash
chmod +x install-updates.sh
./install-updates.sh
```

Este script instala:
- ✅ WebSocket (ws@^8.18.0)
- ✅ Vitest + React Testing Library
- ✅ Configurações de ambiente
- ✅ Todas as dependências

### Usando Docker (Recomendado)

A forma mais fácil de rodar o projeto completo:

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso irá:
- Criar o banco PostgreSQL
- Configurar o backend
- Configurar o frontend
- Expor as portas necessárias

Acesse: `http://localhost:5173`

## 🚀 Uso

### Primeiro Acesso

1. Acesse o sistema em `http://localhost:5173`
2. Faça login com as credenciais padrão (ou crie um usuário admin)
3. Configure os catálogos de peças e serviços
4. Cadastre seus clientes
5. Comece a criar relatórios!

### Criando um Relatório

1. Vá em **"Criar Relatório"**
2. Preencha os dados da ordem de serviço
3. Busque e selecione o cliente (ou cadastre um novo)
4. Escolha o tipo de relatório (Motor ou Bomba)
5. Adicione fotos das seções obrigatórias
6. Preencha as medições técnicas
7. Adicione peças e serviços cotados (opcional)
8. Clique em **"Gerar Relatório PDF"**

O PDF será gerado automaticamente e aberto em uma nova aba!

## 🧪 Testes

O projeto possui testes automatizados para garantir qualidade e confiabilidade.

### Rodando os Testes

**Backend:**
```bash
cd backend
npm test                    # Roda todos os testes
npm run test:watch         # Modo watch
npm run test:coverage      # Gera relatório de cobertura
```

**Frontend:**
```bash

# Sistema de Relatórios Técnicos

Sistema completo para gestão e geração de relatórios técnicos de manutenção industrial, desenvolvido com React, Node.js e PostgreSQL.

[![Build Status](https://img.shields.io/github/actions/workflow/status/Richard-Sup-Dev/edda-sistema/ci.yml?branch=main)](https://github.com/Richard-Sup-Dev/edda-sistema/actions)
[![License](https://img.shields.io/github/license/Richard-Sup-Dev/edda-sistema)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Richard-Sup-Dev/edda-sistema)](https://github.com/Richard-Sup-Dev/edda-sistema/issues)

## Visão Geral
Sistema web para gestão de relatórios técnicos, clientes e orçamentos, com autenticação segura, geração de PDFs e painel administrativo.


# Sistema de Relatórios Técnicos

Sistema web completo para gestão e geração de relatórios técnicos de manutenção industrial, com foco em **segurança, automação, escalabilidade e operação em produção**.

[![Build Status](https://img.shields.io/github/actions/workflow/status/Richard-Sup-Dev/edda-sistema/ci.yml?branch=main)](https://github.com/Richard-Sup-Dev/edda-sistema/actions)
[![License](https://img.shields.io/github/license/Richard-Sup-Dev/edda-sistema)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Richard-Sup-Dev/edda-sistema)](https://github.com/Richard-Sup-Dev/edda-sistema/issues)

## Visão Geral

Este sistema foi desenvolvido para atender empresas de manutenção industrial, permitindo o controle completo de clientes, relatórios técnicos, orçamentos e geração automática de PDFs profissionais com fotos e medições técnicas.

---

## Funcionalidades

### 📄 Relatórios Técnicos
- Criação de relatórios com múltiplas fotos
- Registro de medições técnicas (resistência, batimento)
- Geração automática de PDF formatado
- Histórico completo por cliente

### 👥 Clientes e Orçamentos
- Cadastro de clientes com CNPJ, endereço e contatos
- Upload de logo para personalização
- Catálogo de peças e serviços
- Geração de orçamentos integrados com cálculo automático

### 🔐 Segurança
- Autenticação JWT com roles
- Rate limiting
- Validação de dados
- Logs estruturados

---

## Tecnologias

**Backend**
- Node.js 20, Express
- PostgreSQL 14+
- Sequelize ORM
- JWT, Jest

**Frontend**
- React 19, Vite 7
- Tailwind CSS 4
- React Router, Axios
- Vitest

**DevOps**
- Docker e Docker Compose
- GitHub Actions (CI/CD)

---

## 🚀 Quick Start (Docker - Recomendado)

```bash
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema
docker-compose up -d
```

Acesse: http://localhost:5173

---

## Instalação Manual
Veja o guia completo em [QUICK_START.md](QUICK_START.md)

---

## Testes
```bash
# Backend
cd backend && npm test
# Frontend
cd frontend && npm run test
```

---

## API
A API REST expõe endpoints para autenticação, clientes, relatórios e orçamentos.

📘 Documentação completa disponível via [Swagger](./backend/SWAGGER_DOCUMENTATION.md).

Exemplos de uso: [API_EXEMPLOS.md](./API_EXEMPLOS.md)

---

## Roadmap
- Notificações em tempo real (WebSocket)
- Assistente inteligente com IA
- Busca avançada e filtros inteligentes
- Backup automatizado em nuvem

---

## Checklist Profissional
- CI/CD com GitHub Actions
- Testes automatizados
- Documentação de API
- Segurança avançada
- Docker e deploy
- Backup e restore

---

## Contribuição e Segurança
- [Guia de contribuição](CONTRIBUTING.md)
- [Política de segurança](SECURITY.md)

---

## Contato
Dúvidas ou sugestões? Abra uma issue ou envie um e-mail para richard@seudominio.com

---

## Licença
MIT
