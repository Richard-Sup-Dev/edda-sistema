// src/__tests__/validations/servicoValidation.test.js

import { describe, it, expect } from '@jest/globals';
import { servicoSchema, servicoUpdateSchema } from '../../validations/servicoValidation.js';

describe('ServicoValidation', () => {
  describe('servicoSchema - criação', () => {
    it('deve validar serviço válido completo', () => {
      const servico = {
        nome_servico: 'Consultoria Técnica',
        descricao: 'Serviço de consultoria especializada',
        valor_unitario: 150.00,
        categoria: 'Consultoria',
        tempo_estimado_horas: 4,
        ativo: true
      };

      const { error, value } = servicoSchema.validate(servico);
      expect(error).toBeUndefined();
      expect(value).toMatchObject(servico);
    });

    it('deve validar serviço com apenas nome', () => {
      const servico = {
        nome_servico: 'Manutenção'
      };

      const { error, value } = servicoSchema.validate(servico);
      expect(error).toBeUndefined();
      expect(value.ativo).toBe(true); // valor padrão
    });

    it('deve rejeitar serviço sem nome', () => {
      const servico = {
        descricao: 'Teste'
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Nome do serviço é obrigatório');
    });

    it('deve rejeitar nome muito longo', () => {
      const servico = {
        nome_servico: 'A'.repeat(256)
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode exceder 255 caracteres');
    });

    it('deve rejeitar valor_unitario negativo', () => {
      const servico = {
        nome_servico: 'Teste',
        valor_unitario: -100
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode ser negativo');
    });

    it('deve rejeitar tempo_estimado_horas zero ou negativo', () => {
      const servico = {
        nome_servico: 'Teste',
        tempo_estimado_horas: 0
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Tempo deve ser maior que zero');
    });

    it('deve fazer trim em strings', () => {
      const servico = {
        nome_servico: '  Consultoria  ',
        descricao: '  Descrição  ',
        categoria: '  Categoria  '
      };

      const { error, value } = servicoSchema.validate(servico);
      expect(error).toBeUndefined();
      expect(value.nome_servico).toBe('Consultoria');
      expect(value.descricao).toBe('Descrição');
      expect(value.categoria).toBe('Categoria');
    });

    it('deve rejeitar campos desconhecidos', () => {
      const servico = {
        nome_servico: 'Teste',
        campo_invalido: 'valor'
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
    });

    it('deve validar ativo como boolean', () => {
      const servico1 = {
        nome_servico: 'Teste',
        ativo: true
      };
      const servico2 = {
        nome_servico: 'Teste',
        ativo: false
      };

      expect(servicoSchema.validate(servico1).error).toBeUndefined();
      expect(servicoSchema.validate(servico2).error).toBeUndefined();
    });

    it('deve rejeitar ativo não-boolean', () => {
      const servico = {
        nome_servico: 'Teste',
        ativo: 'sim'
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
    });

    it('deve validar valores decimais com precisão 2', () => {
      const servico = {
        nome_servico: 'Teste',
        valor_unitario: 99.99
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeUndefined();
    });

    it('deve rejeitar descricao muito longa', () => {
      const servico = {
        nome_servico: 'Teste',
        descricao: 'A'.repeat(501)
      };

      const { error } = servicoSchema.validate(servico);
      expect(error).toBeDefined();
    });
  });

  describe('servicoUpdateSchema - atualização', () => {
    it('deve permitir atualização sem nome_servico', () => {
      const update = {
        valor_unitario: 200.00,
        ativo: false
      };

      const { error } = servicoUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });

    it('deve permitir atualização parcial', () => {
      const update = {
        categoria: 'Nova Categoria'
      };

      const { error } = servicoUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });

    it('deve validar valores mesmo em atualização', () => {
      const update = {
        valor_unitario: -50
      };

      const { error } = servicoUpdateSchema.validate(update);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('não pode ser negativo');
    });

    it('deve permitir desativar serviço', () => {
      const update = {
        ativo: false
      };

      const { error } = servicoUpdateSchema.validate(update);
      expect(error).toBeUndefined();
    });
  });
});
