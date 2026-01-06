// src/validations/servicoValidation.js
import Joi from 'joi';

const servicoSchema = Joi.object({
  nome_servico: Joi.string()
    .required()
    .max(255)
    .trim()
    .messages({
      'any.required': 'Nome do serviço é obrigatório',
      'string.max': 'Nome não pode exceder 255 caracteres'
    }),

  descricao: Joi.string()
    .optional()
    .max(500)
    .trim(),

  valor_unitario: Joi.number()
    .optional()
    .min(0)
    .precision(2)
    .messages({
      'number.min': 'Valor unitário não pode ser negativo'
    }),

  categoria: Joi.string()
    .optional()
    .max(100)
    .trim(),

  tempo_estimado_horas: Joi.number()
    .optional()
    .positive()
    .messages({
      'number.positive': 'Tempo deve ser maior que zero'
    }),

  ativo: Joi.boolean()
    .optional()
    .default(true)
}).unknown(false);

const servicoUpdateSchema = servicoSchema.fork(['nome_servico'], schema => schema.optional());

export { servicoSchema, servicoUpdateSchema };
