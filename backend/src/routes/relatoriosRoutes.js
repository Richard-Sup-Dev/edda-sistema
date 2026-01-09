// backend/src/routes/relatoriosRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import uploadInstance from '../middlewares/multerMiddleware.js';
import { validarDados, relatorioSchema } from '../middlewares/validationMiddleware.js';
import relatoriosController from '../controllers/relatoriosController.js';

const router = express.Router();

// Configuração do Multer para uploads (logo + fotos)
const uploadFields = uploadInstance.fields([
  { name: 'cliente_logo', maxCount: 1 },
  { name: 'photos', maxCount: 50 }
]);

// ====================== CRIAR RELATÓRIO ======================
// Rota principal: criação completa com upload, processamento, PDF e meta.json
// Protegida: apenas admin ou técnico pode criar relatórios
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
  uploadFields,
  validarDados(relatorioSchema),
  relatoriosController.criarRelatorio
);

// ====================== BUSCA AVANÇADA ======================
// Todos logados podem buscar (útil para listagem no frontend)
router.get(
  '/search',
  authMiddleware,
  relatoriosController.buscarRelatorios
);

// ====================== METADADOS (meta.json) ======================
// Todos logados podem acessar metadados de um relatório
router.get(
  '/:id/meta',
  authMiddleware,
  relatoriosController.getRelatorioMeta
);

// ====================== DETALHES COMPLETOS ======================
// Todos logados podem ver detalhes completos de um relatório
router.get(
  '/:id/full',
  authMiddleware,
  relatoriosController.buscarDetalhesCompletos
);

// Rota alternativa (compatibilidade)
router.get(
  '/:id/detalhes',
  authMiddleware,
  relatoriosController.buscarDetalhesCompletos
);

// ====================== SALVAR ORÇAMENTO ======================
// Apenas admin ou técnico pode salvar orçamento
router.post(
  '/:id/orcamento',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
  relatoriosController.salvarOrcamento
);

// Rota alternativa PATCH (compatibilidade)
router.patch(
  '/:id/orcamento',
  authMiddleware,
  roleMiddleware('admin', 'tecnico'),
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