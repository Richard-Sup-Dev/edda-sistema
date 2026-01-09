// backend/src/routes/userRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { validarDados, usuarioCreateSchema, usuarioUpdateSchema } from '../middlewares/validationMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// ====================== PROTEÇÃO GLOBAL ======================
// Todas as rotas de usuários exigem estar autenticado e ser administrador
router.use(authMiddleware);
router.use(adminMiddleware);

// ====================== LISTAR TODOS OS USUÁRIOS ======================
router.get('/', userController.list);

// ====================== CRIAR NOVO USUÁRIO ======================
router.post('/', validarDados(usuarioCreateSchema), userController.create);

// ====================== ATUALIZAR USUÁRIO ======================
router.put('/:id', validarDados(usuarioUpdateSchema), userController.update);

// ====================== REDEFINIR SENHA ======================
router.put('/:id/reset-password', userController.resetPassword);

// ====================== DELETAR USUÁRIO ======================
router.delete('/:id', userController.remove); // Use 'remove' se você renomeou como sugeri antes

export default router;