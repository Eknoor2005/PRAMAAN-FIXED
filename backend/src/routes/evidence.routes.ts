import { Router } from 'express';
import { EvidenceController, uploadEvidenceSchema } from '../controllers/evidence.controller.js';
import { authMiddleware, asyncHandler } from '../services/auth.service.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// All evidence routes require authentication
router.use(authMiddleware);

router.post(
  '/',
  validateRequest(uploadEvidenceSchema),
  asyncHandler(EvidenceController.uploadEvidence)
);

router.get(
  '/',
  asyncHandler(EvidenceController.getUserEvidence)
);

router.get(
  '/:id',
  asyncHandler(EvidenceController.getEvidence)
);

router.delete(
  '/:id',
  asyncHandler(EvidenceController.deleteEvidence)
);

export default router;
