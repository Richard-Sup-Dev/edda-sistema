// src/services/clientesService.js

import clientesRepository from '../repositories/clientesRepository.js';
import Joi from 'joi';

// ==================== ESQUEMA DE VALIDAÇÃO COM MENSAGENS EM PORTUGUÊS ====================
const clienteSchema = Joi.object({
  cnpj: Joi.string()
    .pattern(/^\d{14}$/)
    .required()
    .messages({
      'string.pattern.base': 'O CNPJ deve conter exatamente 14 dígitos numéricos.',
      'any.required': 'O CNPJ é obrigatório.',
      'string.empty': 'O CNPJ não pode estar vazio.'
    }),

  nome_fantasia: Joi.string()
    .max(100)
    .required()
    .messages({
      'any.required': 'O nome fantasia é obrigatório.',
      'string.max': 'O nome fantasia deve ter no máximo 100 caracteres.'
    }),

  razao_social: Joi.string().max(255).allow('').optional(),
  endereco: Joi.string().max(255).allow('').optional(),
  bairro: Joi.string().max(100).allow('').optional(),
  cidade: Joi.string().max(100).allow('').optional(),
  estado: Joi.string().max(2).allow('').optional(),
  cep: Joi.string().max(10).allow('').optional(),
  responsavel_contato: Joi.string().max(100).allow('').optional(),
})
  .unknown(false) // Rejeita campos desconhecidos
  .messages({
    'object.unknown': 'Campo "{{#label}}" não é permitido.'
  });

// ==================== LISTAR CLIENTES ====================
async function listarClientes() {
  return await clientesRepository.listarClientes();
}

// ==================== BUSCAR POR ID ====================
async function buscarClientePorId(id) {
  if (!id || isNaN(id)) {
    throw new Error('ID inválido.');
  }
  return await clientesRepository.buscarClientePorId(Number(id));
}

// ==================== CRIAR CLIENTE ====================
async function criarCliente(clienteData) {
  const { error, value } = clienteSchema.validate(clienteData, { abortEarly: false });

  if (error) {
    const mensagens = error.details.map(detail => detail.message).join('; ');
    throw new Error(mensagens);
  }

  return await clientesRepository.executarTransacao(async (trx) => {
    const existingClient = await clientesRepository.buscarClientePorCnpj(value.cnpj, trx);
    if (existingClient) {
      throw new Error(`CNPJ ${value.cnpj} já cadastrado no sistema.`);
    }

    return await clientesRepository.criarCliente(value, trx);
  });
}

// ==================== ATUALIZAR CLIENTE ====================
async function atualizarCliente(id, clienteData) {
  if (!id || isNaN(id)) {
    throw new Error('ID inválido.');
  }

  // Permite atualização parcial: todos os campos opcionais
  const { error, value } = clienteSchema.validate(clienteData, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true, // Remove campos desconhecidos
    presence: 'optional'
  });

  if (error) {
    const mensagens = error.details.map(detail => detail.message).join('; ');
    throw new Error(mensagens);
  }

  if (Object.keys(value).length === 0) {
    throw new Error('Nenhum dado válido fornecido para atualização.');
  }

  return await clientesRepository.executarTransacao(async (trx) => {
    const rowCount = await clientesRepository.atualizarCliente(Number(id), value, trx);

    if (rowCount === 0) {
      throw new Error('Cliente não encontrado ou nenhum campo alterado.');
    }

    return rowCount;
  });
}

// ==================== BUSCAR OU CRIAR CLIENTE (USADO EM RELATÓRIOS) ====================
async function getOrCreateCliente(relatorioBody) {
  if (!relatorioBody || !relatorioBody.cliente_cnpj) {
    return null;
  }

  const cnpjLimpo = relatorioBody.cliente_cnpj.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14) {
    console.warn(`[CLIENTE-WARN] CNPJ inválido no relatório: ${relatorioBody.cliente_cnpj}`);
    return null;
  }

  try {
    // Busca cliente existente
    let clienteId = await clientesRepository.buscarClientePorCnpj(cnpjLimpo);
    if (clienteId) {
      return clienteId.id;
    }

    // Monta dados mínimos para criação automática
    const newClientData = {
      cnpj: cnpjLimpo,
      nome_fantasia: relatorioBody.cliente_nome?.trim() || `Cliente CNPJ ${cnpjLimpo}`,
      razao_social: relatorioBody.cliente_nome?.trim() || '',
      endereco: relatorioBody.cliente_endereco?.trim() || '',
      bairro: relatorioBody.cliente_bairro?.trim() || '',
      cidade: relatorioBody.cliente_cidade?.trim() || '',
      estado: relatorioBody.cliente_estado?.trim() || '',
      cep: relatorioBody.cliente_cep?.replace(/\D/g, '') || '',
      responsavel_contato: relatorioBody.responsavel?.trim() || ''
    };

    // Valida antes de criar
    const { error, value } = clienteSchema.validate(newClientData, { abortEarly: false });
    if (error) {
      console.warn(`[CLIENTE-WARN] Não foi possível criar cliente automaticamente. CNPJ: ${cnpjLimpo}. Motivo: ${error.details[0].message}`);
      return null;
    }

    // Cria com transação
    clienteId = await clientesRepository.executarTransacao(async (trx) => {
      return await clientesRepository.criarCliente(value, trx);
    });

    console.info(`[CLIENTE-INFO] Cliente criado automaticamente via relatório. CNPJ: ${cnpjLimpo}, ID: ${clienteId}`);
    return clienteId;

  } catch (error) {
    console.error(`[CLIENTE-ERROR] Falha ao buscar/criar cliente (CNPJ: ${cnpjLimpo}):`, error.message);
    return null;
  }
}

// ==================== EXPORT ====================
export default {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  getOrCreateCliente
};