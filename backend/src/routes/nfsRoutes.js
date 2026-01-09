// backend/src/routes/nfsRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import nfsController from '../controllers/nfsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/nfs/generate:
 *   post:
 *     summary: Gerar Nota Fiscal
 *     description: Gera uma nota fiscal eletrônica. Requer autenticação e role admin/emissor.
 *     tags: [Notas Fiscais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - valor
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 description: ID do cliente
 *               valor:
 *                 type: number
 *                 format: float
 *                 description: Valor da nota fiscal
 *               descricao:
 *                 type: string
 *                 description: Descrição dos serviços/produtos
 *     responses:
 *       201:
 *         description: Nota fiscal gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 nf:
 *                   type: object
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão para gerar NF
 *       500:
 *         description: Erro ao gerar nota fiscal
 */
router.post(
  '/generate',
  authMiddleware,
  roleMiddleware('admin', 'emissor'),
  nfsController.generateNF
);

/**
 * @swagger
 * /api/nfs/gerar:
 *   post:
 *     summary: Gerar Nota Fiscal (PT-BR)
 *     description: Endpoint alternativo em português para gerar nota fiscal
 *     tags: [Notas Fiscais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - valor
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               valor:
 *                 type: number
 *                 format: float
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nota fiscal gerada com sucesso
 *       403:
 *         description: Sem permissão
 */
router.post(
  '/gerar',
  authMiddleware,
  roleMiddleware('admin', 'emissor'),
  nfsController.generateNF
);

export default router;