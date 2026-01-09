# 🧪 Configuração do Banco de Dados para Testes

## 📋 Pré-requisitos

1. Conta no [Neon](https://neon.tech) (gratuita)
2. Node.js instalado
3. Acesso ao terminal

## 🚀 Passo a Passo

### 1️⃣ Criar Banco de Dados no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Clique em **"Create Project"**
3. Configure:
   - **Project Name**: `sistema-relatorios-test`
   - **Region**: Escolha a mais próxima (ex: `US East`)
   - **Postgres Version**: 15 ou superior
4. Clique em **"Create Project"**
5. Copie as credenciais fornecidas

### 2️⃣ Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cd backend
   copy .env.test.example .env.test
   ```

2. Edite o arquivo `.env.test` com suas credenciais do Neon:
   ```env
   DB_HOST=ep-xxxxx-xxxxx.us-east-2.aws.neon.tech
   DB_PORT=5432
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=neondb
   DB_SSL=true
   
   JWT_SECRET=test-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   NODE_ENV=test
   ```

### 3️⃣ Instalar Dependências (se necessário)

```bash
npm install pg dotenv bcrypt
```

### 4️⃣ Configurar o Banco de Dados

Execute o script de setup:

```bash
node scripts/setup-test-db.js
```

**Saída esperada:**
```
🔗 Conectando ao banco de dados de testes...
✅ Conectado com sucesso!

📋 Criando schema...
✅ Schema criado com sucesso!

🌱 Populando dados de teste...
✅ Dados de teste inseridos com sucesso!

📊 Verificando dados inseridos:
   usuarios: 4 registros
   clientes: 4 registros
   pecas: 8 registros
   servicos: 8 registros
   relatorios: 3 registros
   notas_fiscais: 1 registros

✨ Banco de dados de testes configurado com sucesso!
```

### 5️⃣ Executar os Testes

#### Todos os testes:
```bash
npm test
```

#### Com cobertura:
```bash
npm test -- --coverage
```

#### Apenas testes específicos:
```bash
# Testes de clientes
npm test -- clientes.test.js

# Testes de relatórios
npm test -- relatorios.test.js

# Testes de autenticação
npm test -- auth.test.js
```

## 📊 Dados de Teste Disponíveis

### 👥 Usuários (senha: `senha123` para todos)

| Email | Perfil | Pode Emitir NF |
|-------|--------|----------------|
| admin@test.com | admin | Sim |
| joao@test.com | membro | Não |
| maria@test.com | gerente | Sim |
| pedro@test.com | membro (inativo) | Não |

### 🏢 Clientes

1. **Empresa Alfa Ltda** - CNPJ: 11.222.333/0001-81
2. **Indústria Beta S/A** - CNPJ: 22.333.444/0001-92
3. **Comércio Gama ME** - CNPJ: 33.444.555/0001-03
4. **João Pessoa Física** - CPF: 123.456.789-00

### 🔧 Peças (8 itens)

- Parafuso M10, Rolamento 6205, Correia Dentada, etc.

### 🛠️ Serviços (8 itens)

- Manutenção Preventiva, Corretiva, Instalação Elétrica, etc.

### 📄 Relatórios (3 relatórios)

1. **RTE-2026-001** - Manutenção Preventiva (aberto)
2. **RTE-2026-002** - Análise de Falha (fechado, com NF)
3. **RTE-2026-003** - Instalação (em andamento)

## 🔧 Estrutura do Banco

### Tabelas Principais
- `clientes` - Dados dos clientes (PJ e PF)
- `usuarios` - Usuários do sistema
- `pecas` - Catálogo de peças
- `servicos` - Catálogo de serviços
- `relatorios` - Relatórios técnicos
- `notas_fiscais` - Notas fiscais emitidas

### Tabelas Relacionadas
- `relatorio_pecas` - Peças usadas nos relatórios
- `relatorio_servicos` - Serviços prestados nos relatórios
- `medicoes_isolamento` - Medições de isolamento
- `medicoes_batimento` - Medições de batimento
- `fotos_relatorio` - Fotos dos relatórios
- `pecas_atuais` - Peças identificadas
- `logs_sistema` - Logs de auditoria
- `nf_emitente` - Dados do emitente de NF

## 🔍 Verificação Manual

Você pode conectar ao banco via Neon Console ou qualquer cliente PostgreSQL:

```bash
# Via psql
psql "postgresql://usuario:senha@host/neondb?sslmode=require"
```

Comandos úteis:
```sql
-- Ver todas as tabelas
\dt

-- Contar registros
SELECT COUNT(*) FROM usuarios;

-- Ver relatórios
SELECT id, numero_rte, titulo_relatorio, status FROM relatorios;

-- Ver últimos logs
SELECT * FROM logs_sistema ORDER BY timestamp DESC LIMIT 10;
```

## 🐛 Resolução de Problemas

### Erro: "relation does not exist"
**Solução**: Execute novamente o script de setup
```bash
node scripts/setup-test-db.js
```

### Erro: "connection refused"
**Solução**: Verifique se:
1. As credenciais no `.env.test` estão corretas
2. O projeto no Neon está ativo
3. Seu IP está permitido (Neon geralmente permite todos)

### Erro: "password authentication failed"
**Solução**: 
1. Copie novamente a senha do Neon Console
2. Certifique-se de não ter espaços extras no `.env.test`

### Testes falhando
**Solução**:
1. Verifique se o banco foi populado: `node scripts/setup-test-db.js`
2. Execute os testes individualmente para identificar o problema
3. Verifique se o `.env.test` está sendo carregado corretamente

## 📈 Meta de Cobertura

**Objetivo**: 80% de cobertura de código

**Situação Atual (sem DB)**: 7.41%

**Com DB configurado**: Esperado ~70-80%

### Executar com relatório detalhado:
```bash
npm test -- --coverage --coverageReporters=text --coverageReporters=html
```

Depois abra `coverage/index.html` no navegador.

## 🔄 Resetar Banco de Dados

Para limpar e recriar tudo do zero:

```bash
node scripts/setup-test-db.js
```

O script automaticamente:
1. Remove todas as tabelas existentes
2. Recria o schema
3. Insere dados de teste

## 📝 Próximos Passos

Após configurar o banco:

1. ✅ Execute `npm test` para validar
2. ✅ Verifique a cobertura com `npm test -- --coverage`
3. ✅ Corrija testes falhando (se houver)
4. ✅ Documente novos testes criados

## 💡 Dicas

- O Neon tem um plano gratuito generoso (500MB)
- Use branches no Neon para diferentes ambientes
- Configure auto-suspend no Neon para economizar recursos
- Mantenha `.env.test` no `.gitignore`

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do Neon Console
2. Execute `node scripts/setup-test-db.js` com mais detalhes
3. Verifique a conexão: `SELECT version();`
