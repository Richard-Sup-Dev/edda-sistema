// backend/src/routes/userRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validarDados, usuarioCreateSchema, usuarioUpdateSchema } from '../middlewares/validationMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// ====================== PROTEÇÃO GLOBAL ======================
// Todas as rotas de usuários exigem:
// 1. Estar autenticado (authMiddleware)
// 2. Ser administrador (roleMiddleware('admin'))
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

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