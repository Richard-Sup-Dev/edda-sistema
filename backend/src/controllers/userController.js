// backend/controllers/userController.js

import bcrypt from 'bcryptjs'; // Recomendo bcryptjs (mais compatível)
import User from '../models/User.js';
import logger from '../config/logger.js';

// ==================== LISTAR TODOS OS USUÁRIOS ====================
async function list(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'email', 'role', 'criado_em'],
      order: [['nome', 'ASC']]
    });
    return res.status(200).json(users);
  } catch (error) {
    logger.error('Erro ao listar usuários', { error });
    return res.status(500).json({ erro: 'Erro interno ao listar usuários.' });
  }
}

// ==================== CRIAR NOVO USUÁRIO ====================
async function create(req, res) {
  const { nome, email, senha, role = 'user' } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres.' });
  }

  try {
    const hash = await bcrypt.hash(senha, 12);
    const novoUsuario = await User.create({
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha: hash,
      role
    });
    const usuarioResposta = {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role
    };
    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso!',
      usuario: usuarioResposta
    });
  } catch (error) {
    logger.error('Erro ao criar usuário', { error });
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ erro: 'Este email já está cadastrado.' });
    }
    return res.status(500).json({ erro: 'Erro interno ao criar usuário.' });
  }
}

// ==================== ATUALIZAR USUÁRIO ====================
async function update(req, res) {
  const { id } = req.params;
  const { nome, email, role } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  if (!nome && !email && !role) {
    return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização.' });
  }

  try {
    const usuario = await User.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    if (role && role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ erro: 'Apenas administradores podem promover usuários a admin.' });
    }
    await usuario.update({
      nome: nome?.trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      role
    });
    return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    logger.error('Erro ao atualizar usuário', { error });
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ erro: 'Este email já está em uso por outro usuário.' });
    }
    return res.status(500).json({ erro: 'Erro interno ao atualizar usuário.' });
  }
}

// ==================== REDEFINIR SENHA (ADMIN) ====================
async function resetPassword(req, res) {
  const { id } = req.params;
  const { senha } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  if (!senha || senha.length < 6) {
    return res.status(400).json({ erro: 'A nova senha deve ter no mínimo 6 caracteres.' });
  }

  try {
    const usuario = await User.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const hash = await bcrypt.hash(senha, 12);
    await usuario.update({ senha: hash });
    return res.status(200).json({ mensagem: 'Senha redefinida com sucesso.' });
  } catch (error) {
    logger.error('Erro ao redefinir senha', { error });
    return res.status(500).json({ erro: 'Erro interno ao redefinir senha.' });
  }
}

// ==================== DELETAR USUÁRIO ====================
async function remove(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  // Impede auto-deleção ou deleção do admin principal (opcional, mas recomendado)
  if (Number(id) === req.user.id) {
    return res.status(403).json({ erro: 'Você não pode deletar sua própria conta.' });
  }

  try {
    const usuario = await User.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    await usuario.destroy();
    return res.status(200).json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (error) {
    logger.error('Erro ao remover usuário', { error });
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ erro: 'Não é possível remover o usuário porque ele está associado a relatórios ou NFs.' });
    }
    return res.status(500).json({ erro: 'Erro interno ao remover usuário.' });
  }
}

export default {
  list,
  create,
  update,
  resetPassword,
  remove
};