// backend/src/routes/nfsRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import nfsController from '../controllers/nfsController.js';

const router = express.Router();

// ====================== GERAR NOTA FISCAL ======================
// Rota protegida: apenas usuários autenticados com role 'admin' ou 'emissor' podem gerar NF
router.post(
  '/generate',
  authMiddleware,                           // Primeiro: verifica se está logado
  roleMiddleware('admin', 'emissor'),       // Depois: verifica se tem permissão
  nfsController.generateNF
);

// Rota alternativa em português (compatibilidade)
router.post(
  '/gerar',
  authMiddleware,
  roleMiddleware('admin', 'emissor'),
  nfsController.generateNF
);

export default router;