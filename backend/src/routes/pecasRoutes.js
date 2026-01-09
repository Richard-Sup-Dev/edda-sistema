// backend/src/routes/pecasRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, pecaSchema } from '../middlewares/validationMiddleware.js';
import pecasController from '../controllers/pecasController.js';
import { invalidateCache, cacheStrategies } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/pecas:
 *   get:
 *     summary: Listar todas as peças
 *     description: Retorna catálogo completo de peças. Cache de 5 minutos.
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de peças
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   codigo:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   preco_unitario:
 *                     type: number
 *                     format: float
 */
router.get('/', authMiddleware, cacheStrategies.medium, pecasController.listarPecas);

/**
 * @swagger
 * /api/pecas/{id}:
 *   get:
 *     summary: Buscar peça por ID
 *     description: Retorna detalhes de uma peça específica. Cache de 30 minutos.
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da peça
 *     responses:
 *       200:
 *         description: Detalhes da peça
 *       404:
 *         description: Peça não encontrada
 */
router.get('/:id', authMiddleware, cacheStrategies.long, pecasController.buscarPecaPorId);

/**
 * @swagger
 * /api/pecas:
 *   post:
 *     summary: Criar nova peça
 *     description: Cadastra uma nova peça no catálogo. Apenas admin.
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - descricao
 *               - preco_unitario
 *             properties:
 *               codigo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco_unitario:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Peça criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão
 */
router.post('/', authMiddleware, roleMiddleware('admin'), invalidateCache('pecas'), validarDados(pecaSchema), pecasController.criarPeca);

/**
 * @swagger
 * /api/pecas/{id}:
 *   put:
 *     summary: Atualizar peça
 *     description: Atualiza dados de uma peça. Apenas admin.
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco_unitario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Peça atualizada
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Peça não encontrada
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), invalidateCache('pecas'), validarDados(pecaSchema), pecasController.atualizarPeca);

/**
 * @swagger
 * /api/pecas/{id}:
 *   delete:
 *     summary: Deletar peça
 *     description: Remove uma peça do catálogo. Apenas admin.
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Peça deletada
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Peça não encontrada
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), invalidateCache('pecas'), pecasController.deletarPeca);

export default router;