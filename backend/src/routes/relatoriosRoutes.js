// backend/src/routes/relatoriosRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import uploadInstance from '../middlewares/multerMiddleware.js';
import { validarDados, relatorioSchema } from '../middlewares/validationMiddleware.js';
import relatoriosController from '../controllers/relatoriosController.js';
import { cache, invalidateCache, cacheStrategies } from '../middlewares/cacheMiddleware.js';

const router = express.Router();

// Configuração do Multer para uploads (logo + fotos)
const uploadFields = uploadInstance.fields([
  { name: 'cliente_logo', maxCount: 1 },
  { name: 'photos', maxCount: 50 }
]);

// ====================== CRIAR RELATÓRIO ======================
// Rota principal: criação completa com upload, processamento, PDF e meta.json
// Protegida: apenas admin ou técnico pode criar relatórios
// Invalida cache de relatórios após criação
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
  validarDados(relatorioSchema),
  uploadFields,
  invalidateCache('relatorios'),
  relatoriosController.criarRelatorio
);

// ====================== LISTAR RELATÓRIOS ======================
// Rota para listar todos os relatórios (GET /api/relatorios)
// Cache curto (1 min) - dados mudam frequentemente
router.get(
  '/',
  authMiddleware,
  cacheStrategies.short,
  relatoriosController.buscarRelatorios
);

// ====================== BUSCA AVANÇADA ======================
// Todos logados podem buscar (útil para listagem no frontend)
// Cache curto (1 min) - resultados de busca mudam frequentemente
router.get(
  '/search',
  authMiddleware,
  cacheStrategies.short,
  relatoriosController.buscarRelatorios
);

// ====================== METADADOS (meta.json) ======================
// Todos logados podem acessar metadados de um relatório
// Cache médio (5 min) - metadados mudam pouco
router.get(
  '/:id/meta',
  authMiddleware,
  cacheStrategies.medium,
  relatoriosController.getRelatorioMeta
);

// ====================== DETALHES COMPLETOS ======================
// Todos logados podem ver detalhes completos de um relatório
// Cache médio (5 min) - detalhes mudam pouco
router.get(
  '/:id/full',
  authMiddleware,
  cacheStrategies.medium,
  relatoriosController.buscarDetalhesCompletos
);

// Rota alternativa (compatibilidade)
router.get(
  '/:id/detalhes',
  authMiddleware,
  cacheStrategies.medium,
  relatoriosController.buscarDetalhesCompletos
);

// ====================== SALVAR ORÇAMENTO ======================
// Apenas admin ou técnico pode salvar orçamento
// Invalida cache após salvar orçamento
router.post(
  '/:id/orcamento',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
  invalidateCache('relatorios'),
  relatoriosController.salvarOrcamento
);

// Rota alternativa PATCH (compatibilidade)
router.patch(
  '/:id/orcamento',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
  invalidateCache('relatorios'),
  relatoriosController.salvarOrcamento
);

// ====================== ROTAS LEGADAS (DESATIVADAS) ======================
// Mantidas apenas para evitar 404 em clientes antigos, mas retornam erro claro
router.post('/upload-fotos', (req, res) => {
  return res.status(410).json({ erro: 'Rota desativada. Use POST /api/relatorios para criar relatório completo.' });
});

router.get('/link/:id', (req, res) => {
  return res.status(410).json({ erro: 'Rota desativada. Use GET /api/relatorios/:id/meta.' });
});

router.get('/pdf/:id', (req, res) => {
  return res.status(410).json({ erro: 'Rota desativada. PDF é gerado automaticamente na criação.' });
});

export default router;