import express from 'express';
import * as notificacoesController from '../controllers/notificacoesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/notificacoes:
 *   get:
 *     summary: Listar notificações do usuário
 *     description: Retorna todas as notificações do usuário autenticado
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   mensagem:
 *                     type: string
 *                   tipo:
 *                     type: string
 *                     enum: [info, aviso, erro, sucesso]
 *                   lida:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', notificacoesController.listarNotificacoes);

/**
 * @swagger
 * /api/notificacoes/nao-lidas/count:
 *   get:
 *     summary: Contar notificações não lidas
 *     description: Retorna o número de notificações não lidas do usuário
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem de notificações não lidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */
router.get('/nao-lidas/count', notificacoesController.contarNaoLidas);

/**
 * @swagger
 * /api/notificacoes/marcar-todas-lidas:
 *   put:
 *     summary: Marcar todas como lidas
 *     description: Marca todas as notificações do usuário como lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificações marcadas como lidas
 */
router.put('/marcar-todas-lidas', notificacoesController.marcarTodasComoLidas);

/**
 * @swagger
 * /api/notificacoes/{id}/lida:
 *   put:
 *     summary: Marcar notificação como lida
 *     description: Marca uma notificação específica como lida
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *       404:
 *         description: Notificação não encontrada
 */
router.put('/:id/lida', notificacoesController.marcarComoLida);

/**
 * @swagger
 * /api/notificacoes/{id}:
 *   delete:
 *     summary: Deletar notificação
 *     description: Remove uma notificação específica
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação deletada
 *       404:
 *         description: Notificação não encontrada
 */
router.delete('/:id', notificacoesController.deletarNotificacao);

/**
 * @swagger
 * /api/notificacoes/lidas/limpar:
 *   delete:
 *     summary: Limpar notificações lidas
 *     description: Remove todas as notificações marcadas como lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificações lidas removidas
 */
router.delete('/lidas/limpar', notificacoesController.deletarLidas);

export default router;
