# 🧪 Configuração do Banco de Dados para Testes

Este guia mostra como configurar o banco de dados Neon para executar todos os testes do backend.

## 📋 Pré-requisitos

- Conta no [Neon](https://neon.tech) (gratuita)
- Node.js 18+ instalado
- Git Bash ou terminal com suporte a comandos Unix (no Windows)

## 🚀 Passo a Passo

### 1. Criar Banco de Dados no Neon

1. Acesse [https://neon.tech](https://neon.tech) e faça login
2. Clique em **"Create Project"**
3. Nomeie o projeto como `edda-test` (ou outro nome de sua preferência)
4. Selecione a região mais próxima
5. Clique em **"Create Project"**

### 2. Obter a String de Conexão

1. No painel do Neon, vá para **"Connection Details"**
2. Copie a **Connection String** que se parece com:
   ```
   postgresql://usuario:senha@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Configurar Variáveis de Ambiente

#### Opção A: Criar arquivo `.env.test` (Recomendado)

Crie ou edite o arquivo `backend/.env.test`:

```bash
NODE_ENV=test
PORT=3001

# 🔑 COLE SUA CONNECTION STRING DO NEON AQUI
DATABASE_URL=postgresql://usuario:senha@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Outras configurações de teste
JWT_SECRET=test_secret_key_very_secure_for_testing_only
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
SERVER_BASE_URL=http://localhost:3001

# Email (não usado em testes, mas necessário para alguns imports)
EMAIL_USER=test@example.com
EMAIL_APP_PASS=test_password
EMAIL_FROM=Test <test@example.com>
EMAIL_SERVICE=gmail
```

#### Opção B: Usar variável de ambiente temporária

```bash
# Windows PowerShell
$env:DATABASE_URL="sua-connection-string-aqui"

# Linux/Mac/Git Bash
export DATABASE_URL="sua-connection-string-aqui"
```

### 4. Instalar Dependências (se necessário)

```bash
cd backend
npm install pg dotenv
```

### 5. Executar Script de Setup

```bash
cd backend
node scripts/setup-test-db.js
```

Você verá uma saída como:

```
🔧 Configurando banco de dados de testes...

📊 Conectando ao banco de dados...
✅ Conectado ao banco de dados!

📄 Carregando schema de: C:\...\backend\sql\schema-test.sql
🗄️  Executando SQL...

✅ Tabelas criadas com sucesso!
✅ Índices criados com sucesso!
✅ Dados iniciais inseridos!

📋 Tabelas criadas:
   ✓ clientes
   ✓ fotos_relatorio
   ✓ logs_sistema
   ✓ medicoes_batimento
   ✓ medicoes_isolamento
   ✓ nf_emitente
   ✓ notas_fiscais
   ✓ pecas
   ✓ pecas_atuais
   ✓ relatorio_pecas
   ✓ relatorio_servicos
   ✓ relatorios
   ✓ servicos
   ✓ users
   ✓ usuarios

🎉 Banco de dados de testes configurado com sucesso!

▶️  Agora você pode executar os testes:
   npm test
   npm test -- --coverage
```

### 6. Executar Testes

```bash
# Todos os testes
npm test

# Com cobertura
npm test -- --coverage

# Apenas testes unitários (sem DB)
npm test -- --testPathIgnorePatterns="auth.test.js|clientes.test.js"

# Todos os testes incluindo integração
npm test -- --runInBand
```

## 📊 Estrutura do Banco de Dados

O script cria as seguintes tabelas:

### Autenticação e Usuários
- `users` - Usuários do sistema (auth)
- `usuarios` - Usuários do módulo de relatórios

### Entidades Principais
- `clientes` - Dados dos clientes
- `pecas` - Catálogo de peças
- `servicos` - Catálogo de serviços
- `relatorios` - Relatórios técnicos

### Relacionamentos
- `relatorio_pecas` - Peças usadas em relatórios
- `relatorio_servicos` - Serviços prestados em relatórios
- `medicoes_isolamento` - Medições de isolamento
- `medicoes_batimento` - Medições de batimento
- `fotos_relatorio` - Fotos anexadas aos relatórios

### Financeiro
- `notas_fiscais` - Notas fiscais emitidas
- `nf_emitente` - Dados do emitente

### Infraestrutura
- `logs_sistema` - Logs de auditoria

## 🧹 Resetar Banco de Dados

Se precisar limpar e recriar todas as tabelas:

```bash
node scripts/setup-test-db.js
```

O script automaticamente remove as tabelas antigas antes de criar as novas.

## 🔍 Verificar Configuração

### Verificar Conexão

```bash
# PowerShell
node -e "import('pg').then(({default:pg})=>{ const c=new pg.Client({connectionString:process.env.DATABASE_URL,ssl:{require:true,rejectUnauthorized:false}}); c.connect().then(()=>{console.log('✅ Conectado!'); c.end();}).catch(e=>console.error('❌',e.message)); })"
```

### Verificar Tabelas

```bash
node scripts/check-tables.js
```

## 🐛 Solução de Problemas

### Erro: "DATABASE_URL não está configurada"

**Solução:** Configure a variável de ambiente no arquivo `.env.test` ou como variável de ambiente do sistema.

### Erro: "ECONNREFUSED"

**Solução:** Verifique se:
- A connection string está correta
- O banco Neon está ativo (não pausado)
- Há conexão com a internet

### Erro: "SSL required"

**Solução:** A connection string do Neon deve terminar com `?sslmode=require`. O script já configura SSL automaticamente.

### Erro: "password authentication failed"

**Solução:** A senha na connection string pode ter expirado. Gere uma nova connection string no painel do Neon.

## 📝 Notas Importantes

1. **Dados de Teste:** O script insere dados iniciais automaticamente (usuários, clientes, peças, serviços)
2. **Ambiente Isolado:** Use um banco separado para testes (não o de produção!)
3. **Neon Free Tier:** Permite até 0.5 GB de storage e 10 GB de transferência/mês
4. **Auto-suspend:** O Neon pausa o banco após 5 minutos de inatividade (tier gratuito)

## 🎯 Próximos Passos

Após configurar o banco:

1. Execute os testes: `npm test -- --coverage`
2. Verifique a cobertura: deve subir de ~7% para próximo de 80%
3. Todos os 388 testes devem passar
4. Configure CI/CD com GitHub Actions (opcional)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do script
2. Teste a conexão manualmente
3. Consulte a [documentação do Neon](https://neon.tech/docs)
