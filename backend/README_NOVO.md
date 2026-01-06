# EDDA Backend - API REST

API Node.js que alimenta a plataforma EDDA de gestão de relatórios técnicos.

## Desenvolvimento

### Requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Setup Rápido

```bash
# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite .env com suas credenciais

# Executar em desenvolvimento
npm run dev

# Rodar testes
npm test
```

### Estrutura da API

```
src/
├── server.js           # Arquivo principal
├── routes/             # Endpoints da API
├── controllers/        # Lógica dos endpoints
├── middlewares/        # Middlewares customizados
├── models/             # Modelos do banco (Sequelize)
├── config/             # Configurações
└── __tests__/          # Testes automatizados
```

## Endpoints Principais

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Renovar token

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

### Peças
- `GET /api/pecas` - Listar peças
- `POST /api/pecas` - Criar nova peça
- `PUT /api/pecas/:id` - Atualizar peça
- `DELETE /api/pecas/:id` - Deletar peça

### Serviços
- `GET /api/servicos` - Listar serviços
- `POST /api/servicos` - Criar novo serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Deletar serviço

## Tecnologias

- **Express** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **Joi** - Validação de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Winston** - Logging estruturado
- **Jest** - Testes automatizados

## Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/edda_db

# Autenticação
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRY=8h

# Servidor
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Email
EMAIL_USER=seu-email@gmail.com
EMAIL_APP_PASS=sua_senha_app
```

## Testes

```bash
# Executar todos os testes
npm test

# Modo watch (re-executar ao salvar)
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## Segurança

- ✅ Validação de entrada com Joi
- ✅ Autenticação JWT
- ✅ Senhas hasheadas com bcrypt
- ✅ Rate limiting em endpoints críticos
- ✅ CORS configurável
- ✅ Headers de segurança com Helmet
- ✅ Logging de erros estruturado

## Deploy em Produção

1. Configure as variáveis de ambiente em `.env`
2. Execute as migrations: `npm run migrate:up`
3. Inicie a aplicação: `npm start`

Ou use Docker:

```bash
docker-compose up -d
```

## Scripts Disponíveis

```bash
npm start              # Iniciar servidor
npm run dev            # Iniciar com nodemon (desenvolvimento)
npm test               # Rodar testes
npm run test:watch     # Testes em modo watch
npm run test:coverage  # Cobertura de testes
npm run lint           # Validar código
```

## Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -m "Adiciona nova feature"`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

## Suporte

Encontrou um problema? Abra uma issue no repositório.

---

**Desenvolvido para tornar mais segura e eficiente a gestão técnica**
