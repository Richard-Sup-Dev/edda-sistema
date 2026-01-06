// src/middlewares/auth.js

import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Garante que process.env.JWT_SECRET esteja carregado

// ==================== AUTENTICAÇÃO BÁSICA (JWT) ====================
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifica formato Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de acesso ausente ou inválido.' });
  }

  const token = authHeader.split(' ')[1];

  // Verifica se JWT_SECRET está definido (nunca use fallback em produção)
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET não está definido no .env');
    return res.status(500).json({ erro: 'Erro de configuração do servidor.' });
  }

  // Verificação síncrona (recomendado para JWT)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ erro: 'Falha na autenticação.' });
  }
}

// ==================== VERIFICAÇÃO DE ROLE (FLEXÍVEL) ====================
/**
 * Middleware para verificar se o usuário tem uma das roles permitidas.
 * Uso: adminMiddleware('admin') ou adminMiddleware('admin', 'emissor')
 */
export function roleMiddleware(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({
        erro: 'Acesso negado: permissão insuficiente.'
      });
    }

    return next();
  };
}

// ==================== ATALHO PARA ADMIN (OPCIONAL, MAS ÚTIL) ====================
export const adminMiddleware = roleMiddleware('admin');