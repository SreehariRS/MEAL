import { Router } from 'express';
import {
  createUser,
  createUserValidators,
  deleteUser,
  deleteUserValidators,
  getUser,
  getUserValidators,
  listUsers,
  updateUser,
  updateUserValidators,
} from '../controllers/user.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', listUsers);
router.post('/', requireAdmin, createUserValidators, createUser);
router.get('/:id', getUserValidators, getUser);
router.put('/:id', requireAdmin, updateUserValidators, updateUser);
router.delete('/:id', requireAdmin, deleteUserValidators, deleteUser);

export default router;


