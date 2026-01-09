import express from 'express';
import * as notificacoesController from '../controllers/notificacoesController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar notificações do usuário
router.get('/', notificacoesController.listarNotificacoes);

// Contar notificações não lidas
router.get('/nao-lidas/count', notificacoesController.contarNaoLidas);

// Marcar todas como lidas
router.put('/marcar-todas-lidas', notificacoesController.marcarTodasComoLidas);

// Marcar notificação específica como lida
router.put('/:id/lida', notificacoesController.marcarComoLida);

// Deletar notificação específica
router.delete('/:id', notificacoesController.deletarNotificacao);

// Deletar todas as notificações lidas
router.delete('/lidas/limpar', notificacoesController.deletarLidas);

export default router;
