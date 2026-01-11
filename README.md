# Sistema de Relatórios Técnicos

Sistema web completo para **gestão e geração de relatórios técnicos de manutenção industrial**, com foco em **segurança, automação, escalabilidade e operação em produção**.

[![Build Status](https://img.shields.io/github/actions/workflow/status/Richard-Sup-Dev/edda-sistema/ci.yml?branch=main)](https://github.com/Richard-Sup-Dev/edda-sistema/actions)
[![License](https://img.shields.io/github/license/Richard-Sup-Dev/edda-sistema)](LICENSE)

---

## 📌 Visão Geral

Esta plataforma foi desenvolvida para empresas de **manutenção industrial** que precisam organizar **clientes, relatórios técnicos e orçamentos**, oferecendo **geração automática de PDFs profissionais** com fotos, medições técnicas e identidade visual do cliente.

O sistema foi projetado para uso real em produção, adotando boas práticas de **arquitetura, segurança, testes automatizados e DevOps**.

---

## ⚙️ Funcionalidades Principais

### 📄 Relatórios Técnicos

* Criação de relatórios técnicos com múltiplas fotos
* Registro de medições técnicas (ex.: resistência, batimento)
* Geração automática de PDF profissional
* Histórico completo de relatórios por cliente

### 👥 Clientes e Orçamentos

* Cadastro de clientes com CNPJ, endereço e contatos
* Upload de logotipo para personalização dos relatórios
* Catálogo de peças e serviços
* Orçamentos integrados com cálculo automático

### 📊 Dashboard

* Visão geral de estatísticas
* Relatórios recentes
* Clientes ativos
* Métricas do sistema

### 🔐 Segurança

* Autenticação JWT com controle de permissões (roles)
* Rate limiting
* Validação rigorosa de dados
* Logs estruturados para auditoria e monitoramento

---

## 🧠 Tecnologias Utilizadas

### Backend

* **Node.js 20** — Runtime JavaScript
* **Express 4** — Framework web
* **PostgreSQL 14+** — Banco de dados relacional
* **Sequelize ORM** — Mapeamento objeto-relacional
* **JWT** — Autenticação segura
* **Multer** — Upload de arquivos
* **PDFKit** — Geração de PDFs
* **Jest** — Testes automatizados

### Frontend

* **React 19** — Biblioteca de interface
* **Vite 7** — Build tool de alta performance
* **Tailwind CSS 4** — Estilização
* **React Router** — Roteamento
* **Axios** — Cliente HTTP
* **Vitest + React Testing Library** — Testes
* **Framer Motion** — Animações
* **Lucide React** — Ícones

### DevOps

* **Docker** — Containerização
* **Docker Compose** — Orquestração local
* **GitHub Actions** — CI/CD

---

## 🚀 Quick Start (Docker — Recomendado)

```bash
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema
docker-compose up -d
```

Acesse: **[http://localhost:5173](http://localhost:5173)**

---

## 📦 Instalação Manual

### Pré-requisitos

* Node.js 20+
* PostgreSQL 14+
* Git

### Clonando o Repositório

```bash
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema
```

### Configuração do Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configure o arquivo `.env`:

```env
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=sua_chave_secreta
PORT=3001
```

Crie o banco de dados:

```sql
CREATE DATABASE seu_banco;
```

Inicie o servidor:

```bash
npm run dev
```

Backend disponível em: **[http://localhost:3001](http://localhost:3001)**

---

### Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: **[http://localhost:5173](http://localhost:5173)**

---

## 🌐 Deploy

### Frontend (Vercel)

```bash
npm i -g vercel
cd frontend
vercel --prod
```

### Backend

Consulte o guia completo em [DEPLOY.md](DEPLOY.md)

---

## 🔌 API

### Autenticação

* POST `/api/auth/login`
* POST `/api/auth/register`
* POST `/api/auth/forgot-password`
* POST `/api/auth/reset-password`

### Relatórios

* GET `/api/relatorios`
* GET `/api/relatorios/:id`
* POST `/api/relatorios`
* PUT `/api/relatorios/:id`
* DELETE `/api/relatorios/:id`
* GET `/api/relatorios/:id/pdf`

### Clientes

* GET `/api/clientes`
* POST `/api/clientes`
* PUT `/api/clientes/:id`
* DELETE `/api/clientes/:id`

📘 Documentação completa disponível via **Swagger**.

---

## 🧪 Testes

### Backend

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend

```bash
cd frontend
npm run test
```

---

## 🗺️ Roadmap

* Notificações em tempo real (WebSocket)
* Assistente inteligente com IA
* Busca avançada e filtros
* Backup automatizado em nuvem

---

## 📋 Checklist Profissional

* Arquitetura escalável
* Testes automatizados
* Documentação completa
* Segurança avançada
* Docker e deploy
* Pronto para produção

---

## 🤝 Contribuição e Segurança

* Guia de contribuição: [CONTRIBUTING.md](CONTRIBUTING.md)
* Política de segurança: [SECURITY.md](SECURITY.md)

---

## 📬 Contato

Dúvidas ou sugestões? Abra uma issue ou envie um e-mail para:

📧 **[natsunokill188@gmail.com](mailto:natsunokill188@gmail.com)**

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.
