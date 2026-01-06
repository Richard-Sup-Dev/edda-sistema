// src/validations/userValidation.js
import Joi from 'joi';

const userSchema = Joi.object({
  nome: Joi.string()
    .required()
    .max(100)
    .trim()
    .messages({
      'any.required': 'Nome é obrigatório',
      'string.max': 'Nome não pode exceder 100 caracteres'
    }),

  email: Joi.string()
    .required()
    .email()
    .max(100)
    .lowercase()
    .messages({
      'any.required': 'Email é obrigatório',
      'string.email': 'Email inválido',
      'string.max': 'Email não pode exceder 100 caracteres'
    }),

  senha: Joi.string()
    .required()
    .min(6)
    .max(100)
    .messages({
      'any.required': 'Senha é obrigatória',
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'string.max': 'Senha não pode exceder 100 caracteres'
    }),

  role: Joi.string()
    .optional()
    .valid('user', 'admin')
    .default('user')
    .messages({
      'any.only': 'Role deve ser "user" ou "admin"'
    })
}).unknown(false);

const userLoginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .lowercase()
    .messages({
      'any.required': 'Email é obrigatório',
      'string.email': 'Email inválido'
    }),

  senha: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha é obrigatória'
    })
}).unknown(false);

const userUpdateSchema = userSchema.fork(['senha'], schema => schema.optional());

const passwordResetSchema = Joi.object({
  senhaAtual: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha atual é obrigatória'
    }),

  senhaNova: Joi.string()
    .required()
    .min(6)
    .max(100)
    .not(Joi.ref('senhaAtual'))
    .messages({
      'any.required': 'Nova senha é obrigatória',
      'string.min': 'Nova senha deve ter no mínimo 6 caracteres',
      'any.invalid': 'Nova senha deve ser diferente da atual'
    }),

  senhaConfirmacao: Joi.string()
    .required()
    .valid(Joi.ref('senhaNova'))
    .messages({
      'any.required': 'Confirmação de senha é obrigatória',
      'any.only': 'Senhas não correspondem'
    })
}).unknown(false);

export { userSchema, userLoginSchema, userUpdateSchema, passwordResetSchema };
