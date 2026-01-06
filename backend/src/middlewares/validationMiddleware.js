// backend/src/middlewares/validationMiddleware.js
import Joi from 'joi';

// ============================================
// VALIDADORES COM JOI
// ============================================

// Função auxiliar para validar CNPJ
const validarCNPJ = (cnpj) => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
  
  // Calcula dígito verificador
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    soma += numeros.charAt(tamanho - 1 - i) * (pos + 2);
    if (++pos % 8 === 0) pos = 0;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    soma += numeros.charAt(tamanho - 1 - i) * (pos + 2);
    if (++pos % 8 === 0) pos = 0;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

// Função auxiliar para validar CPF
const validarCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
};

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

// Validação para Clientes
export const clienteSchema = Joi.object({
  cnpj: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!validarCNPJ(value)) {
        return helpers.error('CNPJ inválido');
      }
      return value;
    })
    .messages({
      'any.required': 'CNPJ é obrigatório'
    }),
  nome_fantasia: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome fantasia deve ter no mínimo 3 caracteres',
      'string.max': 'Nome fantasia pode ter no máximo 100 caracteres',
      'any.required': 'Nome fantasia é obrigatório'
    }),
  razao_social: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
  telefone: Joi.string()
    .pattern(/^\d{10,11}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Telefone inválido (use 10 ou 11 dígitos)'
    }),
  endereco: Joi.string()
    .max(200)
    .optional(),
  cidade: Joi.string()
    .max(50)
    .optional(),
  estado: Joi.string()
    .length(2)
    .optional()
    .messages({
      'string.length': 'Estado deve ter 2 caracteres (ex: SP)'
    }),
  cep: Joi.string()
    .pattern(/^\d{5}-?\d{3}$/)
    .optional()
    .messages({
      'string.pattern.base': 'CEP inválido (ex: 12345-678)'
    })
});

// Validação para Relatórios
export const relatorioSchema = Joi.object({
  cliente_id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'ID do cliente é obrigatório'
    }),
  os_numero: Joi.string()
    .required()
    .messages({
      'any.required': 'Número da OS é obrigatório'
    }),
  data_inicio: Joi.date()
    .required()
    .messages({
      'any.required': 'Data de início é obrigatória'
    }),
  data_fim: Joi.date()
    .min(Joi.ref('data_inicio'))
    .required()
    .messages({
      'date.min': 'Data de fim não pode ser anterior à data de início',
      'any.required': 'Data de fim é obrigatória'
    }),
  descricao_servico: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Descrição deve ter no mínimo 10 caracteres',
      'string.max': 'Descrição pode ter no máximo 1000 caracteres',
      'any.required': 'Descrição do serviço é obrigatória'
    }),
  equipe_responsavel: Joi.string()
    .max(100)
    .optional(),
  localizacao: Joi.string()
    .max(200)
    .optional(),
  tempo_total_horas: Joi.number()
    .positive()
    .optional(),
  valor_servico: Joi.number()
    .positive()
    .optional(),
  status: Joi.string()
    .valid('pendente', 'em_progresso', 'concluido', 'cancelado')
    .optional()
    .default('pendente')
});

// Validação para Peças
export const pecaSchema = Joi.object({
  codigo_fabrica: Joi.string()
    .required()
    .messages({
      'any.required': 'Código de fábrica é obrigatório'
    }),
  descricao: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Descrição deve ter no mínimo 3 caracteres',
      'string.max': 'Descrição pode ter no máximo 200 caracteres',
      'any.required': 'Descrição é obrigatória'
    }),
  categoria: Joi.string()
    .max(50)
    .required()
    .messages({
      'any.required': 'Categoria é obrigatória'
    }),
  valor_unitario: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Valor unitário deve ser positivo',
      'any.required': 'Valor unitário é obrigatório'
    }),
  quantidade_minima: Joi.number()
    .integer()
    .positive()
    .optional()
});

// Validação para Serviços
export const servicoSchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter no mínimo 3 caracteres',
      'string.max': 'Nome pode ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  descricao: Joi.string()
    .max(500)
    .optional(),
  valor_padrao: Joi.number()
    .positive()
    .optional(),
  tempo_estimado_horas: Joi.number()
    .positive()
    .optional(),
  categoria: Joi.string()
    .max(50)
    .optional(),
  ativo: Joi.boolean()
    .default(true)
});

// Validação para Usuários (criar)
export const usuarioCreateSchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter no mínimo 3 caracteres',
      'string.max': 'Nome pode ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
  senha: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'string.max': 'Senha pode ter no máximo 50 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
  role: Joi.string()
    .valid('user', 'tecnico', 'admin')
    .default('user')
    .messages({
      'any.only': 'Role deve ser: user, tecnico ou admin'
    })
});

// Validação para Usuários (atualizar)
export const usuarioUpdateSchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email inválido'
    }),
  role: Joi.string()
    .valid('user', 'tecnico', 'admin')
    .optional()
    .messages({
      'any.only': 'Role deve ser: user, tecnico ou admin'
    })
});

// ============================================
// MIDDLEWARE DE VALIDAÇÃO
// ============================================

/**
 * Middleware genérico de validação
 * @param {Joi.Schema} schema - Schema de validação Joi
 */
export const validarDados = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // Remove campos desconhecidos
      convert: true // Converte tipos quando possível
    });

    if (error) {
      const mensagens = error.details.map(err => ({
        campo: err.path.join('.'),
        mensagem: err.message
      }));

      return res.status(400).json({
        erro: 'Erro na validação dos dados',
        detalhes: mensagens
      });
    }

    // Substitui req.body pelos dados validados e sanitizados
    req.body = value;
    next();
  };
};

// ============================================
// VALIDAÇÃO DE PARÂMETROS DE URL
// ============================================

export const validarIDSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const validarID = (req, res, next) => {
  const { error, value } = validarIDSchema.validate({ id: parseInt(req.params.id) });

  if (error) {
    return res.status(400).json({
      erro: 'ID inválido'
    });
  }

  req.params.id = value.id;
  next();
};

export default {
  validarDados,
  validarID,
  clienteSchema,
  relatorioSchema,
  pecaSchema,
  servicoSchema,
  usuarioCreateSchema,
  usuarioUpdateSchema
};
