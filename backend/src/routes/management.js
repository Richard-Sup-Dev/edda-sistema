// backend/src/routes/managementRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

import clientesController from '../controllers/clientesController.js';
import pecasController from '../controllers/pecasController.js';
import servicosController from '../controllers/servicosController.js';

const router = express.Router();

// ====================== CLIENTES ======================
// Listagem e busca: todos os usuários logados podem ver (útil para seleção em relatórios)
router.get('/clientes', authMiddleware, clientesController.listarClientes);
router.get('/clientes/:id', authMiddleware, clientesController.buscarClientePorId);

// Criação e edição: apenas admin
router.post('/clientes', authMiddleware, roleMiddleware('admin'), clientesController.criarCliente);
router.put('/clientes/:id', authMiddleware, roleMiddleware('admin'), clientesController.atualizarCliente);
router.delete('/clientes/:id', authMiddleware, roleMiddleware('admin'), clientesController.excluirCliente); // se existir no controller

// ====================== PEÇAS ======================
router.get('/pecas', authMiddleware, pecasController.listarPecas);

router.post('/pecas', authMiddleware, roleMiddleware('admin'), pecasController.criarPeca);
router.put('/pecas/:id', authMiddleware, roleMiddleware('admin'), pecasController.atualizarPeca);
router.delete('/pecas/:id', authMiddleware, roleMiddleware('admin'), pecasController.deletarPeca);

// ====================== SERVIÇOS ======================
router.get('/servicos', authMiddleware, servicosController.listarServicos);

router.post('/servicos', authMiddleware, roleMiddleware('admin'), servicosController.criarServico);
router.put('/servicos/:id', authMiddleware, roleMiddleware('admin'), servicosController.atualizarServico);
router.delete('/servicos/:id', authMiddleware, roleMiddleware('admin'), servicosController.deletarServico);

export default router;