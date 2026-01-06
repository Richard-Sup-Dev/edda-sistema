// src/routes/servicosRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, servicoSchema } from '../middlewares/validationMiddleware.js';
import servicosController from '../controllers/servicosController.js';

const router = express.Router();

// GET - Listar todos (público)
router.get('/', servicosController.listarServicos);

// GET - Buscar por ID (público)
router.get('/:id', servicosController.buscarServicoPorId);

// POST - Criar novo (apenas admin)
router.post('/', authMiddleware, roleMiddleware('admin'), validarDados(servicoSchema), servicosController.criarServico);

// PUT - Atualizar (apenas admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), validarDados(servicoSchema), servicosController.atualizarServico);

// DELETE - Deletar (apenas admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), servicosController.deletarServico);

export default router;