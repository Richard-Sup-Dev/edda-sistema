// src/middlewares/isAdmin.js

/**
 * Middleware para verificar se o usuário é administrador.
 * Deve ser usado APÓS o authMiddleware (que define req.user).
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ erro: 'Não autenticado.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      erro: 'Acesso negado: apenas administradores podem realizar esta ação.'
    });
  }

  // Usuário é admin → prossegue
  next();
};

export default isAdmin;