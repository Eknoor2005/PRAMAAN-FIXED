import mongoose from 'mongoose';
import { Message } from '../types/index.js';

const messageSchema = new mongoose.Schema<Message>(
  {
    conversationId: {
      type: String,
      required: true,
      ref: 'Conversation',
    },
    senderId: {
      type: String,
      required: true,
      ref: 'User',
    },
    receiverId: {
      type: String,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    attachments: [
      {
        url: String,
        type: String,
        name: String,
      },
    ],
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<Message>('Message', messageSchema);
