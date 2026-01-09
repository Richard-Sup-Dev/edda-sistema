import express from 'express';
import * as atividadesController from '../controllers/atividadesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/atividades:
 *   get:
 *     summary: Listar atividades
 *     description: Retorna todas as atividades do sistema (log de ações)
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de atividades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 atividades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       usuario_id:
 *                         type: integer
 *                       tipo:
 *                         type: string
 *                       descricao:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 */
router.get('/', atividadesController.listarAtividades);

/**
 * @swagger
 * /api/atividades/recentes:
 *   get:
 *     summary: Atividades recentes
 *     description: Retorna as atividades mais recentes para exibição no dashboard
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de atividades a retornar
 *     responses:
 *       200:
 *         description: Atividades recentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/recentes', atividadesController.atividadesRecentes);

/**
 * @swagger
 * /api/atividades/estatisticas:
 *   get:
 *     summary: Estatísticas de atividades
 *     description: Retorna estatísticas agregadas sobre as atividades do sistema
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [dia, semana, mes, ano]
 *           default: mes
 *         description: Período para as estatísticas
 *     responses:
 *       200:
 *         description: Estatísticas de atividades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 por_tipo:
 *                   type: object
 *                 por_usuario:
 *                   type: object
 */
router.get('/estatisticas', atividadesController.estatisticas);

export default router;
