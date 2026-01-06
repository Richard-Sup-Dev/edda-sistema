// backend/src/routes/clientesRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, clienteSchema } from '../middlewares/validationMiddleware.js';
import clientesController from '../controllers/clientesController.js';

const router = express.Router();

// ====================== LISTAR TODOS OS CLIENTES ======================
// Todos os usuários logados podem ver a lista (útil para seleção em relatórios)
router.get('/', authMiddleware, clientesController.listarClientes);

// ====================== CRIAR NOVO CLIENTE ======================
// Apenas admin pode criar clientes manualmente
router.post('/', authMiddleware, roleMiddleware('admin'), validarDados(clienteSchema), clientesController.criarCliente);

// ====================== ATUALIZAR CLIENTE ======================
// Apenas admin pode editar
router.put('/:id', authMiddleware, roleMiddleware('admin'), validarDados(clienteSchema), clientesController.atualizarCliente);

// ====================== EXCLUIR CLIENTE (OPCIONAL) ======================
// Apenas admin — com cuidado, pois clientes podem estar em relatórios/NFs
router.delete('/:id', authMiddleware, roleMiddleware('admin'), clientesController.excluirCliente);

// ====================== BUSCAR CLIENTE POR ID ======================
// Todos logados podem buscar um específico (útil em detalhes de relatório)
router.get('/:id', authMiddleware, clientesController.buscarClientePorId);

export default router;