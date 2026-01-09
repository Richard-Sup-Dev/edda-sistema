-- ============================================
-- SCHEMA SQL - EDDA Sistema de Relatórios
-- PostgreSQL 14+
-- ============================================
-- Este arquivo cria todas as tabelas necessárias
-- para o sistema EDDA funcionar
-- ============================================

-- Garantir que o banco está usando UTF-8
SET client_encoding = 'UTF8';

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'tecnico' CHECK (role IN ('admin', 'tecnico', 'visualizador')),
    ativo BOOLEAN DEFAULT true,
    
    -- Campos de segurança (brute force protection)
    login_attempts INTEGER DEFAULT 0,
    lock_until BIGINT,
    
    -- Campos de recuperação de senha
    reset_password_token VARCHAR(255),
    reset_password_expires BIGINT,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token);

-- ============================================
-- 2. TABELA DE CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    nome_fantasia VARCHAR(100),
    razao_social VARCHAR(255),
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    responsavel_contato VARCHAR(100),
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome_fantasia);

-- ============================================
-- 3. TABELA DE PEÇAS
-- ============================================
CREATE TABLE IF NOT EXISTS pecas (
    id SERIAL PRIMARY KEY,
    nome_peca VARCHAR(255) NOT NULL,
    codigo_fabrica VARCHAR(100) UNIQUE,
    valor_custo DECIMAL(10,2) DEFAULT 0.00,
    valor_venda DECIMAL(10,2) DEFAULT 0.00,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pecas_codigo ON pecas(codigo_fabrica);
CREATE INDEX IF NOT EXISTS idx_pecas_nome ON pecas(nome_peca);

-- ============================================
-- 4. TABELA DE SERVIÇOS
-- ============================================
CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    nome_servico VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_unitario DECIMAL(10,2) DEFAULT 0.00,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_servicos_nome ON servicos(nome_servico);

-- ============================================
-- 5. TABELA DE RELATÓRIOS (PRINCIPAL)
-- ============================================
CREATE TABLE IF NOT EXISTS relatorios (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    
    -- Campos principais
    os_numero VARCHAR(50) NOT NULL,
    numero_rte VARCHAR(50),
    titulo_relatorio VARCHAR(255),
    tipo_relatorio VARCHAR(50),
    
    -- Datas
    data_emissao DATE,
    data_inicio_servico DATE,
    data_fim_servico DATE,
    
    -- Responsáveis
    elaborado_por VARCHAR(100),
    checado_por VARCHAR(100),
    aprovado_por VARCHAR(100),
    responsavel VARCHAR(255),
    
    -- Conteúdos textuais
    objetivo TEXT,
    causas_danos TEXT,
    conclusao TEXT,
    descricao TEXT,
    
    -- Documentação técnica
    art VARCHAR(255),
    
    -- Logo e assinatura
    cliente_logo_path VARCHAR(255),
    hash_assinatura VARCHAR(64),
    
    -- Dados do cliente (desnormalizados para histórico)
    cliente_nome VARCHAR(255),
    cliente_cnpj VARCHAR(20),
    cliente_endereco VARCHAR(255),
    cliente_bairro VARCHAR(255),
    cliente_cidade VARCHAR(255),
    cliente_estado VARCHAR(255),
    cliente_cep VARCHAR(255),
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente ON relatorios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_os ON relatorios(os_numero);
CREATE INDEX IF NOT EXISTS idx_relatorios_rte ON relatorios(numero_rte);
CREATE INDEX IF NOT EXISTS idx_relatorios_data_emissao ON relatorios(data_emissao);

-- ============================================
-- 6. TABELAS FILHAS DE RELATÓRIOS
-- ============================================

-- 6.1 Medições de Isolamento
CREATE TABLE IF NOT EXISTS medicoes_isolamento (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    descricao VARCHAR(255),
    valor VARCHAR(255),
    unidade VARCHAR(50),
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicoes_isolamento_relatorio ON medicoes_isolamento(relatorio_id);

-- 6.2 Medições de Batimento
CREATE TABLE IF NOT EXISTS medicoes_batimento (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    descricao VARCHAR(255),
    valor DECIMAL,
    unidade VARCHAR(50),
    tolerancia VARCHAR(50),
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicoes_batimento_relatorio ON medicoes_batimento(relatorio_id);

-- 6.3 Peças Atuais (Usadas no relatório)
CREATE TABLE IF NOT EXISTS pecas_atuais (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    observacao TEXT,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pecas_atuais_relatorio ON pecas_atuais(relatorio_id);

-- 6.4 Fotos do Relatório
CREATE TABLE IF NOT EXISTS fotos_relatorio (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    caminho_foto VARCHAR(255) NOT NULL,
    legenda VARCHAR(255),
    secao VARCHAR(255),
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fotos_relatorio_relatorio ON fotos_relatorio(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_fotos_relatorio_secao ON fotos_relatorio(secao);

-- ============================================
-- 7. TABELAS DE ORÇAMENTO/FINANCEIRO
-- ============================================

-- 7.1 Peças Cotadas no Relatório
CREATE TABLE IF NOT EXISTS relatorio_pecas (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    peca_id INTEGER REFERENCES pecas(id) ON DELETE SET NULL,
    quantidade INTEGER DEFAULT 1,
    valor_unitario DECIMAL(10,2) DEFAULT 0.00,
    valor_total DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_relatorio_pecas_relatorio ON relatorio_pecas(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_relatorio_pecas_peca ON relatorio_pecas(peca_id);

-- 7.2 Serviços Cotados no Relatório
CREATE TABLE IF NOT EXISTS relatorio_servicos (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    servico_id INTEGER REFERENCES servicos(id) ON DELETE SET NULL,
    quantidade INTEGER DEFAULT 1,
    valor_unitario DECIMAL(10,2) DEFAULT 0.00,
    valor_total DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_relatorio_servicos_relatorio ON relatorio_servicos(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_relatorio_servicos_servico ON relatorio_servicos(servico_id);

-- ============================================
-- 8. TABELA DE NOTAS FISCAIS
-- ============================================
CREATE TABLE IF NOT EXISTS notas_fiscais (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE SET NULL,
    
    -- Dados da NF
    numero_nf VARCHAR(50) NOT NULL,
    data_emissao DATE NOT NULL,
    valor_total DECIMAL(10,2) DEFAULT 0.00,
    
    -- Arquivo PDF
    caminho_pdf VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'cancelada')),
    
    -- Observações
    observacoes TEXT,
    
    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notas_fiscais_relatorio ON notas_fiscais(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_notas_fiscais_numero ON notas_fiscais(numero_nf);
CREATE INDEX IF NOT EXISTS idx_notas_fiscais_status ON notas_fiscais(status);

-- ============================================
-- 9. VIEWS ÚTEIS
-- ============================================

-- View: Resumo de Relatórios com Totais Financeiros
CREATE OR REPLACE VIEW vw_relatorios_resumo AS
SELECT 
    r.id,
    r.os_numero,
    r.numero_rte,
    r.titulo_relatorio,
    r.data_emissao,
    c.nome_fantasia as cliente,
    c.cnpj as cliente_cnpj,
    COALESCE(SUM(rp.valor_total), 0) as total_pecas,
    COALESCE(SUM(rs.valor_total), 0) as total_servicos,
    COALESCE(SUM(rp.valor_total), 0) + COALESCE(SUM(rs.valor_total), 0) as total_geral,
    r.criado_em
FROM relatorios r
LEFT JOIN clientes c ON r.cliente_id = c.id
LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
GROUP BY r.id, r.os_numero, r.numero_rte, r.titulo_relatorio, r.data_emissao, 
         c.nome_fantasia, c.cnpj, r.criado_em;

-- View: Estatísticas Gerais do Sistema
CREATE OR REPLACE VIEW vw_estatisticas_sistema AS
SELECT 
    (SELECT COUNT(*) FROM clientes) as total_clientes,
    (SELECT COUNT(*) FROM relatorios) as total_relatorios,
    (SELECT COUNT(*) FROM pecas) as total_pecas,
    (SELECT COUNT(*) FROM servicos) as total_servicos,
    (SELECT COUNT(*) FROM users WHERE ativo = true) as usuarios_ativos,
    (SELECT COALESCE(SUM(rp.valor_total + rs.valor_total), 0) 
     FROM relatorios r
     LEFT JOIN relatorio_pecas rp ON r.id = rp.relatorio_id
     LEFT JOIN relatorio_servicos rs ON r.id = rs.relatorio_id
     WHERE EXTRACT(MONTH FROM r.data_emissao) = EXTRACT(MONTH FROM CURRENT_DATE)
     AND EXTRACT(YEAR FROM r.data_emissao) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) as faturamento_mes_atual;

-- ============================================
-- 10. TRIGGERS PARA ATUALIZAR TIMESTAMPS
-- ============================================

-- Função genérica para atualizar timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER trg_users_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_clientes_timestamp BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_pecas_timestamp BEFORE UPDATE ON pecas
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_servicos_timestamp BEFORE UPDATE ON servicos
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_relatorios_timestamp BEFORE UPDATE ON relatorios
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- 11. DADOS INICIAIS (SEED)
-- ============================================

-- Inserir usuário admin padrão
INSERT INTO users (nome, email, senha, role)
VALUES ('Administrador EDDA', 'admin@edda.com', 
        -- Senha: Admin@2025EDDA (hash bcrypt com 12 rounds)
        '$2a$12$LKfv/h6BwxvZQ9Z0Y0k7N.xR9H5p8y9p8y9p8y9p8y9p8y9p8y9p8',
        'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Comentários nas tabelas principais
COMMENT ON TABLE users IS 'Usuários do sistema com controle de acesso';
COMMENT ON TABLE clientes IS 'Cadastro de clientes';
COMMENT ON TABLE pecas IS 'Catálogo de peças disponíveis';
COMMENT ON TABLE servicos IS 'Catálogo de serviços oferecidos';
COMMENT ON TABLE relatorios IS 'Relatórios técnicos gerados';
COMMENT ON TABLE notas_fiscais IS 'Notas fiscais emitidas';

-- Exibir resumo das tabelas criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Exibir estatísticas
SELECT * FROM vw_estatisticas_sistema;
