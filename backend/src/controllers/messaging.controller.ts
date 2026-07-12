import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { MessageModel } from '../models/Message.js';
import { ConversationModel } from '../models/Conversation.js';
import { EncryptionService } from '../services/encryption.service.js';
import Joi from 'joi';

const sendMessageSchema = Joi.object({
  conversationId: Joi.string().required(),
  receiverId: Joi.string().required(),
  content: Joi.string().required(),
});

export class MessagingController {
  /**
   * Send message
   */
  static async sendMessage(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const { conversationId, receiverId, content } = req.body;

      // Get or create conversation
      let conversation = await ConversationModel.findById(conversationId);

      if (!conversation) {
        conversation = new ConversationModel({
          participants: [req.user.userId, receiverId],
        });
        await conversation.save();
      }

      // Encrypt message content
      const encryptedContent = EncryptionService.encryptData(content, receiverId);

      const message = new MessageModel({
        conversationId: conversation._id.toString(),
        senderId: req.user.userId,
        receiverId,
        content: encryptedContent,
        isEncrypted: true,
      });

      await message.save();

      // Update conversation last message
      conversation.lastMessage = {
        content: content.substring(0, 50),
        senderId: req.user.userId,
        timestamp: new Date(),
      };
      await conversation.save();

      res.status(201).json({
        success: true,
        data: {
          messageId: message._id,
          conversationId: conversation._id,
          sentAt: message.createdAt,
        },
        statusCode: 201,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }

  /**
   * Get conversation messages
   */
  static async getConversationMessages(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const { conversationId } = req.params;
      const { limit = 50, skip = 0 } = req.query;

      const conversation = await ConversationModel.findById(conversationId);

      if (!conversation) {
        res.status(404).json({
          success: false,
          error: 'Conversation not found',
          statusCode: 404,
        });
        return;
      }

      // Check if user is participant
      if (!conversation.participants.includes(req.user.userId)) {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
          statusCode: 403,
        });
        return;
      }

      const messages = await MessageModel.find({
        conversationId,
      })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit as string))
        .skip(parseInt(skip as string));

      // Mark as read
      await MessageModel.updateMany(
        {
          conversationId,
          receiverId: req.user.userId,
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );

      res.json({
        success: true,
        data: messages,
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }

  /**
   * Get user conversations
   */
  static async getUserConversations(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const conversations = await ConversationModel.find({
        participants: req.user.userId,
      }).sort({ updatedAt: -1 });

      res.json({
        success: true,
        data: conversations,
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
          statusCode: 401,
        });
        return;
      }

      const unreadCount = await MessageModel.countDocuments({
        receiverId: req.user.userId,
        isRead: false,
      });

      res.json({
        success: true,
        data: { unreadCount },
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      });
    }
  }
}

export { sendMessageSchema };
