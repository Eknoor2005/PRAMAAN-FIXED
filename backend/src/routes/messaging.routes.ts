import { Router } from 'express';
import { MessagingController, sendMessageSchema } from '../controllers/messaging.controller.js';
import { authMiddleware, asyncHandler } from '../services/auth.service.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// All messaging routes require authentication
router.use(authMiddleware);

router.post(
  '/send',
  validateRequest(sendMessageSchema),
  asyncHandler(MessagingController.sendMessage)
);

router.get(
  '/conversations',
  asyncHandler(MessagingController.getUserConversations)
);

router.get(
  '/conversations/:conversationId/messages',
  asyncHandler(MessagingController.getConversationMessages)
);

router.get(
  '/unread-count',
  asyncHandler(MessagingController.getUnreadCount)
);

export default router;
