import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'tecnico', 'emissor'),
    defaultValue: 'user',
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Refresh token para autenticação segura'
  },
  refreshTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de expiração do refresh token'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
});

export default User;