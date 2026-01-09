import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Atividade = sequelize.define('Atividade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('create', 'update', 'delete', 'login', 'logout', 'view', 'export', 'print'),
    allowNull: false
  },
  acao: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Descrição da ação realizada'
  },
  entidade: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Tipo de entidade afetada (cliente, relatório, peça, etc)'
  },
  entidadeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID da entidade afetada'
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descrição detalhada da atividade'
  },
  dadosAntigos: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Estado anterior (para updates/deletes)'
  },
  dadosNovos: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Novo estado (para creates/updates)'
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'Endereço IP do usuário'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User agent do navegador'
  }
}, {
  tableName: 'atividades',
  timestamps: false
});

export default Atividade;
