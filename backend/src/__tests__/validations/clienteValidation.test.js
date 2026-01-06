// src/__tests__/validations/clienteValidation.test.js
import Joi from 'joi';
import * as validations from '../../validations/clienteValidation.js';

describe('Validações de Cliente', () => {
  describe('CNPJ', () => {
    it('deve aceitar CNPJ válido', async () => {
      const schema = Joi.object({
        cnpj: validations.clienteSchema.extract('cnpj')
      });

      const { error } = schema.validate({ cnpj: '12345678901234' });
      expect(error).toBeUndefined();
    });

    it('deve rejeitar CNPJ vazio', async () => {
      const schema = Joi.object({
        cnpj: validations.clienteSchema.extract('cnpj')
      });

      const { error } = schema.validate({ cnpj: '' });
      expect(error).toBeDefined();
      expect(error.message).toContain('CNPJ é obrigatório');
    });

    it('deve rejeitar CNPJ com caracteres não numéricos', async () => {
      const schema = Joi.object({
        cnpj: validations.clienteSchema.extract('cnpj')
      });

      const { error } = schema.validate({ cnpj: '1234567890123a' });
      expect(error).toBeDefined();
    });

    it('deve rejeitar CNPJ com menos de 14 dígitos', async () => {
      const schema = Joi.object({
        cnpj: validations.clienteSchema.extract('cnpj')
      });

      const { error } = schema.validate({ cnpj: '123456789012' });
      expect(error).toBeDefined();
    });

    it('deve rejeitar CNPJ com mais de 14 dígitos', async () => {
      const schema = Joi.object({
        cnpj: validations.clienteSchema.extract('cnpj')
      });

      const { error } = schema.validate({ cnpj: '123456789012345' });
      expect(error).toBeDefined();
    });
  });

  describe('Nome Fantasia', () => {
    it('deve aceitar nome válido', async () => {
      const schema = Joi.object({
        nome_fantasia: validations.clienteSchema.extract('nome_fantasia')
      });

      const { error } = schema.validate({ nome_fantasia: 'Empresa LTDA' });
      expect(error).toBeUndefined();
    });

    it('deve rejeitar nome vazio', async () => {
      const schema = Joi.object({
        nome_fantasia: validations.clienteSchema.extract('nome_fantasia')
      });

      const { error } = schema.validate({ nome_fantasia: '' });
      expect(error).toBeDefined();
    });

    it('deve rejeitar nome com mais de 100 caracteres', async () => {
      const schema = Joi.object({
        nome_fantasia: validations.clienteSchema.extract('nome_fantasia')
      });

      const nomeGrande = 'A'.repeat(101);
      const { error } = schema.validate({ nome_fantasia: nomeGrande });
      expect(error).toBeDefined();
    });

    it('deve aceitar nome com 100 caracteres', async () => {
      const schema = Joi.object({
        nome_fantasia: validations.clienteSchema.extract('nome_fantasia')
      });

      const nome100 = 'A'.repeat(100);
      const { error } = schema.validate({ nome_fantasia: nome100 });
      expect(error).toBeUndefined();
    });

    it('deve fazer trim em espaços', async () => {
      const schema = Joi.object({
        nome_fantasia: validations.clienteSchema.extract('nome_fantasia')
      });

      const { value } = schema.validate({ nome_fantasia: '  Empresa  ' });
      expect(value.nome_fantasia).toBe('Empresa');
    });
  });

  describe('Estado', () => {
    it('deve aceitar estado válido (2 caracteres)', async () => {
      const schema = Joi.object({
        estado: validations.clienteSchema.extract('estado')
      });

      const { value } = schema.validate({ estado: 'sp' });
      expect(value.estado).toBe('SP'); // Deve converter para uppercase
    });

    it('deve rejeitar estado com 1 caractere', async () => {
      const schema = Joi.object({
        estado: validations.clienteSchema.extract('estado')
      });

      const { error } = schema.validate({ estado: 's' });
      expect(error).toBeDefined();
    });

    it('deve rejeitar estado com 3 caracteres', async () => {
      const schema = Joi.object({
        estado: validations.clienteSchema.extract('estado')
      });

      const { error } = schema.validate({ estado: 'sao' });
      expect(error).toBeDefined();
    });

    it('deve aceitar estado opcional (não enviado)', async () => {
      const schema = Joi.object({
        estado: validations.clienteSchema.extract('estado')
      });

      const { error } = schema.validate({});
      expect(error).toBeUndefined();
    });
  });

  describe('Cliente Completo', () => {
    const dadosValidos = {
      cnpj: '12345678901234',
      nome_fantasia: 'Empresa Teste LTDA',
      razao_social: 'Empresa Teste Razão Social LTDA',
      endereco: 'Rua Teste, 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'sp',
      cep: '01234-567'
    };

    it('deve validar cliente completo', async () => {
      const { error } = validations.clienteSchema.validate(dadosValidos);
      expect(error).toBeUndefined();
    });

    it('deve validar cliente com apenas campos obrigatórios', async () => {
      const minimo = {
        cnpj: '12345678901234',
        nome_fantasia: 'Empresa'
      };

      const { error } = validations.clienteSchema.validate(minimo);
      expect(error).toBeUndefined();
    });

    it('deve rejeitar campos desconhecidos', async () => {
      const comCampoDesconhecido = { ...dadosValidos, campoInvalido: 'valor' };

      const { error } = validations.clienteSchema.validate(comCampoDesconhecido);
      expect(error).toBeDefined();
    });
  });
});
