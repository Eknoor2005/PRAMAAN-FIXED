import mongoose from 'mongoose';
import { Conversation } from '../types/index.js';

const conversationSchema = new mongoose.Schema<Conversation>(
  {
    participants: [
      {
        type: String,
        ref: 'User',
      },
    ],
    lastMessage: {
      content: String,
      senderId: String,
      timestamp: Date,
    },
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model<Conversation>(
  'Conversation',
  conversationSchema
);
