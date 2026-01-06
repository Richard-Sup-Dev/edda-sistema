// backend/src/middlewares/roleMiddleware.js

export function roleMiddleware(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado: permissão insuficiente.' });
    }

    next();
  };
}

// Atalho útil
export const adminMiddleware = roleMiddleware('admin');