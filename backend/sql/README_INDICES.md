# ÍNDICES DE BANCO DE DADOS

## Objetivo
Melhorar performance de queries frequentes adicionando índices nas colunas mais consultadas.

## Como executar

### Opção 1: Via psql (Recomendado)
```bash
# Conecte-se ao banco de dados
psql -h localhost -U edda_user -d edda_db

# Execute o arquivo SQL
\i backend/sql/add-indexes.sql

# Ou via linha de comando:
psql -h localhost -U edda_user -d edda_db -f backend/sql/add-indexes.sql
```

### Opção 2: Via script Node.js
```bash
# Configure as variáveis de ambiente no .env:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edda_db
DB_USER=edda_user
DB_PASSWORD=sua_senha

# Execute o script
node backend/sql/run-indexes.js
```

### Opção 3: Via Docker
```bash
# Se estiver usando Docker
docker exec -i postgres_container psql -U edda_user -d edda_db < backend/sql/add-indexes.sql
```

## Índices criados

### Clientes
- `idx_clientes_cnpj` - Busca por CNPJ
- `idx_clientes_email` - Busca por email
- `idx_clientes_nome_fantasia` - Busca por nome

### Relatórios
- `idx_relatorios_cliente_id` - Join com clientes
- `idx_relatorios_created_at` - Ordenação por data
- `idx_relatorios_status` - Filtro por status
- `idx_relatorios_os_numero` - Busca por número OS
- `idx_relatorios_cliente_data` - Busca composta (cliente + data)
- `idx_relatorios_status_data` - Busca composta (status + data)

### Usuários
- `idx_usuarios_email` - Login e busca
- `idx_usuarios_role` - Filtro por permissão

### NFs
- `idx_nfs_cliente_id` - Join com clientes
- `idx_nfs_data_emissao` - Ordenação por data
- `idx_nfs_numero` - Busca por número NF

### Atividades
- `idx_atividades_relatorio_id` - Join com relatórios
- `idx_atividades_created_at` - Ordenação por data
- `idx_atividades_tipo` - Filtro por tipo

### Peças
- `idx_pecas_codigo_fabrica` - Busca por código
- `idx_pecas_categoria` - Filtro por categoria
- `idx_pecas_ativo` - Filtro por status

### Serviços
- `idx_servicos_categoria` - Filtro por categoria
- `idx_servicos_ativo` - Filtro por status

### Notificações
- `idx_notificacoes_usuario_id` - Join com usuários
- `idx_notificacoes_lida` - Filtro por status
- `idx_notificacoes_created_at` - Ordenação por data
- `idx_notificacoes_usuario_lida` - Busca composta (usuário + status)

## Impacto esperado
- **Queries de busca**: 70-90% mais rápidas
- **Joins**: 50-70% mais rápidos
- **Ordenação**: 60-80% mais rápida
- **Filtros**: 80-95% mais rápidos

## Verificação
Execute para verificar os índices criados:
```sql
-- Ver todos os índices
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Ver tamanho dos índices
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```
