// backend/src/routes/pecasRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, pecaSchema } from '../middlewares/validationMiddleware.js';
import pecasController from '../controllers/pecasController.js';

const router = express.Router();

// Listar todas as peças (todos os usuários logados podem ver)
router.get('/', authMiddleware, pecasController.listarPecas);

// Buscar peça por ID (todos logados)
router.get('/:id', authMiddleware, pecasController.buscarPecaPorId);

// Criar nova peça (apenas admin)
router.post('/', authMiddleware, roleMiddleware('admin'), validarDados(pecaSchema), pecasController.criarPeca);

// Atualizar peça (apenas admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), validarDados(pecaSchema), pecasController.atualizarPeca);

// Deletar peça (apenas admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), pecasController.deletarPeca);

export default router;