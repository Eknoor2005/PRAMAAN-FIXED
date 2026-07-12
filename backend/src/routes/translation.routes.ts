import { Router } from 'express';
import { translateText, detectLanguage } from '../controllers/translation.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Translate text
router.post('/translate', authMiddleware, validateRequest({
  text: 'string',
  targetLanguage: 'string',
  sourceLanguage: 'string?'
}), translateText);

// Detect language
router.post('/detect', authMiddleware, validateRequest({
  text: 'string'
}), detectLanguage);

export default router;
