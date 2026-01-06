// src/validations/relatorioValidation.js - VERSÃO FINAL E ROBUSTA

import Joi from 'joi';

// Função de validação para tentar parsear uma string JSON
const isJsonString = (value, helpers) => {
    // Se não for uma string (ou for null/undefined), retorna o valor para as próximas validações
    if (!value || typeof value !== 'string') return value;
    
    // Tenta fazer o parse da string
    try { 
        const parsed = JSON.parse(value); 
        // Se o parse for bem-sucedido, retorna o objeto/array parseado para o Joi validar o tipo
        return parsed; 
    }
    catch (e) { 
        // Se falhar o parse, retorna erro
        return helpers.error('json.invalid', { message: 'O campo deve ser um JSON válido ou um array/objeto' }); 
    }
};

// Schema Joi
const relatorioSchema = Joi.object({
    os_numero: Joi.string().required(),
    numero_rte: Joi.string().allow('').optional(),
    titulo_relatorio: Joi.string().allow('').optional(),
    responsavel: Joi.string().allow('').optional(),
    tipo_relatorio: Joi.string().allow('').optional(),
    art: Joi.string().allow('').optional(),
    descricao: Joi.string().allow('').optional(),
    data_inicio_servico: Joi.string().allow('').optional(),
    data_fim_servico: Joi.string().allow('').optional(),
    data_emissao: Joi.string().allow('').optional(),
    cliente_nome: Joi.string().allow('').optional(),
    cliente_cnpj: Joi.string().allow('').optional(),
    cliente_endereco: Joi.string().allow('').optional(),
    cliente_bairro: Joi.string().allow('').optional(),
    cliente_cidade: Joi.string().allow('').optional(),
    cliente_estado: Joi.string().allow('').optional(),
    cliente_cep: Joi.string().allow('').optional(),
    cliente_logo: Joi.string().allow('').optional(),
    objetivo: Joi.string().allow('').optional(),
    causas_danos: Joi.string().allow('').optional(),
    conclusao: Joi.string().allow('').optional(),
    elaborado_por: Joi.string().allow('').optional(),
    checado_por: Joi.string().allow('').optional(),
    aprovado_por: Joi.string().allow('').optional(),

    // Array ou String parseada, permitindo vazio e default.
    fotosComCaminho: Joi.alternatives().try(
        Joi.array().items(
            Joi.object({
                legenda: Joi.string().allow('').optional(),
                secao: Joi.string().allow('').optional(),
                caminho_foto: Joi.string().required()
            }).rename('section', 'secao') 
        ),
        // Se vier como string (multipart/form-data), tenta o parse antes de validar
        Joi.string().custom(isJsonString) 
    )
    .optional() 
    .allow('') 
    .default([]), 
    
    // --- Campos de medições (ajustado o custom para usar a função parseada) ---
    medicoesIsolamento: Joi.alternatives().try(Joi.array(), Joi.string().custom(isJsonString)).optional().allow(''),
    medicoesBatimento: Joi.alternatives().try(Joi.array(), Joi.string().custom(isJsonString)).optional().allow(''),
    pecasAtuais: Joi.alternatives().try(Joi.array(), Joi.string().custom(isJsonString)).optional().allow(''),
})
.unknown(true);

export default relatorioSchema;