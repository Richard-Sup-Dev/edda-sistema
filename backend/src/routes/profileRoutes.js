// backend/src/routes/profileRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import uploadInstance from '../middlewares/multerMiddleware.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const uploadAvatar = uploadInstance.single('avatar');

// ====================== UPLOAD DE AVATAR ======================
router.post('/avatar', authMiddleware, uploadAvatar, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Atualizar avatar no banco
    await User.update(
      { avatar: avatarUrl },
      { where: { id: req.user.id } }
    );

    return res.status(200).json({ 
      mensagem: 'Avatar atualizado com sucesso',
      avatarUrl 
    });
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    return res.status(500).json({ erro: 'Erro ao fazer upload do avatar' });
  }
});

// ====================== ATUALIZAR PERFIL ======================
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nome, telefone, cargo, departamento } = req.body;
    
    const updateData = {};
    if (nome) updateData.nome = nome;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (cargo !== undefined) updateData.cargo = cargo;
    if (departamento !== undefined) updateData.departamento = departamento;

    await User.update(updateData, { where: { id: req.user.id } });

    const userAtualizado = await User.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] }
    });

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario: userAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

// ====================== OBTER PERFIL ATUAL ======================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
});

export default router;
