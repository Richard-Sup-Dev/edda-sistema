-- ============================================
-- MIGRATIONS - EDDA Sistema
-- ============================================
-- Este arquivo contém as migrações para evoluir
-- o schema do banco de dados
-- ============================================

-- ============================================
-- MIGRATION 001 - Adicionar campos de auditoria
-- Data: 2026-01-09
-- ============================================

-- Adicionar campo de último login nos usuários
ALTER TABLE users ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP;

-- ============================================
-- MIGRATION 002 - Melhorias de performance
-- Data: 2026-01-09
-- ============================================

-- Índice composto para busca de relatórios por cliente e data
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente_data 
ON relatorios(cliente_id, data_emissao DESC);

-- Índice para busca de relatórios recentes
CREATE INDEX IF NOT EXISTS idx_relatorios_criado_em 
ON relatorios(criado_em DESC);

-- ============================================
-- MIGRATION 003 - Soft Delete
-- Data: 2026-01-09
-- ============================================

-- Adicionar campo de soft delete em tabelas principais
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP;
ALTER TABLE pecas ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP;
ALTER TABLE relatorios ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP;

-- Índices para soft delete
CREATE INDEX IF NOT EXISTS idx_clientes_deletado ON clientes(deletado_em) WHERE deletado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_pecas_deletado ON pecas(deletado_em) WHERE deletado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_servicos_deletado ON servicos(deletado_em) WHERE deletado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_relatorios_deletado ON relatorios(deletado_em) WHERE deletado_em IS NULL;

-- ============================================
-- MIGRATION 004 - Views atualizadas
-- Data: 2026-01-09
-- ============================================

-- Atualizar view de relatórios para considerar soft delete
CREATE OR REPLACE VIEW vw_relatorios_ativos AS
SELECT 
    r.id,
    r.os_numero,
    r.numero_rte,
    r.titulo_relatorio,
    r.data_emissao,
    r.data_inicio_servico,
    r.data_fim_servico,
    c.nome_fantasia as cliente,
    c.cnpj as cliente_cnpj,
    COALESCE(SUM(rp.valor_total), 0) as total_pecas,
    COALESCE(SUM(rs.valor_total), 0) as total_servicos,
    COALESCE(SUM(rp.valor_total), 0) + COALESCE(SUM(rs.valor_total), 0) as total_geral,
    r.criado_em,
    r.atualizado_em
FROM relatorios r
LEFT JOIN clientes c ON r.cliente_id = c.id AND c.deletado_em IS NULL
LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
WHERE r.deletado_em IS NULL
GROUP BY r.id, r.os_numero, r.numero_rte, r.titulo_relatorio, r.data_emissao,
         r.data_inicio_servico, r.data_fim_servico, c.nome_fantasia, c.cnpj, 
         r.criado_em, r.atualizado_em;

-- ============================================
-- FIM DAS MIGRATIONS
-- ============================================
