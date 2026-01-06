// src/controllers/pecasController.js

import pecasService from '../services/pecasService.js';

// ==================== LISTAR TODAS AS PEÇAS ====================
async function listarPecas(req, res) {
  try {
    const pecas = await pecasService.listarPecas();
    return res.status(200).json(pecas);
  } catch (error) {
    console.error('Erro ao listar peças:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar peças.' });
  }
}

// ==================== BUSCAR PEÇA POR ID ====================
async function buscarPecaPorId(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID da peça inválido.' });
  }

  try {
    const peca = await pecasService.buscarPecaPorId(Number(id));
    if (!peca) {
      return res.status(404).json({ erro: 'Peça não encontrada.' });
    }
    return res.status(200).json(peca);
  } catch (error) {
    console.error('Erro ao buscar peça por ID:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar peça.' });
  }
}

// ==================== CRIAR NOVA PEÇA ====================
async function criarPeca(req, res) {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ erro: 'Dados da peça são obrigatórios.' });
  }

  try {
    if (!data.codigo_fabrica || data.codigo_fabrica.trim() === '') {
      const novoCodigo = await pecasService.gerarProximoCodigoNumerico();
      data.codigo_fabrica = novoCodigo.toString();
    }

    const id = await pecasService.criarPeca(data);

    return res.status(201).json({
      id,
      mensagem: 'Peça cadastrada com sucesso!',
      codigo_fabrica: data.codigo_fabrica
    });
  } catch (error) {
    console.error('Erro ao criar peça:', error);

    if (error.message.includes('único') || error.message.includes('duplicate')) {
      return res.status(400).json({ erro: 'Código de fábrica já existe.' });
    }

    return res.status(400).json({ erro: error.message || 'Dados inválidos ao cadastrar peça.' });
  }
}

// ==================== ATUALIZAR PEÇA ====================
async function atualizarPeca(req, res) {
  const { id } = req.params;
  const data = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID da peça inválido.' });
  }

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização.' });
  }

  try {
    const rowCount = await pecasService.atualizarPeca(Number(id), data);

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Peça não encontrada.' });
    }

    return res.status(200).json({ mensagem: 'Peça atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar peça:', error);

    if (error.message.includes('único') || error.message.includes('duplicate')) {
      return res.status(400).json({ erro: 'Código de fábrica já está em uso por outra peça.' });
    }

    return res.status(400).json({ erro: error.message || 'Dados inválidos ao atualizar peça.' });
  }
}

// ==================== DELETAR PEÇA ====================
async function deletarPeca(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID da peça inválido.' });
  }

  try {
    const rowCount = await pecasService.deletarPeca(Number(id));

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Peça não encontrada.' });
    }

    return res.status(200).json({ mensagem: 'Peça deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar peça:', error);

    if (error.message.includes('foreign key') || error.message.includes('em uso')) {
      return res.status(409).json({
        erro: 'Não foi possível deletar a peça, pois ela está sendo usada em um ou mais relatórios.'
      });
    }

    return res.status(500).json({ erro: 'Erro interno ao deletar peça.' });
  }
}

export default {
  listarPecas,
  buscarPecaPorId,
  criarPeca,
  atualizarPeca,
  deletarPeca
};