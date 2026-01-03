import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/profile - Get current user profile
router.get('/profile', authController.getProfile);

// POST /api/auth/demo - Demo login
router.post('/demo', authController.demoLogin);

export default router;