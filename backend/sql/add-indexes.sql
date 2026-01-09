-- backend/sql/add-indexes.sql
-- Adicionar índices para otimizar queries frequentes

-- ==================== CLIENTES ====================
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_nome_fantasia ON clientes(nome_fantasia);

-- ==================== RELATÓRIOS ====================
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente_id ON relatorios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_created_at ON relatorios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_relatorios_status ON relatorios(status);
CREATE INDEX IF NOT EXISTS idx_relatorios_os_numero ON relatorios(os_numero);

-- ==================== USUÁRIOS ====================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

-- ==================== NFS ====================
CREATE INDEX IF NOT EXISTS idx_nfs_cliente_id ON nfs(cliente_id);
CREATE INDEX IF NOT EXISTS idx_nfs_data_emissao ON nfs(data_emissao DESC);
CREATE INDEX IF NOT EXISTS idx_nfs_numero ON nfs(numero);

-- ==================== ATIVIDADES ====================
CREATE INDEX IF NOT EXISTS idx_atividades_relatorio_id ON atividades(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_atividades_created_at ON atividades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_atividades_tipo ON atividades(tipo);

-- ==================== PEÇAS ====================
CREATE INDEX IF NOT EXISTS idx_pecas_codigo_fabrica ON pecas(codigo_fabrica);
CREATE INDEX IF NOT EXISTS idx_pecas_categoria ON pecas(categoria);
CREATE INDEX IF NOT EXISTS idx_pecas_ativo ON pecas(ativo);

-- ==================== SERVIÇOS ====================
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_ativo ON servicos(ativo);

-- ==================== NOTIFICAÇÕES ====================
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario_id ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created_at ON notificacoes(created_at DESC);

-- ==================== ÍNDICES COMPOSTOS ====================
-- Para queries que filtram por cliente + data
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente_data ON relatorios(cliente_id, created_at DESC);

-- Para queries que filtram por usuário + lida
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario_lida ON notificacoes(usuario_id, lida);

-- Para queries que filtram por status + data
CREATE INDEX IF NOT EXISTS idx_relatorios_status_data ON relatorios(status, created_at DESC);

-- ==================== ANÁLISE DE PERFORMANCE ====================
-- Executar após criar os índices:
-- ANALYZE clientes;
-- ANALYZE relatorios;
-- ANALYZE usuarios;
-- ANALYZE nfs;
-- ANALYZE atividades;
-- ANALYZE pecas;
-- ANALYZE servicos;
-- ANALYZE notificacoes;
