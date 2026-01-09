// src/routes/servicosRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, servicoSchema } from '../middlewares/validationMiddleware.js';
import servicosController from '../controllers/servicosController.js';
import { invalidateCache, cacheStrategies } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/servicos:
 *   get:
 *     summary: Listar todos os serviços
 *     description: Retorna catálogo completo de serviços. Público, cache de 5 minutos.
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços
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
 *                   preco:
 *                     type: number
 *                     format: float
 */
router.get('/', cacheStrategies.medium, servicosController.listarServicos);

/**
 * @swagger
 * /api/servicos/{id}:
 *   get:
 *     summary: Buscar serviço por ID
 *     description: Retorna detalhes de um serviço. Público, cache de 30 minutos.
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Detalhes do serviço
 *       404:
 *         description: Serviço não encontrado
 */
router.get('/:id', cacheStrategies.long, servicosController.buscarServicoPorId);

/**
 * @swagger
 * /api/servicos:
 *   post:
 *     summary: Criar novo serviço
 *     description: Cadastra um novo serviço. Apenas admin.
 *     tags: [Serviços]
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
 *               - preco
 *             properties:
 *               codigo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Serviço criado
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão
 */
router.post('/', authMiddleware, roleMiddleware('admin'), invalidateCache('servicos'), validarDados(servicoSchema), servicosController.criarServico);

/**
 * @swagger
 * /api/servicos/{id}:
 *   put:
 *     summary: Atualizar serviço
 *     description: Atualiza dados de um serviço. Apenas admin.
 *     tags: [Serviços]
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
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Serviço não encontrado
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), invalidateCache('servicos'), validarDados(servicoSchema), servicosController.atualizarServico);

/**
 * @swagger
 * /api/servicos/{id}:
 *   delete:
 *     summary: Deletar serviço
 *     description: Remove um serviço. Apenas admin.
 *     tags: [Serviços]
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
 *         description: Serviço deletado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), invalidateCache('servicos'), servicosController.deletarServico);

export default router;