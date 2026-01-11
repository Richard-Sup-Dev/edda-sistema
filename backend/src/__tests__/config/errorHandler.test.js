// src/__tests__/config/errorHandler.test.js
import { describe, it, expect, vi as jest, beforeEach } from 'vitest';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
} from '../../config/errorHandler.js';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('deve criar erro com mensagem e status padrão', () => {
      const error = new AppError('Erro genérico');
      
      expect(error.message).toBe('Erro genérico');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('AppError');
    });

    it('deve criar erro com status customizado', () => {
      const error = new AppError('Erro customizado', 418);
      
      expect(error.message).toBe('Erro customizado');
      expect(error.statusCode).toBe(418);
    });

    it('deve ter stack trace', () => {
      const error = new AppError('Erro com stack');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('deve ser instância de Error', () => {
      const error = new AppError('Teste');
      
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('deve criar erro de validação com status 400', () => {
      const error = new ValidationError('Validação falhou');
      
      expect(error.message).toBe('Validação falhou');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ValidationError');
    });

    it('deve incluir detalhes de validação', () => {
      const details = [
        { field: 'email', message: 'Email inválido' },
        { field: 'senha', message: 'Senha muito curta' }
      ];
      const error = new ValidationError('Validação falhou', details);
      
      expect(error.details).toEqual(details);
      expect(error.details).toHaveLength(2);
    });

    it('deve ter array vazio de detalhes por padrão', () => {
      const error = new ValidationError('Erro');
      
      expect(error.details).toEqual([]);
      expect(Array.isArray(error.details)).toBe(true);
    });

    it('deve ser instância de AppError', () => {
      const error = new ValidationError('Teste');
      
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ValidationError).toBe(true);
    });
  });

  describe('AuthenticationError', () => {
    it('deve criar erro de autenticação com status 401', () => {
      const error = new AuthenticationError();
      
      expect(error.message).toBe('Autenticação falhou');
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('AuthenticationError');
    });

    it('deve aceitar mensagem customizada', () => {
      const error = new AuthenticationError('Token inválido');
      
      expect(error.message).toBe('Token inválido');
      expect(error.statusCode).toBe(401);
    });

    it('deve ser instância de AppError', () => {
      const error = new AuthenticationError();
      
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof AuthenticationError).toBe(true);
    });
  });

  describe('AuthorizationError', () => {
    it('deve criar erro de autorização com status 403', () => {
      const error = new AuthorizationError();
      
      expect(error.message).toBe('Acesso negado');
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe('AuthorizationError');
    });

    it('deve aceitar mensagem customizada', () => {
      const error = new AuthorizationError('Permissão insuficiente');
      
      expect(error.message).toBe('Permissão insuficiente');
      expect(error.statusCode).toBe(403);
    });

    it('deve ser instância de AppError', () => {
      const error = new AuthorizationError();
      
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof AuthorizationError).toBe(true);
    });
  });

  describe('NotFoundError', () => {
    it('deve criar erro 404 com mensagem padrão', () => {
      const error = new NotFoundError();
      
      expect(error.message).toBe('Recurso não encontrado');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('NotFoundError');
    });

    it('deve aceitar nome do recurso', () => {
      const error = new NotFoundError('Cliente');
      
      expect(error.message).toBe('Cliente não encontrado');
      expect(error.statusCode).toBe(404);
    });

    it('deve formatar mensagem para diferentes recursos', () => {
      const errorUsuario = new NotFoundError('Usuário');
      const errorRelatorio = new NotFoundError('Relatório');
      
      expect(errorUsuario.message).toBe('Usuário não encontrado');
      expect(errorRelatorio.message).toBe('Relatório não encontrado');
    });

    it('deve ser instância de AppError', () => {
      const error = new NotFoundError();
      
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof NotFoundError).toBe(true);
    });
  });

  describe('ConflictError', () => {
    it('deve criar erro de conflito com status 409', () => {
      const error = new ConflictError();
      
      expect(error.message).toBe('Conflito nos dados');
      expect(error.statusCode).toBe(409);
      expect(error.name).toBe('ConflictError');
    });

    it('deve aceitar mensagem customizada', () => {
      const error = new ConflictError('Email já cadastrado');
      
      expect(error.message).toBe('Email já cadastrado');
      expect(error.statusCode).toBe(409);
    });

    it('deve ser instância de AppError', () => {
      const error = new ConflictError();
      
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ConflictError).toBe(true);
    });
  });

  describe('Herança e Polimorfismo', () => {
    it('todos os erros customizados devem herdar de AppError', () => {
      const errors = [
        new ValidationError('teste'),
        new AuthenticationError('teste'),
        new AuthorizationError('teste'),
        new NotFoundError('teste'),
        new ConflictError('teste')
      ];

      errors.forEach(error => {
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof Error).toBe(true);
      });
    });

    it('deve ser possível capturar por tipo específico', () => {
      try {
        throw new ValidationError('Erro de validação');
      } catch (error) {
        expect(error instanceof ValidationError).toBe(true);
        expect(error instanceof AppError).toBe(true);
        expect(error.statusCode).toBe(400);
      }
    });

    it('deve preservar nome da classe', () => {
      const errors = [
        { error: new AppError('teste'), expected: 'AppError' },
        { error: new ValidationError('teste'), expected: 'ValidationError' },
        { error: new AuthenticationError('teste'), expected: 'AuthenticationError' },
        { error: new AuthorizationError('teste'), expected: 'AuthorizationError' },
        { error: new NotFoundError('teste'), expected: 'NotFoundError' },
        { error: new ConflictError('teste'), expected: 'ConflictError' }
      ];

      errors.forEach(({ error, expected }) => {
        expect(error.name).toBe(expected);
      });
    });
  });

  describe('Propriedades dos Erros', () => {
    it('todos os erros devem ter statusCode', () => {
      const errors = [
        new AppError('teste', 500),
        new ValidationError('teste'),
        new AuthenticationError('teste'),
        new AuthorizationError('teste'),
        new NotFoundError('teste'),
        new ConflictError('teste')
      ];

      errors.forEach(error => {
        expect(error.statusCode).toBeDefined();
        expect(typeof error.statusCode).toBe('number');
      });
    });

    it('todos os erros devem ter message', () => {
      const errors = [
        new AppError('mensagem'),
        new ValidationError('mensagem'),
        new AuthenticationError('mensagem'),
        new AuthorizationError('mensagem'),
        new NotFoundError('Recurso'),
        new ConflictError('mensagem')
      ];

      errors.forEach(error => {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
        expect(error.message.length).toBeGreaterThan(0);
      });
    });

    it('todos os erros devem ter stack trace', () => {
      const errors = [
        new AppError('teste'),
        new ValidationError('teste'),
        new AuthenticationError('teste'),
        new AuthorizationError('teste'),
        new NotFoundError('teste'),
        new ConflictError('teste')
      ];

      errors.forEach(error => {
        expect(error.stack).toBeDefined();
        expect(typeof error.stack).toBe('string');
      });
    });
  });
});
