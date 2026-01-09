// backend/src/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import 'dotenv/config';
import logger from '../config/logger.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o header existe e está no formato Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de acesso ausente ou inválido.' });
  }

  const token = authHeader.split(' ')[1];

  // Garante que o JWT_SECRET esteja configurado
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET não está definido no .env');
    return res.status(500).json({ erro: 'Erro de configuração do servidor.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Anexa apenas os dados necessários do usuário na requisição
    req.user = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido ou corrompido.' });
    }

    logger.error('Erro na verificação do token:', error);
    return res.status(401).json({ erro: 'Falha na autenticação.' });
  }
};

export default authMiddleware;