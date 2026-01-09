-- Criação da tabela de atividades/auditoria
CREATE TABLE IF NOT EXISTS atividades (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL,
  acao VARCHAR(255) NOT NULL,
  entidade VARCHAR(100),
  entidade_id INTEGER,
  descricao TEXT,
  dados_antigos JSONB,
  dados_novos JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_tipo CHECK (tipo IN ('create', 'update', 'delete', 'login', 'logout', 'view', 'export', 'print'))
);

-- Índices para melhor performance
CREATE INDEX idx_atividades_usuario ON atividades(usuario_id, created_at);
CREATE INDEX idx_atividades_tipo ON atividades(tipo);
CREATE INDEX idx_atividades_entidade ON atividades(entidade, entidade_id);
CREATE INDEX idx_atividades_created ON atividades(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_atividades_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_atividades_updated_at
  BEFORE UPDATE ON atividades
  FOR EACH ROW
  EXECUTE FUNCTION update_atividades_updated_at();

-- Função para registrar atividade
CREATE OR REPLACE FUNCTION registrar_atividade(
  p_usuario_id INTEGER,
  p_tipo VARCHAR,
  p_acao VARCHAR,
  p_entidade VARCHAR DEFAULT NULL,
  p_entidade_id INTEGER DEFAULT NULL,
  p_descricao TEXT DEFAULT NULL,
  p_dados_antigos JSONB DEFAULT NULL,
  p_dados_novos JSONB DEFAULT NULL,
  p_ip VARCHAR DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_atividade_id INTEGER;
BEGIN
  INSERT INTO atividades (
    usuario_id, tipo, acao, entidade, entidade_id, 
    descricao, dados_antigos, dados_novos, ip, user_agent
  )
  VALUES (
    p_usuario_id, p_tipo, p_acao, p_entidade, p_entidade_id,
    p_descricao, p_dados_antigos, p_dados_novos, p_ip, p_user_agent
  )
  RETURNING id INTO v_atividade_id;
  
  RETURN v_atividade_id;
END;
$$ LANGUAGE plpgsql;

-- Atividades de exemplo para teste
INSERT INTO atividades (usuario_id, tipo, acao, entidade, entidade_id, descricao, created_at) VALUES
(1, 'create', 'criou relatório', 'relatorio', 1234, 'Relatório técnico #1234 criado', NOW() - INTERVAL '2 minutes'),
(1, 'update', 'atualizou cliente', 'cliente', 45, 'Cliente Empresa XYZ atualizado', NOW() - INTERVAL '15 minutes'),
(1, 'delete', 'removeu peça', 'peca', 89, 'Peça Motor ABC removida do estoque', NOW() - INTERVAL '1 hour'),
(1, 'create', 'adicionou serviço', 'servico', 12, 'Serviço de Manutenção adicionado', NOW() - INTERVAL '2 hours'),
(1, 'export', 'exportou relatório', 'relatorio', 1230, 'Relatório exportado em PDF', NOW() - INTERVAL '3 hours'),
(1, 'login', 'fez login', NULL, NULL, 'Login realizado com sucesso', NOW() - INTERVAL '4 hours');

COMMENT ON TABLE atividades IS 'Registro de todas as atividades/auditoria do sistema';
COMMENT ON COLUMN atividades.tipo IS 'Tipo de ação: create, update, delete, login, logout, view, export, print';
COMMENT ON COLUMN atividades.entidade IS 'Tipo de entidade afetada (cliente, relatório, peça, etc)';
COMMENT ON COLUMN atividades.entidade_id IS 'ID da entidade afetada';
COMMENT ON COLUMN atividades.dados_antigos IS 'Estado anterior da entidade (para updates/deletes)';
COMMENT ON COLUMN atividades.dados_novos IS 'Novo estado da entidade (para creates/updates)';
