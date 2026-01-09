// src/models/index.js
import sequelize from '../config/database.js';
import User from './User.js';
import { INTEGER, STRING, DECIMAL, TEXT, DATEONLY } from 'sequelize';

const Cliente = sequelize.define('Cliente', {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  cnpj: { type: STRING(18), unique: true, allowNull: false },
  nome_fantasia: { type: STRING(100) },
  razao_social: { type: STRING(255) },
  endereco: STRING(255),
  bairro: STRING(100),
  cidade: STRING(100),
  estado: STRING(2),
  cep: STRING(10),
  responsavel_contato: STRING(100)
}, { tableName: 'clientes' });

const Peca = sequelize.define('Peca', {
  nome_peca: { type: STRING(255), allowNull: false },
  codigo_fabrica: { type: STRING(100), unique: true },
  valor_custo: { type: DECIMAL(10,2), defaultValue: 0 },
  valor_venda: { type: DECIMAL(10,2), defaultValue: 0 }
}, { tableName: 'pecas' });

const Servico = sequelize.define('Servico', {
  nome_servico: { type: STRING(255), allowNull: false },
  descricao: TEXT,
  valor_unitario: { type: DECIMAL(10,2), defaultValue: 0 }
}, { tableName: 'servicos' });

const Relatorio = sequelize.define('Relatorio', {
  os_numero: { type: STRING(50), allowNull: false },
  numero_rte: STRING(50),
  titulo_relatorio: STRING(255),
  data_emissao: DATEONLY,
  data_inicio_servico: DATEONLY,
  data_fim_servico: DATEONLY,
  elaborado_por: STRING(100),
  checado_por: STRING(100),
  aprovado_por: STRING(100),
  objetivo: TEXT,
  causas_danos: TEXT,
  conclusao: TEXT,
  responsavel: STRING(255),
  tipo_relatorio: STRING(50),
  art: STRING(255),
  descricao: TEXT,
  cliente_logo_path: STRING(255),
  hash_assinatura: STRING(64),
  // campos antigos mantidos
  cliente_nome: STRING(255),
  cliente_cnpj: STRING(20),
  cliente_endereco: STRING(255),
  cliente_bairro: STRING(255),
  cliente_cidade: STRING(255),
  cliente_estado: STRING(255),
  cliente_cep: STRING(255)
}, { tableName: 'relatorios' });

// Tabelas de relacionamento muitos-para-muitos
const RelatorioPeca = sequelize.define('RelatorioPeca', {
  quantidade: { type: INTEGER, defaultValue: 1 },
  valor_unitario: DECIMAL(10, 2),
  desconto: { type: DECIMAL(5, 2), defaultValue: 0 }
}, { tableName: 'relatorio_pecas' });

const RelatorioServico = sequelize.define('RelatorioServico', {
  quantidade: { type: INTEGER, defaultValue: 1 },
  valor_unitario: DECIMAL(10, 2),
  desconto: { type: DECIMAL(5, 2), defaultValue: 0 }
}, { tableName: 'relatorio_servicos' });

// Tabelas filhas (um-para-muitos)
const MedicaoIsolamento = sequelize.define('MedicaoIsolamento', {
  descricao: STRING(255),
  valor: STRING(255),
  unidade: STRING(50)
}, { tableName: 'medicoes_isolamento' });

const MedicaoBatimento = sequelize.define('MedicaoBatimento', {
  descricao: STRING(255),
  valor: DECIMAL,
  unidade: STRING(50),
  tolerancia: STRING(50)
}, { tableName: 'medicoes_batimento' });

const PecaAtual = sequelize.define('PecaAtual', {
  descricao: { type: STRING(255), allowNull: false },
  observacao: TEXT
}, { tableName: 'pecas_atuais' });

const FotoRelatorio = sequelize.define('FotoRelatorio', {
  caminho_foto: { type: STRING(255), allowNull: false },
  legenda: STRING(255),
  secao: STRING(255)
}, { tableName: 'fotos_relatorio' });

// Relacionamentos
Cliente.hasMany(Relatorio, { foreignKey: 'cliente_id' });
Relatorio.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Relatorio.belongsToMany(Peca, {
  through: RelatorioPeca,
  foreignKey: 'relatorio_id',
  as: 'pecas_cotadas'
});
Peca.belongsToMany(Relatorio, {
  through: RelatorioPeca,
  foreignKey: 'peca_id'
});

// Relacionamentos Relatorio ↔ Serviços (muitos-para-muitos)
Relatorio.belongsToMany(Servico, {
  through: RelatorioServico,
  foreignKey: 'relatorio_id',
  as: 'servicos_cotados'
});
Servico.belongsToMany(Relatorio, {
  through: RelatorioServico,
  foreignKey: 'servico_id'
});

// Associações filhas (um-para-muitos) com CASCADE
Relatorio.hasMany(MedicaoIsolamento, { foreignKey: 'relatorio_id', onDelete: 'CASCADE' });
MedicaoIsolamento.belongsTo(Relatorio, { foreignKey: 'relatorio_id' });

Relatorio.hasMany(MedicaoBatimento, { foreignKey: 'relatorio_id', onDelete: 'CASCADE' });
MedicaoBatimento.belongsTo(Relatorio, { foreignKey: 'relatorio_id' });

Relatorio.hasMany(PecaAtual, { foreignKey: 'relatorio_id', onDelete: 'CASCADE' });
PecaAtual.belongsTo(Relatorio, { foreignKey: 'relatorio_id' });

Relatorio.hasMany(FotoRelatorio, { foreignKey: 'relatorio_id', onDelete: 'CASCADE' });
FotoRelatorio.belongsTo(Relatorio, { foreignKey: 'relatorio_id' });

// Exporta tudo
export default {
  sequelize,
  User,
  Cliente,
  Peca,
  Servico,
  Relatorio,
  RelatorioPeca,
  RelatorioServico,
  MedicaoIsolamento,
  MedicaoBatimento,
  PecaAtual,
  FotoRelatorio
};
