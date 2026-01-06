// backend/src/routes/authRoutes.js — A ROTA QUE FALTAVA PRA SEMPRE!!!
import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

// ROTAS PÚBLICAS (não precisam de token)
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// ROTA PROTEGIDA 
router.get('/me', authMiddleware, authController.me);

export default router;