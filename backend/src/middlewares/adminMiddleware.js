// backend/src/middlewares/adminMiddleware.js

import logger from '../config/logger.js';

/**
 * Middleware para verificar se o usuário autenticado é administrador
 * Deve ser usado APÓS o authMiddleware
 */
const adminMiddleware = (req, res, next) => {
  // Verifica se req.user existe (garantido pelo authMiddleware)
  if (!req.user) {
    logger.warn('adminMiddleware: req.user não encontrado. Certifique-se de usar authMiddleware antes.');
    return res.status(401).json({ erro: 'Usuário não autenticado.' });
  }

  // Verifica se o usuário tem role de admin
  if (req.user.role !== 'admin') {
    logger.warn(`adminMiddleware: Acesso negado para usuário ${req.user.email} (role: ${req.user.role})`);
    return res.status(403).json({ 
      erro: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
    });
  }

  // Usuário é admin, pode continuar
  logger.info(`adminMiddleware: Acesso concedido para admin ${req.user.email}`);
  return next();
};

export default adminMiddleware;
