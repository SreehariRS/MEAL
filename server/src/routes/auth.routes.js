import { Router } from 'express';
import { login, loginValidators, me, register, registerValidators } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginValidators, login);
router.post('/register', registerValidators, register);
router.get('/me', requireAuth, me);

export default router;


