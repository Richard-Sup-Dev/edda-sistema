// backend/src/routes/health.js
import express from 'express';
const router = express.Router();
import healthController from '../controllers/healthController.js';

/**
 * @swagger
 * /health/ping:
 *   get:
 *     summary: Ping básico
 *     description: Verifica se a API está respondendo (sempre retorna 200)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está respondendo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Tempo de execução em segundos
 */
router.get('/ping', healthController.ping);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe (Kubernetes)
 *     description: Verifica se a aplicação está viva. Se falhar, Kubernetes reinicia o pod.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação está viva
 *       503:
 *         description: Aplicação não está funcionando
 */
router.get('/live', healthController.liveness);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe (Kubernetes)
 *     description: Verifica se a aplicação está pronta para receber tráfego (DB, Redis OK). Se falhar, Kubernetes remove do load balancer.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação pronta para receber tráfego
 *       503:
 *         description: Aplicação não está pronta (dependências falhando)
 */
router.get('/ready', healthController.readiness);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check detalhado
 *     description: Retorna diagnóstico completo com status de todas as dependências
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Sistema saudável ou parcialmente degradado
 *       503:
 *         description: Sistema com falhas críticas
 */
router.get('/', healthController.detailed);

export default router;
