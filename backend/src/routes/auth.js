// backend/src/routes/authRoutes.js

import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

// ============================================
// ROTAS PÚBLICAS (não precisam de autenticação)
// ============================================

// Registro de novo usuário (público)
router.post('/register', authController.register);

// Login (público)
router.post('/login', authController.login);

// Solicitar recuperação de senha (envia email com token) - público
router.post('/forgot-password', authController.forgotPassword);


// Redefinir senha usando token do email - público
router.post('/reset-password/:token', authController.resetPassword);

// ==================== REFRESH TOKEN (público, mas seguro via cookie) ====================
router.post('/refresh-token', authController.refreshToken);

// ============================================
// ROTAS PROTEGIDAS (precisam de autenticação)
// ============================================

// Verificar dados do usuário logado
router.get('/me', authMiddleware, authController.me);

// Alterar senha do usuário logado
router.put('/change-password', authMiddleware, authController.changePassword);

// ============================================
// ROTAS RESTRITAS APENAS PARA ADMIN
// ============================================

// Criar o primeiro administrador (ou novos admins)
// Protegido: só admin autenticado pode usar
router.post(
  '/criar-admin',
  authMiddleware,
  roleMiddleware('admin'),
  authController.criarAdmin
);

export default router;