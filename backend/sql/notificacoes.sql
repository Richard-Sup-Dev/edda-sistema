-- Criação da tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL DEFAULT 'sistema',
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  link VARCHAR(500),
  dados JSONB,
  prioridade VARCHAR(20) DEFAULT 'normal',
  expira_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_tipo CHECK (tipo IN ('relatorio', 'cliente', 'pagamento', 'sistema', 'alerta', 'tarefa', 'mensagem')),
  CONSTRAINT chk_prioridade CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente'))
);

-- Índices para melhor performance
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(usuario_id, lida);
CREATE INDEX idx_notificacoes_created ON notificacoes(created_at);
CREATE INDEX idx_notificacoes_tipo ON notificacoes(tipo);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_notificacoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notificacoes_updated_at
  BEFORE UPDATE ON notificacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_notificacoes_updated_at();

-- Função para criar notificações automáticas
CREATE OR REPLACE FUNCTION criar_notificacao_automatica(
  p_usuario_id INTEGER,
  p_tipo VARCHAR,
  p_titulo VARCHAR,
  p_mensagem TEXT,
  p_link VARCHAR DEFAULT NULL,
  p_dados JSONB DEFAULT NULL,
  p_prioridade VARCHAR DEFAULT 'normal'
)
RETURNS INTEGER AS $$
DECLARE
  v_notificacao_id INTEGER;
BEGIN
  INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, link, dados, prioridade)
  VALUES (p_usuario_id, p_tipo, p_titulo, p_mensagem, p_link, p_dados, p_prioridade)
  RETURNING id INTO v_notificacao_id;
  
  RETURN v_notificacao_id;
END;
$$ LANGUAGE plpgsql;

-- Notificações de exemplo para teste
INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, prioridade, created_at) VALUES
(1, 'relatorio', 'Novo relatório criado', 'Relatório #1234 foi gerado com sucesso', 'normal', NOW() - INTERVAL '5 minutes'),
(1, 'cliente', 'Cliente adicionado', 'João Silva foi cadastrado no sistema', 'baixa', NOW() - INTERVAL '1 hour'),
(1, 'pagamento', 'Pagamento recebido', 'Pagamento de R$ 1.500,00 foi confirmado', 'alta', NOW() - INTERVAL '2 hours'),
(1, 'sistema', 'Sistema atualizado', 'Nova versão 2.0 disponível com melhorias de performance', 'normal', NOW() - INTERVAL '1 day');

COMMENT ON TABLE notificacoes IS 'Tabela de notificações do sistema para usuários';
COMMENT ON COLUMN notificacoes.tipo IS 'Tipo da notificação: relatorio, cliente, pagamento, sistema, alerta, tarefa, mensagem';
COMMENT ON COLUMN notificacoes.prioridade IS 'Prioridade da notificação: baixa, normal, alta, urgente';
COMMENT ON COLUMN notificacoes.link IS 'Link para a página relacionada à notificação';
COMMENT ON COLUMN notificacoes.dados IS 'Dados adicionais em formato JSON';
COMMENT ON COLUMN notificacoes.expira_em IS 'Data de expiração da notificação (NULL = nunca expira)';
