// src/controllers/clientesController.js
import clientesService from '../services/clientesService.js';

// ==================== LISTAR TODOS OS CLIENTES ====================
async function listarClientes(req, res) {
  try {
    const clientes = await clientesService.listarClientes();
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar clientes.' });
  }
}

// ==================== BUSCAR CLIENTE POR ID ====================
async function buscarClientePorId(req, res) {
  const { id } = req.params;

  // Validação básica do ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  try {
    const cliente = await clientesService.buscarClientePorId(Number(id));
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente por ID:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar cliente.' });
  }
}

// ==================== CRIAR NOVO CLIENTE ====================
async function criarCliente(req, res) {
  const clienteData = req.body;

  // Validação mínima de entrada
  if (!clienteData || Object.keys(clienteData).length === 0) {
    return res.status(400).json({ erro: 'Dados do cliente são obrigatórios.' });
  }

  try {
    const id = await clientesService.criarCliente(clienteData);
    return res.status(201).json({
      id,
      mensagem: 'Cliente criado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);

    // Erros conhecidos (validação, duplicidade, etc.) retornam 400
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'ValidationError') {
      return res.status(400).json({ erro: error.message || 'Dados inválidos ou já existentes (ex: CNPJ duplicado).' });
    }

    // Outros erros inesperados
    return res.status(500).json({ erro: 'Erro interno ao criar cliente.' });
  }
}

// ==================== ATUALIZAR CLIENTE ====================
async function atualizarCliente(req, res) {
  const { id } = req.params;
  const clienteData = req.body;

  // Validação básica
  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  if (!clienteData || Object.keys(clienteData).length === 0) {
    return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização.' });
  }

  try {
    const rowCount = await clientesService.atualizarCliente(Number(id), clienteData);

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    return res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);

    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'ValidationError') {
      return res.status(400).json({ erro: error.message || 'Dados inválidos ou já existentes (ex: CNPJ duplicado).' });
    }

    return res.status(500).json({ erro: 'Erro interno ao atualizar cliente.' });
  }
}

// ==================== EXCLUIR CLIENTE (OPCIONAL - ADICIONADO COMO BÔNUS) ====================
async function excluirCliente(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  try {
    const rowCount = await clientesService.excluirCliente(Number(id));

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    return res.status(200).json({ mensagem: 'Cliente excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return res.status(500).json({ erro: 'Erro interno ao excluir cliente.' });
  }
}

export default {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  excluirCliente 
};