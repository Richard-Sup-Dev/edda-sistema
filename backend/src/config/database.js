// src/config/database.js
import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Opções comuns para ambos os ambientes
const baseOptions = {
  dialect: 'postgres',
  logging: false, // Evita logs excessivos do Sequelize em produção
  define: {
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    underscored: true, // Recomendado: usa snake_case nos nomes automáticos
  },
  // Pool de conexões (boa prática para produção)
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

let sequelize;

// Prioridade para DATABASE_URL (usado por Neon, Render, Railway, Supabase, etc.)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...baseOptions,
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necessário para a maioria dos provedores serverless
      },
    },
  });
} else {
  // Configuração local/manual (desenvolvimento)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'edda_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '',
    {
      ...baseOptions,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialectOptions: {
        ssl:
          process.env.NODE_ENV === 'production'
            ? { require: true, rejectUnauthorized: false }
            : false,
      },
    }
  );
}

// Teste de conexão ao iniciar (não roda em testes automatizados)
if (process.env.NODE_ENV !== 'test') {
  sequelize
    .authenticate()
    .then(() => {
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch((err) => {
      console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    });
}

// Exporta a instância única
export default sequelize;