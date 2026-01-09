// backend/src/config/validateEnv.js
// Validação de variáveis de ambiente obrigatórias

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/**
 * Lista de variáveis de ambiente obrigatórias
 * Será validada no startup do servidor
 */
const REQUIRED_ENVS = {
  NODE_ENV: {
    required: true,
    default: 'development',
    values: ['development', 'production', 'test']
  },
  PORT: {
    required: false,
    default: 3001,
    type: 'number'
  },
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL connection string'
  },
  JWT_SECRET: {
    required: true,
    minLength: 32,
    description: 'JWT secret key (min 32 chars)'
  },
  ALLOWED_ORIGINS: {
    required: true,
    description: 'Comma-separated list of allowed CORS origins'
  },
  FRONTEND_URL: {
    required: true,
    description: 'Frontend URL for email links'
  },
  SERVER_BASE_URL: {
    required: false,
    default: 'http://localhost:3001',
    description: 'Backend base URL'
  },
  EMAIL_USER: {
    required: process.env.NODE_ENV === 'production',
    description: 'Email account for sending (required in prod)'
  },
  EMAIL_APP_PASS: {
    required: process.env.NODE_ENV === 'production',
    description: 'Email app password (required in prod)'
  },
  EMAIL_FROM: {
    required: false,
    default: 'noreply@edda.com'
  },
  EMAIL_SERVICE: {
    required: false,
    default: 'gmail'
  },
  SENTRY_DSN: {
    required: false,
    description: 'Sentry error tracking (optional)'
  }
};

/**
 * Valida todas as variáveis de ambiente
 * Lança erro se alguma obrigatória estiver faltando
 */
export function validateEnvironment() {
  const errors = [];
  const warnings = [];

  Object.entries(REQUIRED_ENVS).forEach(([key, config]) => {
    const value = process.env[key];
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Verificar se é obrigatória
    if (config.required && !value) {
      errors.push(`❌ Variável obrigatória não definida: ${key}`);
      if (config.description) {
        errors.push(`   → ${config.description}`);
      }
    }

    // Verificar comprimento mínimo (para JWT_SECRET)
    if (value && config.minLength && value.length < config.minLength) {
      errors.push(`❌ ${key} deve ter no mínimo ${config.minLength} caracteres (tem ${value.length})`);
    }

    // Verificar valores permitidos
    if (value && config.values && !config.values.includes(value)) {
      errors.push(`❌ ${key} deve ser um de: ${config.values.join(', ')}`);
    }

    // Advertência se estiver usando valor padrão em produção
    if (
      process.env.NODE_ENV === 'production' &&
      !value &&
      config.default &&
      !config.required
    ) {
      warnings.push(`⚠️  ${key} usando valor padrão em produção: ${config.default}`);
    }

    // Verificar se DATABASE_URL é válido
    if (key === 'DATABASE_URL' && value && !value.startsWith('postgresql://')) {
      errors.push(`❌ DATABASE_URL deve ser uma URL PostgreSQL válida`);
    }

    // Verificar se ALLOWED_ORIGINS tem formato válido
    if (key === 'ALLOWED_ORIGINS' && value) {
      const origins = value.split(',').map(o => o.trim());
      origins.forEach(origin => {
        if (!origin.startsWith('http://') && !origin.startsWith('https://')) {
          errors.push(`❌ ALLOWED_ORIGINS inválido: "${origin}" (deve começar com http:// ou https://)`);
        }
      });
    }

    // Avisar se JWT_SECRET estiver com valor de exemplo
    if (key === 'JWT_SECRET' && value && value.includes('example')) {
      warnings.push(`⚠️  JWT_SECRET contém a palavra "example" - considere gerar uma chave segura`);
    }

    // Avisar se senhas padrão estão ativas
    if (key === 'PASSWORD' && value === 'admin123456') {
      warnings.push(`⚠️  Senha padrão detectada - altere em produção`);
    }
  });

  // Se há erros, exibir e sair
  if (errors.length > 0) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ ERRO: Variáveis de ambiente inválidas ou faltando');
    console.error('='.repeat(60));
    errors.forEach(error => console.error(error));
    console.error('='.repeat(60));
    console.error('\n📝 Crie um arquivo .env.production com as variáveis obrigatórias');
    console.error('📚 Referência: backend/.env.production.example\n');
    process.exit(1);
  }

  // Avisos
  if (warnings.length > 0) {
    console.warn('\n' + '⚠️  '.repeat(20));
    console.warn('⚠️  AVISOS DE CONFIGURAÇÃO');
    console.warn('⚠️  '.repeat(20));
    warnings.forEach(warning => console.warn(warning));
    console.warn('⚠️  '.repeat(20) + '\n');
  }

  console.log('✅ Todas as variáveis de ambiente validadas com sucesso!\n');
}

/**
 * Gera uma chave JWT_SECRET aleatória segura
 * Útil para inicialização
 */
export function generateJWTSecret(length = 32) {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Exibe o template de .env.production
 */
export function printEnvTemplate() {
  console.log('\n📝 Template de .env.production:\n');
  console.log('NODE_ENV=production');
  console.log('PORT=3001');
  console.log('DATABASE_URL=postgresql://user:pass@host:5432/edda_db?sslmode=require');
  console.log(`JWT_SECRET=${generateJWTSecret()}`);
  console.log('ALLOWED_ORIGINS=https://seu-dominio.com');
  console.log('FRONTEND_URL=https://seu-dominio.com');
  console.log('SERVER_BASE_URL=https://api.seu-dominio.com');
  console.log('EMAIL_USER=seu-email@gmail.com');
  console.log('EMAIL_APP_PASS=sua-app-password');
  console.log('EMAIL_FROM="EDDA <seu-email@gmail.com>"');
  console.log('EMAIL_SERVICE=gmail\n');
}

export default {
  validateEnvironment,
  generateJWTSecret,
  printEnvTemplate
};
