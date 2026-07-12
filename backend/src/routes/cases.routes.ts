import { Router } from 'express';
import { CaseController, createCaseSchema, updateCaseSchema } from '../controllers/cases.controller.js';
import { authMiddleware, asyncHandler } from '../services/auth.service.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// All case routes require authentication
router.use(authMiddleware);

router.post(
  '/',
  validateRequest(createCaseSchema),
  asyncHandler(CaseController.createCase)
);

router.get(
  '/',
  asyncHandler(CaseController.getUserCases)
);

router.get(
  '/:id',
  asyncHandler(CaseController.getCase)
);

router.put(
  '/:id',
  validateRequest(updateCaseSchema),
  asyncHandler(CaseController.updateCase)
);

router.delete(
  '/:id',
  asyncHandler(CaseController.deleteCase)
);

export default router;
