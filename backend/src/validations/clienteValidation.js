// src/validations/clienteValidation.js
import Joi from 'joi';

const clienteSchema = Joi.object({
  cnpj: Joi.string()
    .required()
    .length(14)
    .pattern(/^\d{14}$/)
    .messages({
      'string.empty': 'CNPJ é obrigatório',
      'string.pattern.base': 'CNPJ deve conter apenas 14 dígitos',
      'string.length': 'CNPJ deve ter exatamente 14 dígitos',
      'any.required': 'CNPJ é obrigatório'
    }),

  nome_fantasia: Joi.string()
    .required()
    .max(100)
    .trim()
    .messages({
      'any.required': 'Nome fantasia é obrigatório',
      'string.max': 'Nome fantasia não pode exceder 100 caracteres'
    }),

  razao_social: Joi.string()
    .optional()
    .max(255)
    .trim(),

  endereco: Joi.string()
    .optional()
    .max(255)
    .trim(),

  bairro: Joi.string()
    .optional()
    .max(100)
    .trim(),

  cidade: Joi.string()
    .optional()
    .max(100)
    .trim(),

  estado: Joi.string()
    .optional()
    .length(2)
    .uppercase(),

  cep: Joi.string()
    .optional()
    .pattern(/^\d{5}-?\d{3}$/)
    .messages({
      'string.pattern.base': 'CEP deve estar no formato 12345-678 ou 12345678'
    }),

  responsavel_contato: Joi.string()
    .optional()
    .max(100)
    .trim(),

  email: Joi.string()
    .optional()
    .email()
    .max(100),

  telefone: Joi.string()
    .optional()
    .pattern(/^[\d\-\(\)\s]+$/)
    .max(20)
    .messages({
      'string.pattern.base': 'Telefone inválido'
    })
}).unknown(false);

const clienteUpdateSchema = clienteSchema.fork(['cnpj', 'nome_fantasia'], schema => schema.optional());

export { clienteSchema, clienteUpdateSchema };
