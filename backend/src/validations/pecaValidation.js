// src/validations/pecaValidation.js
import Joi from 'joi';

const pecaSchema = Joi.object({
  nome_peca: Joi.string()
    .required()
    .max(255)
    .trim()
    .messages({
      'any.required': 'Nome da peça é obrigatório',
      'string.max': 'Nome não pode exceder 255 caracteres'
    }),

  codigo_fabrica: Joi.string()
    .optional()
    .max(100)
    .trim(),

  valor_custo: Joi.number()
    .optional()
    .min(0)
    .precision(2)
    .messages({
      'number.min': 'Valor de custo não pode ser negativo'
    }),

  valor_venda: Joi.number()
    .optional()
    .min(0)
    .precision(2)
    .messages({
      'number.min': 'Valor de venda não pode ser negativo'
    }),

  descricao: Joi.string()
    .optional()
    .max(500)
    .trim(),

  categoria: Joi.string()
    .optional()
    .max(100)
    .trim(),

  estoque: Joi.number()
    .optional()
    .integer()
    .min(0)
    .messages({
      'number.min': 'Estoque não pode ser negativo'
    })
}).unknown(false);

const pecaUpdateSchema = pecaSchema.fork(['nome_peca'], schema => schema.optional());

export { pecaSchema, pecaUpdateSchema };
