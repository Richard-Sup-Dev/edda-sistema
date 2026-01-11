// src/controllers/servicosController.js

import servicosService from '../services/servicosService.js';
import logger from '../config/logger.js';

// ==================== LISTAR TODOS OS SERVIÇOS ====================
async function listarServicos(req, res) {
  try {
    const servicos = await servicosService.listarServicos();
    return res.status(200).json(servicos);
  } catch (error) {
    logger.error('Erro ao listar serviços', { error });
    return res.status(500).json({ erro: 'Erro interno ao listar serviços.' });
  }
}

// ==================== BUSCAR SERVIÇO POR ID ====================
async function buscarServicoPorId(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID do serviço inválido.' });
  }

  try {
    const servico = await servicosService.buscarServicoPorId(Number(id));
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }
    return res.status(200).json(servico);
  } catch (error) {
    logger.error('Erro ao buscar serviço por ID', { error });
    return res.status(500).json({ erro: 'Erro interno ao buscar serviço.' });
  }
}

// ==================== CRIAR NOVO SERVIÇO ====================
async function criarServico(req, res) {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ erro: 'Dados do serviço são obrigatórios.' });
  }

  try {
    if (!data.codigo_fabrica || data.codigo_fabrica.trim() === '') {
      const novoCodigo = await servicosService.gerarProximoCodigoServico();
      data.codigo_fabrica = novoCodigo;
    }
    const id = await servicosService.criarServico(data);
    return res.status(201).json({
      id,
      mensagem: 'Serviço cadastrado com sucesso!',
      codigo_fabrica: data.codigo_fabrica
    });
  } catch (error) {
    logger.error('Erro ao criar serviço', { error });
    if (error.message.includes('único') || error.message.includes('duplicate') || error.message.includes('já existe')) {
      return res.status(400).json({ erro: 'Código de serviço já existe.' });
    }
    return res.status(400).json({ erro: error.message || 'Dados inválidos ao cadastrar serviço.' });
  }
}

// ==================== ATUALIZAR SERVIÇO ====================
async function atualizarServico(req, res) {
  const { id } = req.params;
  const data = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID do serviço inválido.' });
  }

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização.' });
  }

  try {
    const rowCount = await servicosService.atualizarServico(Number(id), data);
    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Serviço atualizado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao atualizar serviço', { error });
    if (error.message.includes('único') || error.message.includes('duplicate')) {
      return res.status(400).json({ erro: 'Código de serviço já está em uso por outro registro.' });
    }
    return res.status(400).json({ erro: error.message || 'Dados inválidos ao atualizar serviço.' });
  }
}

// ==================== DELETAR SERVIÇO ====================
async function deletarServico(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID do serviço inválido.' });
  }

  try {
    const rowCount = await servicosService.deletarServico(Number(id));
    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Serviço deletado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao deletar serviço', { error });
    if (error.message.includes('foreign key') || error.message.includes('em uso')) {
      return res.status(409).json({
        erro: 'Não foi possível deletar o serviço, pois ele está sendo usado em um ou mais relatórios/orçamentos.'
      });
    }
    return res.status(500).json({ erro: 'Erro interno ao deletar serviço.' });
  }
}

// ==================== EXPORT ====================
export default {
  listarServicos,
  buscarServicoPorId,     
  criarServico,
  atualizarServico,
  deletarServico
};