import mongoose from 'mongoose';
import { Evidence } from '../types/index.js';

const evidenceSchema = new mongoose.Schema<Evidence>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    testimoniesId: [
      {
        type: String,
        ref: 'Testimony',
      },
    ],
    casesId: [
      {
        type: String,
        ref: 'CaseFile',
      },
    ],
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['document', 'photo', 'video', 'audio'],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: 'other',
    },
    description: {
      type: String,
    },
    fileHash: {
      type: String,
      required: true,
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
    encryptedKey: {
      type: String,
      required: true,
    },
    chain: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: Date,
    verifiedBy: String,
  },
  { timestamps: true }
);

export const EvidenceModel = mongoose.model<Evidence>('Evidence', evidenceSchema);
