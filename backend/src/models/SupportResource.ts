import mongoose from 'mongoose';
import { SupportResource } from '../types/index.js';

const supportResourceSchema = new mongoose.Schema<SupportResource>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['hotline', 'counseling', 'legal', 'housing', 'health', 'safety'],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    email: String,
    website: String,
    address: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const SupportResourceModel = mongoose.model<SupportResource>(
  'SupportResource',
  supportResourceSchema
);
