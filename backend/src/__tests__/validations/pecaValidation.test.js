// src/__tests__/validations/pecaValidation.test.js

import { describe, it, expect } from '@jest/globals';
import { pecaSchema, pecaUpdateSchema } from '../../validations/pecaValidation.js';

describe('PecaValidation', () => {
  describe('pecaSchema - criação', () => {
    it('deve validar peça válida completa', () => {
      const peca = {
        nome_peca: 'Motor Elétrico',
        codigo_fabrica: 'MOT-001',
        valor_custo: 150.50,
        valor_venda: 200.00,
        descricao: 'Motor elétrico 220V',
        categoria: 'Motores',
        estoque: 10
      };

      const { error, value } = pecaSchema.validate(peca);
      expect(error).toBeUndefined();
      expect(value).toMatchObject(peca);
    });

    it('deve validar peça com apenas campos obrigatórios', () => {
      const peca = {
        nome_peca: 'Parafuso'
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeUndefined();
    });

    it('deve rejeitar peça sem nome', () => {
      const peca = {
        codigo_fabrica: 'PAR-001'
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Nome da peça é obrigatório');
    });

    it('deve rejeitar nome muito longo', () => {
      const peca = {
        nome_peca: 'A'.repeat(256)
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode exceder 255 caracteres');
    });

    it('deve rejeitar valor_custo negativo', () => {
      const peca = {
        nome_peca: 'Teste',
        valor_custo: -10
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode ser negativo');
    });

    it('deve rejeitar valor_venda negativo', () => {
      const peca = {
        nome_peca: 'Teste',
        valor_venda: -5
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode ser negativo');
    });

    it('deve rejeitar estoque negativo', () => {
      const peca = {
        nome_peca: 'Teste',
        estoque: -1
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode ser negativo');
    });

    it('deve rejeitar estoque decimal', () => {
      const peca = {
        nome_peca: 'Teste',
        estoque: 10.5
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
    });

    it('deve fazer trim em strings', () => {
      const peca = {
        nome_peca: '  Motor Elétrico  ',
        descricao: '  Descrição  '
      };

      const { error, value } = pecaSchema.validate(peca);
      expect(error).toBeUndefined();
      expect(value.nome_peca).toBe('Motor Elétrico');
      expect(value.descricao).toBe('Descrição');
    });

    it('deve rejeitar campos desconhecidos', () => {
      const peca = {
        nome_peca: 'Teste',
        campo_invalido: 'valor'
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeDefined();
    });

    it('deve validar valores decimais com precisão 2', () => {
      const peca = {
        nome_peca: 'Teste',
        valor_custo: 99.99,
        valor_venda: 149.99
      };

      const { error } = pecaSchema.validate(peca);
      expect(error).toBeUndefined();
    });
  });

  describe('pecaUpdateSchema - atualização', () => {
    it('deve permitir atualização sem nome_peca', () => {
      const update = {
        valor_venda: 250.00,
        estoque: 5
      };

      const { error } = pecaUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });

    it('deve permitir atualização parcial', () => {
      const update = {
        categoria: 'Nova Categoria'
      };

      const { error } = pecaUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });

    it('deve validar valores mesmo em atualização', () => {
      const update = {
        valor_custo: -50
      };

      const { error } = pecaUpdateSchema.validate(update);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode ser negativo');
    });
  });
});
