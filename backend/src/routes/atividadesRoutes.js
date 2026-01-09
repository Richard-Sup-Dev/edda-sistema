import express from 'express';
import * as atividadesController from '../controllers/atividadesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar atividades
router.get('/', atividadesController.listarAtividades);

// Atividades recentes (para dashboard)
router.get('/recentes', atividadesController.atividadesRecentes);

// Estatísticas de atividades
router.get('/estatisticas', atividadesController.estatisticas);

export default router;
