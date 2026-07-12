import { Router } from 'express';
import { AuthController, signupSchema, loginSchema } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validation.js';
import { authMiddleware, asyncHandler } from '../services/auth.service.js';

const router = Router();

router.post(
  '/signup',
  validateRequest(signupSchema),
  asyncHandler(AuthController.signup)
);

router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(AuthController.login)
);

router.post(
  '/refresh',
  asyncHandler(AuthController.refreshToken)
);

router.get(
  '/me',
  authMiddleware,
  asyncHandler(AuthController.getCurrentUser)
);

export default router;
