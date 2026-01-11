// src/__tests__/middlewares/roleMiddleware.test.js

import { describe, it, expect, vi as jest, beforeEach } from 'vitest';
import { roleMiddleware, adminMiddleware } from '../../middlewares/roleMiddleware.js';

describe('RoleMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('roleMiddleware', () => {
    it('deve permitir acesso para role autorizada', () => {
      req.user = { id: 1, role: 'admin' };
      const middleware = roleMiddleware('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve permitir acesso para múltiplas roles', () => {
      req.user = { id: 1, role: 'user' };
      const middleware = roleMiddleware('admin', 'user', 'editor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve bloquear acesso para role não autorizada', () => {
      req.user = { id: 1, role: 'user' };
      const middleware = roleMiddleware('admin');

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Acesso negado: permissão insuficiente.' });
    });

    it('deve retornar 401 se usuário não autenticado', () => {
      req.user = null;
      const middleware = roleMiddleware('admin');

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Usuário não autenticado.' });
    });

    it('deve retornar 401 se req.user for undefined', () => {
      delete req.user;
      const middleware = roleMiddleware('admin');

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('deve funcionar com uma única role', () => {
      req.user = { id: 1, role: 'editor' };
      const middleware = roleMiddleware('editor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve ser case-sensitive para roles', () => {
      req.user = { id: 1, role: 'Admin' }; // A maiúscula
      const middleware = roleMiddleware('admin'); // a minúscula

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve permitir passar array de roles', () => {
      req.user = { id: 1, role: 'moderator' };
      const middleware = roleMiddleware('admin', 'moderator', 'editor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('adminMiddleware', () => {
    it('deve ser um atalho para roleMiddleware("admin")', () => {
      req.user = { id: 1, role: 'admin' };

      adminMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve bloquear usuários não-admin', () => {
      req.user = { id: 1, role: 'user' };

      adminMiddleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar 401 para não autenticados', () => {
      req.user = null;

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
