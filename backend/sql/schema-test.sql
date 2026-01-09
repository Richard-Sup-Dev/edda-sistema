-- ============================================
-- SCHEMA SQL COMPLETO PARA TESTES - EDDA Sistema
-- PostgreSQL 14+ (Neon DB)
-- ============================================
-- Este arquivo cria todas as tabelas para testes
-- ============================================

-- Garantir UTF-8
SET client_encoding = 'UTF8';

-- Limpar tabelas existentes (em ordem de dependências)
DROP TABLE IF EXISTS logs_sistema CASCADE;
DROP TABLE IF EXISTS relatorio_servicos CASCADE;
DROP TABLE IF EXISTS relatorio_pecas CASCADE;
DROP TABLE IF EXISTS fotos_relatorio CASCADE;
DROP TABLE IF EXISTS pecas_atuais CASCADE;
DROP TABLE IF EXISTS medicoes_batimento CASCADE;
DROP TABLE IF EXISTS medicoes_isolamento CASCADE;
DROP TABLE IF EXISTS notas_fiscais CASCADE;
DROP TABLE IF EXISTS relatorios CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS servicos CASCADE;
DROP TABLE IF EXISTS pecas CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS nf_emitente CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- #################################################
-- 1. TABELA DE USUÁRIOS (para autenticação)
-- #################################################
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'tecnico' CHECK (role IN ('admin', 'tecnico', 'visualizador')),
    ativo BOOLEAN DEFAULT true,
    login_attempts INTEGER DEFAULT 0,
    lock_until BIGINT,
    reset_password_token VARCHAR(255),
    reset_password_expires BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 2. TABELA DE CLIENTES
-- #################################################
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    cpf VARCHAR(14) UNIQUE,
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf VARCHAR(2),
    cep VARCHAR(10),
    inscricao_estadual VARCHAR(50),
    os_numero VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 3. TABELAS DE PRODUTOS E SERVIÇOS
-- #################################################
CREATE TABLE pecas (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor_peca DECIMAL(10, 2) NOT NULL,
    codigo_peca VARCHAR(50) UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor_servico DECIMAL(10, 2) NOT NULL,
    codigo_servico VARCHAR(50) UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 4. TABELA DE USUÁRIOS (para sistema de relatórios)
-- #################################################
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) DEFAULT 'membro' NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    pode_emitir_nf BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 5. TABELA DE RELATÓRIOS
-- #################################################
CREATE TABLE relatorios (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE RESTRICT,
    usuario_elaborador_id INTEGER REFERENCES usuarios(id) ON DELETE RESTRICT,
    os_numero VARCHAR(50) NOT NULL,
    numero_rte VARCHAR(50) UNIQUE,
    titulo_relatorio VARCHAR(255),
    data_emissao DATE,
    data_inicio_servico DATE,
    data_fim_servico DATE,
    elaborado_por VARCHAR(100),
    checado_por VARCHAR(100),
    aprovado_por VARCHAR(100),
    objetivo TEXT,
    causas_danos TEXT,
    conclusao TEXT,
    responsavel VARCHAR(255),
    tipo_relatorio VARCHAR(50),
    art VARCHAR(255),
    descricao TEXT,
    cliente_logo_path VARCHAR(255),
    hash_assinatura VARCHAR(64),
    status VARCHAR(20) DEFAULT 'aberto',
    nf_emitida BOOLEAN DEFAULT FALSE,
    -- Campos denormalizados
    cliente_nome VARCHAR(255),
    cliente_cnpj VARCHAR(18),
    cliente_endereco VARCHAR(255),
    cliente_bairro VARCHAR(100),
    cliente_cidade VARCHAR(100),
    cliente_estado VARCHAR(2),
    cliente_cep VARCHAR(10),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 6. TABELA DE NOTAS FISCAIS
-- #################################################
CREATE TABLE notas_fiscais (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE SET NULL, 
    usuario_emissor_id INTEGER REFERENCES usuarios(id) ON DELETE RESTRICT,
    numero_nf INTEGER NOT NULL UNIQUE, 
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE RESTRICT,
    cliente_nome VARCHAR(255) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_iss DECIMAL(10, 2),
    aliquota DECIMAL(5, 2),
    caminho_pdf VARCHAR(255) NOT NULL,
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 7. TABELAS DE MEDIÇÕES E ITENS
-- #################################################
CREATE TABLE medicoes_isolamento (
    id SERIAL PRIMARY KEY,
    relatorio_id INT REFERENCES relatorios(id) ON DELETE CASCADE,
    descricao VARCHAR(255),
    valor VARCHAR(255),
    unidade VARCHAR(50)
);

CREATE TABLE medicoes_batimento (
    id SERIAL PRIMARY KEY,
    relatorio_id INT REFERENCES relatorios(id) ON DELETE CASCADE,
    descricao VARCHAR(255),
    valor DECIMAL,
    unidade VARCHAR(50),
    tolerancia VARCHAR(50)
);

CREATE TABLE pecas_atuais (
    id SERIAL PRIMARY KEY,
    relatorio_id INT REFERENCES relatorios(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    observacao TEXT
);

CREATE TABLE fotos_relatorio (
    id SERIAL PRIMARY KEY,
    relatorio_id INT REFERENCES relatorios(id) ON DELETE CASCADE,
    caminho_foto VARCHAR(255) NOT NULL,
    legenda VARCHAR(255),
    secao VARCHAR(255)
);

CREATE TABLE relatorio_pecas (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    peca_id INTEGER REFERENCES pecas(id) ON DELETE RESTRICT,
    quantidade DECIMAL(10, 2) NOT NULL DEFAULT 1.0,
    valor_cobrado DECIMAL(10, 2) NOT NULL
);

CREATE TABLE relatorio_servicos (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id) ON DELETE CASCADE,
    servico_id INTEGER REFERENCES servicos(id) ON DELETE RESTRICT,
    quantidade DECIMAL(10, 2) NOT NULL DEFAULT 1.0,
    valor_cobrado DECIMAL(10, 2) NOT NULL
);

-- #################################################
-- 8. TABELAS DE INFRAESTRUTURA
-- #################################################
CREATE TABLE nf_emitente (
    id SERIAL PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    uf VARCHAR(2),
    cep VARCHAR(10),
    logo_path VARCHAR(255)
);

CREATE TABLE logs_sistema (
    id BIGSERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(100) NOT NULL,
    entidade_id INTEGER,
    entidade_tipo VARCHAR(50),
    detalhes TEXT,
    ip_origem VARCHAR(50),
    "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- #################################################
-- 9. ÍNDICES PARA PERFORMANCE
-- #################################################

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Clientes
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);

-- Peças e Serviços
CREATE INDEX IF NOT EXISTS idx_pecas_codigo ON pecas(codigo_peca);
CREATE INDEX IF NOT EXISTS idx_servicos_codigo ON servicos(codigo_servico);

-- Relatórios
CREATE INDEX IF NOT EXISTS idx_relatorios_cliente_id ON relatorios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_os_numero ON relatorios(os_numero);
CREATE INDEX IF NOT EXISTS idx_relatorios_data_emissao ON relatorios(data_emissao);
CREATE INDEX IF NOT EXISTS idx_relatorios_status ON relatorios(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_relatorios_numero_rte ON relatorios(numero_rte);

-- Notas Fiscais
CREATE UNIQUE INDEX IF NOT EXISTS idx_notas_fiscais_numero_nf ON notas_fiscais(numero_nf);
CREATE INDEX IF NOT EXISTS idx_notas_fiscais_cliente_id ON notas_fiscais(cliente_id);
CREATE INDEX IF NOT EXISTS idx_notas_fiscais_emissor_id ON notas_fiscais(usuario_emissor_id);

-- Usuários
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Logs
CREATE INDEX IF NOT EXISTS idx_logs_sistema_usuario_id ON logs_sistema(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs_sistema("timestamp");

-- Relacionamentos
CREATE INDEX IF NOT EXISTS idx_fotos_relatorio_id ON fotos_relatorio(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_relatorio_pecas_relatorio_id ON relatorio_pecas(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_relatorio_servicos_relatorio_id ON relatorio_servicos(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_medicoes_isolamento_relatorio_id ON medicoes_isolamento(relatorio_id);
CREATE INDEX IF NOT EXISTS idx_medicoes_batimento_relatorio_id ON medicoes_batimento(relatorio_id);

-- #################################################
-- 10. DADOS INICIAIS PARA TESTES
-- #################################################

-- Usuário admin de teste
INSERT INTO users (nome, email, senha, role, ativo) 
VALUES 
    ('Admin Teste', 'admin@test.com', '$2b$10$YourHashedPasswordHere', 'admin', true),
    ('Tecnico Teste', 'tecnico@test.com', '$2b$10$YourHashedPasswordHere', 'tecnico', true)
ON CONFLICT (email) DO NOTHING;

-- Cliente de teste
INSERT INTO clientes (nome_fantasia, cnpj, cidade, uf)
VALUES 
    ('Cliente Teste LTDA', '12.345.678/0001-90', 'São Paulo', 'SP'),
    ('Empresa Exemplo ME', '98.765.432/0001-10', 'Rio de Janeiro', 'RJ')
ON CONFLICT (cnpj) DO NOTHING;

-- Peças de teste
INSERT INTO pecas (descricao, valor_peca, codigo_peca)
VALUES
    ('Parafuso M10', 5.50, 'PAR-001'),
    ('Rolamento SKF 6205', 45.00, 'ROL-001'),
    ('Correia A-53', 89.90, 'COR-001')
ON CONFLICT (codigo_peca) DO NOTHING;

-- Serviços de teste
INSERT INTO servicos (descricao, valor_servico, codigo_servico)
VALUES
    ('Manutenção Preventiva', 350.00, 'SRV-001'),
    ('Troca de Rolamentos', 250.00, 'SRV-002'),
    ('Alinhamento de Eixo', 180.00, 'SRV-003')
ON CONFLICT (codigo_servico) DO NOTHING;

-- Usuário do sistema de relatórios
INSERT INTO usuarios (nome, email, senha_hash, perfil, pode_emitir_nf)
VALUES
    ('João Silva', 'joao@test.com', '$2b$10$YourHashedPasswordHere', 'admin', true),
    ('Maria Santos', 'maria@test.com', '$2b$10$YourHashedPasswordHere', 'membro', false)
ON CONFLICT (email) DO NOTHING;

-- Emitente de NF
INSERT INTO nf_emitente (razao_social, cnpj, cidade, uf)
VALUES ('EDDA Engenharia LTDA', '11.222.333/0001-44', 'São Paulo', 'SP')
ON CONFLICT (cnpj) DO NOTHING;

-- #################################################
-- FIM DO SCHEMA
-- #################################################
