// backend/src/routes/clientesRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, clienteSchema } from '../middlewares/validationMiddleware.js';
import clientesController from '../controllers/clientesController.js';
import { cache, invalidateCache, cacheStrategies } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// ====================== LISTAR TODOS OS CLIENTES ======================
// Todos os usuários logados podem ver a lista (útil para seleção em relatórios)
// Cache médio (5 min) - dados moderadamente estáveis
router.get('/', authMiddleware, cacheStrategies.medium, clientesController.listarClientes);

// ====================== CRIAR NOVO CLIENTE ======================
// Apenas admin pode criar clientes manualmente
// Invalida cache após criação
router.post('/', authMiddleware, roleMiddleware('admin'), validarDados(clienteSchema), invalidateCache('clientes'), clientesController.criarCliente);

// ====================== ATUALIZAR CLIENTE ======================
// Apenas admin pode editar
// Invalida cache após atualização
router.put('/:id', validarDados(clienteSchema), authMiddleware, roleMiddleware('admin'), invalidateCache('clientes'), clientesController.atualizarCliente);

// ====================== EXCLUIR CLIENTE (OPCIONAL) ======================
// Apenas admin — com cuidado, pois clientes podem estar em relatórios/NFs
// Invalida cache após exclusão
router.delete('/:id', authMiddleware, roleMiddleware('admin'), invalidateCache('clientes'), clientesController.excluirCliente);

// ====================== BUSCAR CLIENTE POR ID ======================
// Todos logados podem buscar um específico (útil em detalhes de relatório)
// Cache longo (30 min) - dados de clientes individuais mudam raramente
router.get('/:id', authMiddleware, cacheStrategies.long, clientesController.buscarClientePorId);

export default router;