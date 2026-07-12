import { Router } from 'express';
import { TestimonyController, createTestimonySchema, updateTestimonySchema } from '../controllers/testimony.controller.js';
import { authMiddleware, asyncHandler } from '../services/auth.service.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// All testimony routes require authentication
router.use(authMiddleware);

router.post(
  '/',
  validateRequest(createTestimonySchema),
  asyncHandler(TestimonyController.createTestimony)
);

router.get(
  '/',
  asyncHandler(TestimonyController.getUserTestimonies)
);

router.get(
  '/:id',
  asyncHandler(TestimonyController.getTestimony)
);

router.put(
  '/:id',
  validateRequest(updateTestimonySchema),
  asyncHandler(TestimonyController.updateTestimony)
);

router.delete(
  '/:id',
  asyncHandler(TestimonyController.deleteTestimony)
);

export default router;
