// src/services/servicosService.js

import servicosRepository from '../repositories/servicosRepository.js';
import Joi from 'joi';

const servicoSchema = Joi.object({
    nome_servico: Joi.string().max(255).required(),
    descricao: Joi.string().allow('').optional(),
    valor_unitario: Joi.number().precision(2).min(0).default(0.00).required(),
}).unknown(false);


async function listarServicos() {
    return servicosRepository.listarServicos();
}

async function criarServico(servicoData) {
    const { error, value } = servicoSchema.validate(servicoData);
    if (error) {
        throw new Error(error.details[0].message);
    }

    return servicosRepository.executarTransacao(async (client) => {
        return servicosRepository.criarServico(value, client);
    });
}

async function atualizarServico(id, servicoData) {
    const { error, value } = servicoSchema.validate(servicoData, {
        stripUnknown: true, 
        presence: 'optional'
    });
    if (error) {
        throw new Error(error.details.map(d => d.message).join(', '));
    }

    return servicosRepository.executarTransacao(async (client) => {
        return servicosRepository.atualizarServico(id, value, client);
    });
}

async function deletarServico(id) {
    return servicosRepository.executarTransacao(async (client) => {
        return servicosRepository.deletarServico(id, client);
    });
}


export default {
    listarServicos,
    criarServico,
    atualizarServico,
    deletarServico
};