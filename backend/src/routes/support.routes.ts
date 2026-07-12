import { Router } from 'express';
import { SupportController } from '../controllers/support.controller.js';
import { asyncHandler } from '../services/auth.service.js';

const router = Router();

router.get(
  '/',
  asyncHandler(SupportController.getResources)
);

router.get(
  '/countries',
  asyncHandler(SupportController.getCountries)
);

router.get(
  '/:id',
  asyncHandler(SupportController.getResource)
);

export default router;
