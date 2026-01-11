// backend/src/routes/userRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { validarDados, usuarioCreateSchema, usuarioUpdateSchema } from '../middlewares/validationMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// ====================== PROTEÇÃO GLOBAL ======================
// Todas as rotas de usuários exigem estar autenticado e ser administrador
// Removido uso global de autenticação/admin para permitir validação antes

// ====================== LISTAR TODOS OS USUÁRIOS ======================
router.get('/', authMiddleware, adminMiddleware, userController.list);

// ====================== CRIAR NOVO USUÁRIO ======================
router.post('/', validarDados(usuarioCreateSchema), authMiddleware, adminMiddleware, userController.create);

// ====================== ATUALIZAR USUÁRIO ======================
router.put('/:id', validarDados(usuarioUpdateSchema), authMiddleware, adminMiddleware, userController.update);

// ====================== REDEFINIR SENHA ======================
router.put('/:id/reset-password', userController.resetPassword);
router.put('/:id/reset-password', authMiddleware, adminMiddleware, userController.resetPassword);

// ====================== DELETAR USUÁRIO ======================
router.delete('/:id', userController.remove); // Use 'remove' se você renomeou como sugeri antes
router.delete('/:id', authMiddleware, adminMiddleware, userController.remove); // Use 'remove' se você renomeou como sugeri antes

export default router;