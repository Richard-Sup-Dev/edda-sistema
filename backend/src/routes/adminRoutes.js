// src/routes/adminRoutes.js

import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'; // Primeiro: verifica login
import { adminMiddleware } from '../middlewares/roleMiddleware.js'; // Depois: verifica se é admin
import User from '../models/User.js';

const router = Router();

// ====================== LISTAR TODOS OS USUÁRIOS ======================
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['senha'] }, // Nunca retorna a senha hash
      order: [['nome', 'ASC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários (admin):', error);
    return res.status(500).json({ erro: 'Erro interno ao listar usuários.' });
  }
});

// ====================== ALTERAR ROLE DE USUÁRIO ======================
router.patch('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID de usuário inválido.' });
  }

  if (!role || !['user', 'admin', 'tecnico', 'emissor'].includes(role)) {
    return res.status(400).json({ erro: 'Role inválida. Valores permitidos: user, admin, tecnico, emissor.' });
  }

  try {
    const [rowCount] = await User.update(
      { role },
      { where: { id: Number(id) } }
    );

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ mensagem: 'Role atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar role (admin):', error);
    return res.status(500).json({ erro: 'Erro interno ao atualizar role.' });
  }
});

// ====================== DELETAR USUÁRIO ======================
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: 'ID de usuário inválido.' });
  }

  // Impede que o admin delete a própria conta (segurança extra)
  if (Number(id) === req.user.id) {
    return res.status(403).json({ erro: 'Você não pode deletar sua própria conta.' });
  }

  try {
    const rowCount = await User.destroy({ where: { id: Number(id) } });

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ mensagem: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário (admin):', error);

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        erro: 'Não é possível deletar o usuário porque ele está associado a relatórios, NFs ou outros registros.'
      });
    }

    return res.status(500).json({ erro: 'Erro interno ao deletar usuário.' });
  }
});

// ====================== OUTRAS ROTAS ADMIN (EXEMPLOS) ======================
// Aqui você pode adicionar mais rotas exclusivas do admin, como:
// - Estatísticas do sistema
// - Logs de auditoria
// - Configurações globais
// - Backup/restore (futuro)

// Exemplo:
// router.get('/stats', authMiddleware, adminMiddleware, dashboardController.getStats);

export default router;