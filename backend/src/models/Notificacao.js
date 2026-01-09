import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notificacao = sequelize.define('Notificacao', {
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
    type: DataTypes.ENUM('relatorio', 'cliente', 'pagamento', 'sistema', 'alerta', 'tarefa', 'mensagem'),
    allowNull: false,
    defaultValue: 'sistema'
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  lida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  link: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Link para a página relacionada à notificação'
  },
  dados: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Dados adicionais da notificação'
  },
  prioridade: {
    type: DataTypes.ENUM('baixa', 'normal', 'alta', 'urgente'),
    defaultValue: 'normal'
  },
  expiraEm: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de expiração da notificação'
  }
}, {
  tableName: 'notificacoes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['usuario_id', 'lida']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Notificacao;
