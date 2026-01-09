# Sistema de Relatórios Técnicos

Sistema completo para gestão e geração de relatórios técnicos de manutenção de equipamentos industriais. Desenvolvido para facilitar o trabalho de empresas de manutenção que precisam documentar serviços, gerenciar clientes e criar orçamentos profissionais.

[![Build Status](https://github.com/Richard-Sup-Dev/edda-sistema/actions/workflows/ci.yml/badge.svg)](https://github.com/Richard-Sup-Dev/edda-sistema/actions)
[![License](https://img.shields.io/github/license/Richard-Sup-Dev/edda-sistema)](LICENSE)
[![Node](https://img.shields.io/badge/node-20+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-14+-blue)](https://www.postgresql.org/)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/Richard-Sup-Dev/edda-sistema)
[![Stars](https://img.shields.io/github/stars/Richard-Sup-Dev/edda-sistema)](https://github.com/Richard-Sup-Dev/edda-sistema/stargazers)
[![Issues](https://img.shields.io/github/issues/Richard-Sup-Dev/edda-sistema)](https://github.com/Richard-Sup-Dev/edda-sistema/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Richard-Sup-Dev/edda-sistema)](https://github.com/Richard-Sup-Dev/edda-sistema/commits/main)

## 🎯 Visão Geral

Este sistema foi criado para resolver problemas reais enfrentados por empresas de manutenção:
- Dificuldade em organizar relatórios técnicos
- Necessidade de gerar PDFs profissionais rapidamente
- Controle de peças e serviços cotados
- Histórico completo de atendimentos por cliente

Com uma interface moderna e intuitiva, o sistema permite criar relatórios completos em minutos, incluindo fotos, medições técnicas e orçamentos detalhados.

## ✨ Funcionalidades Principais

### 📋 Gestão de Relatórios
- Criação de relatórios técnicos para motores e bombas
- Upload de múltiplas fotos com legendas
- Registro de medições técnicas (resistência, batimento, etc.)
- Geração automática de PDF formatado
- Histórico completo de relatórios por cliente

### 👥 Gestão de Clientes
- Cadastro completo com CNPJ, endereço e contatos
- Busca rápida por nome ou CNPJ
- Histórico de atendimentos
- Upload de logo do cliente para personalização

### 💰 Orçamentos
- Catálogo de peças com preços
- Catálogo de serviços
- Geração de orçamentos integrados ao relatório
- Cálculo automático de totais

### 🔐 Segurança
- Autenticação JWT com roles (admin/user)
- Proteção de rotas
- Rate limiting para prevenir abusos
- Validação de dados no backend e frontend

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
cd frontend
npm test                    # Roda testes do frontend
npm run test:coverage      # Cobertura de testes
```

### Cobertura de Testes

- **Backend:** 85% de cobertura
- **Frontend:** 75% de cobertura
- **Total:** 80% de cobertura

Os relatórios detalhados são gerados em `coverage/` após rodar `npm run test:coverage`.

## 📚 Documentação da API

A API REST possui documentação interativa via Swagger.

### Acessando a Documentação

Com o backend rodando, acesse:

```
http://localhost:3001/api-docs
```

A documentação inclui:
- Todos os endpoints disponíveis
- Parâmetros de entrada e saída
- Exemplos de requisições
- Códigos de resposta
- Teste interativo de endpoints

## 📁 Estrutura do Projeto

```
edda-sistema/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── config/         # Configurações (DB, JWT, etc)
│   │   ├── controllers/    # Controladores das rotas
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Definição de rotas
│   │   ├── middlewares/    # Middlewares (auth, etc)
│   │   ├── services/       # Lógica de negócio
│   │   └── utils/          # Funções auxiliares
│   ├── uploads/            # Arquivos enviados
│   └── package.json
├── frontend/               # App React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Context API
│   │   ├── features/       # Features por módulo
│   │   ├── services/       # Chamadas API
│   │   └── styles/         # Estilos globais
│   └── package.json
├── docker-compose.yml      # Configuração Docker
└── README.md
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

#### Backend (.env)
```env
# Banco de dados
DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASS=senha
DB_HOST=localhost
DB_PORT=5432

# Servidor
PORT=3001
NODE_ENV=development

# Segurança
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=24h

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha
```

### Produção

Para deploy em produção:

1. Configure as variáveis de ambiente para produção
2. Compile o frontend:
```bash
cd frontend
npm run build
```

3. Configure um servidor web (Nginx) para servir os arquivos estáticos
4. Configure o PM2 para gerenciar o processo Node.js:
```bash
npm install -g pm2
pm2 start backend/src/server.js --name api-relatorios
```

## 📚 Documentação Adicional

- **[PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md)** - Guia das últimas implementações
- **[MELHORIAS_IMPLEMENTADAS.md](MELHORIAS_IMPLEMENTADAS.md)** - Detalhes de todas as melhorias
- **[frontend/TESTING.md](frontend/TESTING.md)** - Guia completo de testes
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de versões
- **[QUICK_START.md](QUICK_START.md)** - Guia de início rápido (5 minutos)
- **[DEPLOY.md](DEPLOY.md)** - Guia completo de deploy em produção
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Status atual e roadmap
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Como contribuir
- **[SECURITY.md](SECURITY.md)** - Política de segurança

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por Richard

## 📧 Suporte

Se encontrar problemas ou tiver sugestões:
- Abra uma [issue](https://github.com/Richard-Sup-Dev/edda-sistema/issues)
- Entre em contato via email: natsunokill188@gmail.com

---

**Nota:** Este é um projeto em desenvolvimento ativo. Novas features estão sendo adicionadas regularmente.
