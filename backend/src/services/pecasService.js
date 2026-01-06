// src/services/pecasService.js

import pecasRepository from '../repositories/pecasRepository.js';
import Joi from 'joi';

// ==================== ESQUEMA DE VALIDAÇÃO ====================
const pecaSchema = Joi.object({
  nome_peca: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'any.required': 'O nome da peça é obrigatório.',
      'string.empty': 'O nome da peça não pode estar vazio.',
      'string.max': 'O nome da peça deve ter no máximo 255 caracteres.'
    }),

  codigo_fabrica: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'O código de fábrica deve ter no máximo 100 caracteres.'
    }),

  valor_custo: Joi.number()
    .precision(2)
    .min(0)
    .default(0.00)
    .messages({
      'number.min': 'O valor de custo não pode ser negativo.',
      'number.precision': 'O valor de custo deve ter no máximo 2 casas decimais.'
    }),

  valor_venda: Joi.number()
    .precision(2)
    .min(0)
    .default(0.00)
    .messages({
      'number.min': 'O valor de venda não pode ser negativo.',
      'number.precision': 'O valor de venda deve ter no máximo 2 casas decimais.'
    }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'O campo "{{#label}}" não é permitido.'
  });

// ==================== LISTAR PEÇAS ====================
async function listarPecas() {
  return await pecasRepository.listarPecas();
}

// ==================== GERAR PRÓXIMO CÓDIGO NUMÉRICO AUTOMÁTICO ====================
async function gerarProximoCodigoNumerico() {
  const result = await pecasRepository.buscarUltimoCodigoNumerico();

  let novoCodigo = 1001; // Valor inicial padrão

  if (result && result.codigo_fabrica) {
    const ultimo = parseInt(result.codigo_fabrica, 10);
    if (!isNaN(ultimo)) {
      novoCodigo = ultimo + 1;
    }
  }

  return novoCodigo;
}

// ==================== CRIAR PEÇA ====================
async function criarPeca(pecaData) {
  // Validação completa
  const { error, value } = pecaSchema.validate(pecaData, { abortEarly: false });
  if (error) {
    const mensagens = error.details.map(d => d.message).join('; ');
    throw new Error(mensagens);
  }

  return await pecasRepository.executarTransacao(async (trx) => {
    // Se código_fabrica não foi informado ou está vazio → gera automático
    if (!value.codigo_fabrica || value.codigo_fabrica.trim() === '') {
      const novoCodigo = await gerarProximoCodigoNumerico();
      value.codigo_fabrica = novoCodigo.toString();
    }

    // Verifica duplicidade de código_fabrica (caso tenha sido informado manualmente)
    const existente = await pecasRepository.buscarPorCodigoFabrica(value.codigo_fabrica, trx);
    if (existente) {
      throw new Error(`Código de fábrica "${value.codigo_fabrica}" já está em uso por outra peça.`);
    }

    return await pecasRepository.criarPeca(value, trx);
  });
}

// ==================== ATUALIZAR PEÇA ====================
async function atualizarPeca(id, pecaData) {
  if (!id || isNaN(id)) {
    throw new Error('ID da peça inválido.');
  }

  // Validação parcial (todos os campos opcionais)
  const { error, value } = pecaSchema.validate(pecaData, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
    presence: 'optional'
  });

  if (error) {
    const mensagens = error.details.map(d => d.message).join('; ');
    throw new Error(mensagens);
  }

  if (Object.keys(value).length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  return await pecasRepository.executarTransacao(async (trx) => {
    // Se tentar alterar o código_fabrica, verifica duplicidade
    if (value.codigo_fabrica !== undefined) {
      const existente = await pecasRepository.buscarPorCodigoFabrica(value.codigo_fabrica, trx);
      if (existente && existente.id !== Number(id)) {
        throw new Error(`Código de fábrica "${value.codigo_fabrica}" já está em uso por outra peça.`);
      }
    }

    const rowCount = await pecasRepository.atualizarPeca(Number(id), value, trx);

    if (rowCount === 0) {
      throw new Error('Peça não encontrada ou nenhum campo foi alterado.');
    }

    return rowCount;
  });
}

// ==================== DELETAR PEÇA ====================
async function deletarPeca(id) {
  if (!id || isNaN(id)) {
    throw new Error('ID da peça inválido.');
  }

  return await pecasRepository.executarTransacao(async (trx) => {
    const rowCount = await pecasRepository.deletarPeca(Number(id), trx);

    if (rowCount === 0) {
      throw new Error('Peça não encontrada.');
    }

    return rowCount;
  });
}

export default {
  listarPecas,
  criarPeca,
  atualizarPeca,
  deletarPeca,
  gerarProximoCodigoNumerico 
};