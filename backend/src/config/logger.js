// src/config/logger.js
// Configuração centralizada de logging com Winston

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Define o nível de log baseado no NODE_ENV
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Formato customizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Criar transportes (onde os logs vão ser salvos)
const transports = [
  // Console - sempre mostrar em desenvolvimento
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        let metaStr = '';
        if (Object.keys(meta).length > 0 && !meta.stack) {
          metaStr = ` ${JSON.stringify(meta)}`;
        }
        return `${timestamp} [${level}]: ${message}${metaStr}`;
      })
    )
  }),

  // Arquivo de rotação diária para TODOS os logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m', // 20MB por arquivo
    maxFiles: '14d', // Manter 14 dias de logs
    format: logFormat
  }),

  // Arquivo separado APENAS para erros
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error', // Apenas erros
    format: logFormat
  })
];

// Criar o logger principal
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: transports,
  // Não quebrar a aplicação se houver erro no logger
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD'
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD'
    })
  ]
});

// Se em produção, remover logs do console para performance
if (process.env.NODE_ENV === 'production') {
  logger.remove(logger.transports[0]); // Remove console transport
}

export default logger;
