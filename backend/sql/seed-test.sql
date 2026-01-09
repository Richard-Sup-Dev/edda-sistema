-- =====================================================
-- DADOS DE TESTE - Sistema de Relatórios
-- =====================================================

-- Limpar dados existentes
TRUNCATE TABLE logs_sistema CASCADE;
TRUNCATE TABLE nf_emitente CASCADE;
TRUNCATE TABLE relatorio_servicos CASCADE;
TRUNCATE TABLE relatorio_pecas CASCADE;
TRUNCATE TABLE fotos_relatorio CASCADE;
TRUNCATE TABLE pecas_atuais CASCADE;
TRUNCATE TABLE medicoes_batimento CASCADE;
TRUNCATE TABLE medicoes_isolamento CASCADE;
TRUNCATE TABLE notas_fiscais CASCADE;
TRUNCATE TABLE relatorios CASCADE;
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
TRUNCATE TABLE servicos RESTART IDENTITY CASCADE;
TRUNCATE TABLE pecas RESTART IDENTITY CASCADE;
TRUNCATE TABLE clientes RESTART IDENTITY CASCADE;

-- #################################################
-- 1. USUÁRIOS DE TESTE
-- Senha para todos: "senha123" (bcrypt hash)
-- #################################################

INSERT INTO usuarios (nome, email, senha_hash, perfil, status, pode_emitir_nf) VALUES
('Admin Sistema', 'admin@test.com', '$2b$10$rZ8qNqZ5fzN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqO', 'admin', 'ativo', true),
('João Silva', 'joao@test.com', '$2b$10$rZ8qNqZ5fzN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqO', 'membro', 'ativo', false),
('Maria Santos', 'maria@test.com', '$2b$10$rZ8qNqZ5fzN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqO', 'gerente', 'ativo', true),
('Pedro Oliveira', 'pedro@test.com', '$2b$10$rZ8qNqZ5fzN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqOqYqOuN5K8YqO', 'membro', 'inativo', false);

-- #################################################
-- 2. CLIENTES DE TESTE
-- #################################################

INSERT INTO clientes (nome_fantasia, cnpj, endereco, bairro, cidade, uf, cep, inscricao_estadual) VALUES
('Empresa Alfa Ltda', '11.222.333/0001-81', 'Rua das Flores, 123', 'Centro', 'São Paulo', 'SP', '01310-100', '123456789'),
('Indústria Beta S/A', '22.333.444/0001-92', 'Av. Industrial, 456', 'Distrito Industrial', 'Campinas', 'SP', '13050-000', '987654321'),
('Comércio Gama ME', '33.444.555/0001-03', 'Rua do Comércio, 789', 'Centro', 'Santos', 'SP', '11013-001', '456789123');

INSERT INTO clientes (nome_fantasia, cpf, endereco, bairro, cidade, uf, cep) VALUES
('João Pessoa Física', '123.456.789-00', 'Rua Residencial, 100', 'Jardim', 'São Paulo', 'SP', '04567-000');

-- #################################################
-- 3. PEÇAS DE TESTE
-- #################################################

INSERT INTO pecas (descricao, valor_peca, codigo_peca) VALUES
('Parafuso M10', 2.50, 'PAR-M10'),
('Rolamento 6205', 35.00, 'ROL-6205'),
('Correia Dentada', 120.00, 'COR-DEN-01'),
('Óleo Lubrificante 1L', 45.00, 'OLE-LUB-1L'),
('Kit de Vedação', 89.90, 'VED-KIT-01'),
('Motor Elétrico 5HP', 1250.00, 'MOT-5HP'),
('Sensor de Temperatura', 180.00, 'SEN-TEMP-01'),
('Válvula Esfera 1/2"', 55.00, 'VAL-ESF-12');

-- #################################################
-- 4. SERVIÇOS DE TESTE
-- #################################################

INSERT INTO servicos (descricao, valor_servico, codigo_servico) VALUES
('Manutenção Preventiva', 350.00, 'MAN-PREV'),
('Manutenção Corretiva', 500.00, 'MAN-CORR'),
('Instalação Elétrica', 450.00, 'INS-ELET'),
('Análise Térmica', 280.00, 'ANA-TERM'),
('Balanceamento Dinâmico', 320.00, 'BAL-DIN'),
('Teste de Isolamento', 150.00, 'TES-ISO'),
('Laudo Técnico', 800.00, 'LAU-TEC'),
('Consultoria Técnica (hora)', 200.00, 'CON-TEC-H');

-- #################################################
-- 5. RELATÓRIOS DE TESTE
-- #################################################

INSERT INTO relatorios (
    cliente_id, usuario_elaborador_id, os_numero, numero_rte, 
    titulo_relatorio, data_emissao, data_inicio_servico, data_fim_servico,
    elaborado_por, checado_por, aprovado_por,
    objetivo, causas_danos, conclusao,
    tipo_relatorio, status, nf_emitida,
    cliente_nome, cliente_cnpj, cliente_cidade, cliente_estado
) VALUES
(
    1, 1, 'OS-2026-001', 'RTE-2026-001',
    'Manutenção Preventiva - Motor Principal',
    '2026-01-05', '2026-01-03', '2026-01-05',
    'João Silva', 'Maria Santos', 'Admin Sistema',
    'Realizar manutenção preventiva conforme cronograma',
    'Desgaste natural por tempo de uso',
    'Manutenção realizada com sucesso. Equipamento em condições normais de operação.',
    'Preventiva', 'aberto', false,
    'Empresa Alfa Ltda', '11.222.333/0001-81', 'São Paulo', 'SP'
),
(
    2, 2, 'OS-2026-002', 'RTE-2026-002',
    'Análise de Falha - Sistema Hidráulico',
    '2026-01-08', '2026-01-06', '2026-01-08',
    'Maria Santos', 'Admin Sistema', 'Admin Sistema',
    'Identificar causa da falha no sistema hidráulico',
    'Vazamento em válvula principal devido à vedação comprometida',
    'Substituição de componentes realizada. Sistema testado e aprovado.',
    'Corretiva', 'fechado', true,
    'Indústria Beta S/A', '22.333.444/0001-92', 'Campinas', 'SP'
),
(
    3, 1, 'OS-2026-003', 'RTE-2026-003',
    'Instalação de Novo Equipamento',
    '2026-01-09', '2026-01-07', '2026-01-09',
    'Pedro Oliveira', 'João Silva', NULL,
    'Instalar e configurar novo equipamento',
    NULL,
    'Instalação em andamento',
    'Instalação', 'em_andamento', false,
    'Comércio Gama ME', '33.444.555/0001-03', 'Santos', 'SP'
);

-- #################################################
-- 6. ITENS DOS RELATÓRIOS
-- #################################################

-- Peças do Relatório 1
INSERT INTO relatorio_pecas (relatorio_id, peca_id, quantidade, valor_cobrado) VALUES
(1, 1, 10.0, 2.50),
(1, 2, 2.0, 35.00),
(1, 4, 1.0, 45.00);

-- Serviços do Relatório 1
INSERT INTO relatorio_servicos (relatorio_id, servico_id, quantidade, valor_cobrado) VALUES
(1, 1, 1.0, 350.00),
(1, 6, 1.0, 150.00);

-- Peças do Relatório 2
INSERT INTO relatorio_pecas (relatorio_id, peca_id, quantidade, valor_cobrado) VALUES
(2, 5, 2.0, 89.90),
(2, 8, 1.0, 55.00);

-- Serviços do Relatório 2
INSERT INTO relatorio_servicos (relatorio_id, servico_id, quantidade, valor_cobrado) VALUES
(2, 2, 1.0, 500.00),
(2, 7, 1.0, 800.00);

-- Medições do Relatório 1
INSERT INTO medicoes_isolamento (relatorio_id, descricao, valor, unidade) VALUES
(1, 'Enrolamento Fase R', '1500', 'MΩ'),
(1, 'Enrolamento Fase S', '1480', 'MΩ'),
(1, 'Enrolamento Fase T', '1520', 'MΩ');

INSERT INTO medicoes_batimento (relatorio_id, descricao, valor, unidade, tolerancia) VALUES
(1, 'Eixo Principal', 0.05, 'mm', '±0.10mm'),
(1, 'Acoplamento', 0.03, 'mm', '±0.10mm');

-- #################################################
-- 7. NOTA FISCAL DE TESTE
-- #################################################

INSERT INTO notas_fiscais (
    relatorio_id, usuario_emissor_id, numero_nf,
    cliente_id, cliente_nome, valor_total, valor_iss, aliquota,
    caminho_pdf
) VALUES
(
    2, 3, 1001,
    2, 'Indústria Beta S/A', 1534.80, 76.74, 5.00,
    '/nfs/2026/nf-1001.pdf'
);

-- #################################################
-- 8. EMITENTE DE NF
-- #################################################

INSERT INTO nf_emitente (razao_social, cnpj, endereco, cidade, uf, cep) VALUES
(
    'Sistema de Relatórios Ltda',
    '99.888.777/0001-66',
    'Av. Tecnologia, 1000',
    'São Paulo',
    'SP',
    '01234-000'
);

-- #################################################
-- 9. LOGS DE SISTEMA
-- #################################################

INSERT INTO logs_sistema (usuario_id, acao, entidade_id, entidade_tipo, detalhes, ip_origem) VALUES
(1, 'LOGIN', 1, 'usuario', 'Login realizado com sucesso', '192.168.1.100'),
(1, 'CRIAR_RELATORIO', 1, 'relatorio', 'Relatório RTE-2026-001 criado', '192.168.1.100'),
(2, 'LOGIN', 2, 'usuario', 'Login realizado com sucesso', '192.168.1.101'),
(3, 'EMITIR_NF', 1001, 'nota_fiscal', 'NF 1001 emitida para cliente 2', '192.168.1.102');
