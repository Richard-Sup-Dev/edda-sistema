// src/__tests__/middlewares/validateRequest.test.js
import { describe, it, expect, jest } from '@jest/globals';
import { validateRequest } from '../../middlewares/validateRequest.js';
import Joi from 'joi';

describe('ValidateRequest Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Validação de body (padrão)', () => {
    const schema = Joi.object({
      nome: Joi.string().required(),
      idade: Joi.number().min(0).required()
    });

    it('deve passar com dados válidos', () => {
      req.body = { nome: 'João', idade: 25 };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve rejeitar campos obrigatórios faltando', () => {
      req.body = { nome: 'João' };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Validação falhou',
        detalhes: expect.arrayContaining([
          expect.objectContaining({
            field: 'idade',
            message: expect.any(String)
          })
        ])
      });
    });

    it('deve rejeitar tipos inválidos', () => {
      req.body = { nome: 'João', idade: 'vinte' };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve remover campos não especificados no schema', () => {
      req.body = { nome: 'João', idade: 25, extra: 'removido' };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(req.body).toEqual({ nome: 'João', idade: 25 });
      expect(req.body.extra).toBeUndefined();
    });

    it('deve converter tipos quando possível', () => {
      req.body = { nome: 'João', idade: '25' };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(req.body.idade).toBe(25);
      expect(typeof req.body.idade).toBe('number');
    });

    it('deve validar múltiplos erros', () => {
      req.body = {};
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        erro: 'Validação falhou',
        detalhes: expect.arrayContaining([
          expect.objectContaining({ field: 'nome' }),
          expect.objectContaining({ field: 'idade' })
        ])
      });
    });
  });

  describe('Validação de query', () => {
    const schema = Joi.object({
      pagina: Joi.number().min(1),
      limite: Joi.number().min(1).max(100)
    });

    it('deve validar req.query quando especificado', () => {
      req.query = { pagina: '1', limite: '10' };
      const middleware = validateRequest(schema, 'query');
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.query.pagina).toBe(1);
      expect(req.query.limite).toBe(10);
    });

    it('deve rejeitar query params inválidos', () => {
      req.query = { pagina: '-1' };
      const middleware = validateRequest(schema, 'query');
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Validação de params', () => {
    const schema = Joi.object({
      id: Joi.number().required()
    });

    it('deve validar req.params quando especificado', () => {
      req.params = { id: '123' };
      const middleware = validateRequest(schema, 'params');
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.params.id).toBe(123);
    });

    it('deve rejeitar params inválidos', () => {
      req.params = { id: 'abc' };
      const middleware = validateRequest(schema, 'params');
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Validações complexas', () => {
    it('deve validar objetos aninhados', () => {
      const schema = Joi.object({
        usuario: Joi.object({
          nome: Joi.string().required(),
          email: Joi.string().email().required()
        }).required()
      });

      req.body = {
        usuario: {
          nome: 'João',
          email: 'joao@example.com'
        }
      };

      const middleware = validateRequest(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve validar arrays', () => {
      const schema = Joi.object({
        tags: Joi.array().items(Joi.string()).min(1)
      });

      req.body = { tags: ['tag1', 'tag2'] };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve validar arrays com elementos inválidos', () => {
      const schema = Joi.object({
        numeros: Joi.array().items(Joi.number())
      });

      req.body = { numeros: [1, 2, 'tres'] };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar mensagens de erro com path correto', () => {
      const schema = Joi.object({
        endereco: Joi.object({
          cidade: Joi.string().required()
        })
      });

      req.body = { endereco: {} };
      const middleware = validateRequest(schema);
      
      middleware(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        erro: 'Validação falhou',
        detalhes: expect.arrayContaining([
          expect.objectContaining({
            field: 'endereco.cidade'
          })
        ])
      });
    });
  });
});
