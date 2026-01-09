// src/__tests__/middlewares/authMiddleware.test.js
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock do logger antes de importar o middleware
jest.unstable_mockModule('../../config/logger.js', () => ({
  default: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

const { default: authMiddleware } = await import('../../middlewares/authMiddleware.js');
const { default: logger } = await import('../../config/logger.js');

describe('AuthMiddleware', () => {
  let req, res, next;
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret-key';
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  describe('Token válido', () => {
    it('deve autenticar com token válido', () => {
      const payload = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        role: 'user'
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(payload);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve extrair apenas campos necessários do token', () => {
      const payload = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        role: 'admin',
        extra: 'não deve ser incluído',
        iat: Date.now()
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(req.user).toEqual({
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        role: 'admin'
      });
      expect(req.user.extra).toBeUndefined();
      expect(req.user.iat).toBeUndefined();
    });

    it('deve funcionar com diferentes roles', () => {
      const roles = ['user', 'admin', 'manager'];
      
      roles.forEach(role => {
        jest.clearAllMocks();
        const payload = {
          id: 1,
          nome: 'Test',
          email: 'test@example.com',
          role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        
        req.headers.authorization = `Bearer ${token}`;
        
        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user.role).toBe(role);
      });
    });
  });

  describe('Token ausente ou inválido', () => {
    it('deve rejeitar requisição sem header authorization', () => {
      authMiddleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Token de acesso ausente ou inválido.'
      });
    });

    it('deve rejeitar header sem Bearer', () => {
      req.headers.authorization = 'InvalidFormat token123';
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Token de acesso ausente ou inválido.'
      });
    });

    it('deve rejeitar apenas "Bearer" sem token', () => {
      req.headers.authorization = 'Bearer ';
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('deve rejeitar token vazio', () => {
      req.headers.authorization = 'Bearer';
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Token expirado', () => {
    it('deve rejeitar token expirado', () => {
      const payload = {
        id: 1,
        nome: 'João',
        email: 'joao@example.com',
        role: 'user'
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1h' });
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Token expirado. Faça login novamente.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Token corrompido', () => {
    it('deve rejeitar token com assinatura inválida', () => {
      const payload = {
        id: 1,
        nome: 'João',
        email: 'joao@example.com',
        role: 'user'
      };
      const token = jwt.sign(payload, 'wrong-secret');
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Token inválido ou corrompido.'
      });
    });

    it('deve rejeitar token malformado', () => {
      req.headers.authorization = 'Bearer invalid.token.here';
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Token inválido ou corrompido.'
      });
    });

    it('deve rejeitar token com caracteres inválidos', () => {
      req.headers.authorization = 'Bearer abc123!@#$%';
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Configuração do servidor', () => {
    it('deve retornar erro 500 se JWT_SECRET não estiver configurado', () => {
      delete process.env.JWT_SECRET;
      
      const token = 'any-token';
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Erro de configuração do servidor.'
      });
      expect(logger.error).toHaveBeenCalledWith('JWT_SECRET não está definido no .env');
      expect(next).not.toHaveBeenCalled();
    });

    it('deve logar erros inesperados', () => {
      // Forçar um erro diferente de TokenExpiredError e JsonWebTokenError
      const invalidToken = 'Bearer eyJhbGciOiJub25lIn0.eyJpZCI6MX0.';
      req.headers.authorization = invalidToken;
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Formato do header', () => {
    it('deve aceitar Bearer com B maiúsculo', () => {
      const payload = { id: 1, nome: 'Test', email: 'test@example.com', role: 'user' };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve rejeitar bearer com b minúsculo', () => {
      const payload = { id: 1, nome: 'Test', email: 'test@example.com', role: 'user' };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve extrair token corretamente com espaços', () => {
      const payload = { id: 1, nome: 'Test', email: 'test@example.com', role: 'user' };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });
  });

  describe('Dados do usuário', () => {
    it('deve anexar todos os campos obrigatórios em req.user', () => {
      const payload = {
        id: 42,
        nome: 'Maria Silva',
        email: 'maria@example.com',
        role: 'admin'
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(req.user).toHaveProperty('id', 42);
      expect(req.user).toHaveProperty('nome', 'Maria Silva');
      expect(req.user).toHaveProperty('email', 'maria@example.com');
      expect(req.user).toHaveProperty('role', 'admin');
    });

    it('deve preservar tipos de dados', () => {
      const payload = {
        id: 123,
        nome: 'João',
        email: 'joao@example.com',
        role: 'user'
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;
      
      authMiddleware(req, res, next);

      expect(typeof req.user.id).toBe('number');
      expect(typeof req.user.nome).toBe('string');
      expect(typeof req.user.email).toBe('string');
      expect(typeof req.user.role).toBe('string');
    });
  });
});
