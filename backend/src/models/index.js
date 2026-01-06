// src/models/index.js
import sequelize from '../config/database.js';
import User from './User.js';
import { INTEGER, STRING, DECIMAL, TEXT, DATEONLY } from 'sequelize';

// === CARREGA TODOS OS MODELS QUE VOCÊ MANDOU ===
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
  data_inicio_servico: DATEONLY, // CORRIGIDO
  data_fim_servico: DATEONLY, // CORRIGIDO
  elaborado_por: STRING(100), // CORRIGIDO
  checado_por: STRING(100), // CORRIGIDO
  aprovado_por: STRING(100), // CORRIGIDO
  objetivo: TEXT, // CORRIGIDO
  causas_danos: TEXT, // CORRIGIDO
  conclusao: TEXT, // CORRIGIDO
  responsavel: STRING(255), // CORRIGIDO
  tipo_relatorio: STRING(50), // CORRIGIDO
  art: STRING(255), // CORRIGIDO
  descricao: TEXT,
  cliente_logo_path: STRING(255), // CORRIGIDO
  hash_assinatura: STRING(64), // CORRIGIDO
  // campos antigos mantidos
  cliente_nome: STRING(255), // CORRIGIDO
  cliente_cnpj: STRING(20), // CORRIGIDO
  cliente_endereco: STRING(255), // CORRIGIDO
  cliente_bairro: STRING(255), // CORRIGIDO
  cliente_cidade: STRING(255), // CORRIGIDO
  cliente_estado: STRING(255), // CORRIGIDO
  cliente_cep: STRING(255) // CORRIGIDO
}, { tableName: 'relatorios' });

// Relacionamentos
Cliente.hasMany(Relatorio, { foreignKey: 'cliente_id' });
Relatorio.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Tabelas filhas
const MedicaoIsolamento = sequelize.define('MedicaoIsolamento', {
  descricao: STRING(255), // CORRIGIDO
  valor: STRING(255), // CORRIGIDO
  unidade: STRING(50) // CORRIGIDO
}, { tableName: 'medicoes_isolamento' });

const MedicaoBatimento = sequelize.define('MedicaoBatimento', {
  descricao: STRING(255), // CORRIGIDO
  valor: DECIMAL, // CORRIGIDO
  unidade: STRING(50), // CORRIGIDO
  tolerancia: STRING(50) // CORRIGIDO
}, { tableName: 'medicoes_batimento' });

const PecaAtual = sequelize.define('PecaAtual', {
  descricao: { type: STRING(255), allowNull: false },
  observacao: TEXT // CORRIGIDO
}, { tableName: 'pecas_atuais' });

const FotoRelatorio = sequelize.define('FotoRelatorio', {
  caminho_foto: { type: STRING(255), allowNull: false }, // CORRIGIDO
  legenda: STRING(255), // CORRIGIDO
  secao: STRING(255) // CORRIGIDO
}, { tableName: 'fotos_relatorio' });

// Associações filhas
Relatorio.hasMany(MedicaoIsolamento, { onDelete: 'CASCADE' });
Relatorio.hasMany(MedicaoBatimento, { onDelete: 'CASCADE' });
Relatorio.hasMany(PecaAtual, { onDelete: 'CASCADE' });
Relatorio.hasMany(FotoRelatorio, { onDelete: 'CASCADE' });

// Exporta tudo
export default {
  sequelize,
  User,
  Cliente,
  Peca,
  Servico,
  Relatorio,
  MedicaoIsolamento,
  MedicaoBatimento,
  PecaAtual,
  FotoRelatorio
};