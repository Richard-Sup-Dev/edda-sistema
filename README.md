# EDDA Sistema - Gestão de Relatórios Técnicos

![License](https://img.shields.io/badge/license-ISC-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![React](https://img.shields.io/badge/react-19-blue)
![PostgreSQL](https://img.shields.io/badge/postgresql-14%2B-blue)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen)

Um sistema web completo para gerenciar relatórios técnicos, clientes, peças e serviços. Desenvolvido com React, Node.js e PostgreSQL, pronto para produção.

## O que é o EDDA?

EDDA é uma plataforma desenvolvida para simplificar a geração e gestão de relatórios técnicos. Se você trabalha com manutenção de equipamentos, gestão de inventário ou prestação de serviços técnicos, esse sistema pode ajudar.

O projeto surgiu da necessidade real de organizar documentos, rastrear peças e manter histórico de serviços - tudo em um só lugar.

## Principais Funcionalidades

- **Dashboard interativo** - Visualize métricas e gráficos do seu negócio
- **Gestão de clientes** - CRUD completo para administrar sua base de clientes
- **Catálogo de peças** - Organize e controle seu inventário
- **Registro de serviços** - Documente todos os serviços prestados
- **Autenticação segura** - Acesso protegido com JWT e roles
- **Validação de dados** - Todos os campos são validados no servidor
- **Interface moderna** - Design responsivo e intuitivo

## Stack Tecnológico

### Frontend
- React 19 com Vite (desenvolvimento rápido)
- TailwindCSS para estilização
- Recharts para visualização de dados
- Axios para requisições HTTP

### Backend
- Node.js com Express
- PostgreSQL como banco de dados
- JWT para autenticação
- Winston para logging estruturado

### Infraestrutura
- Docker e Docker Compose
- Nginx como reverse proxy
- Pronto para produção

## Como Começar

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/Richard-Sup-Dev/edda-sistema.git
cd edda-sistema

# Inicie os containers
docker-compose up -d

# Acesse a aplicação
# Frontend: http://localhost
# Backend: http://localhost:3001
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```env
# Banco de Dados
DB_NAME=edda_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha_segura
DATABASE_URL=postgresql://seu_usuario:sua_senha_segura@postgres:5432/edda_db

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRY=8h

# Frontend
FRONTEND_URL=http://localhost

# Email (opcional para funcionalidades de reset)
EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=sua_senha_app
```

## Testes

```bash
# Executar testes do backend
cd backend
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

### CI/CD

O projeto possui pipeline automático de CI/CD com GitHub Actions que:
- Executa testes automaticamente em cada push/PR
- Verifica qualidade de código (linting)
- Testa build do Docker
- Executa auditoria de segurança
- Gera relatórios de cobertura de testes

## Documentação da API

A API é documentada com Swagger/OpenAPI. Após iniciar o servidor:

- **Docs interativa**: `http://localhost:3001/api-docs`
- **Especificação OpenAPI**: `http://localhost:3001/api-docs/swagger.json`

Você pode testar todos os endpoints diretamente pelo navegador!

## Documentação

Para documentação completa e detalhada, consulte a [pasta docs/](./docs/).

### Principais Guias:

- [Guia de Implementação](./backend/README_IMPLEMENTACAO.md) - Detalhes técnicos do projeto
- [Guia de Segurança](./backend/GUIA_SEGURANCA_PRODUCAO.md) - Práticas de segurança
- [Guia de Deploy](./docs/GUIA_DEPLOYMENT_PRODUCAO.md) - Como fazer deploy em produção
- [Quick Start](./docs/QUICK_START.md) - Começar rapidamente
- [Documentação Completa](./docs/INDICE_COMPLETO_DOCUMENTACAO.md) - Índice de toda documentação

## Deploy em Produção

```bash
# Construir as imagens
docker-compose -f docker-compose.yml build

# Executar em produção
docker-compose up -d
```

## Estrutura do Projeto

```
edda-sistema/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── server.js       # Arquivo principal
│   │   ├── routes/         # Rotas da API
│   │   ├── controllers/    # Lógica das rotas
│   │   ├── middlewares/    # Middlewares customizados
│   │   └── models/         # Modelos do banco
│   ├── __tests__/          # Testes automatizados
│   └── Dockerfile
│
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas principais
│   │   ├── hooks/          # Hooks customizados
│   │   └── App.jsx         # Componente raiz
│   ├── public/             # Arquivos estáticos
│   └── Dockerfile
│
└── docker-compose.yml      # Orquestração dos containers
```

## Contribuindo

Se você encontrar bugs ou tiver sugestões de melhorias, fique à vontade para abrir uma issue ou fazer um pull request.

## Segurança

Alguns pontos importantes:

- **Nunca** versione o arquivo `.env` com credenciais reais
- Senhas devem ser sempre hasheadas com bcrypt
- Use HTTPS em produção
- Mantenha as dependências atualizadas
- Execute `npm audit` regularmente

## Licença

ISC License - veja [LICENSE](./LICENSE) para detalhes

## Contato

Dúvidas? Abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ para simplificar a gestão técnica**
