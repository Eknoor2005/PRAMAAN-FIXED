import mongoose from 'mongoose';
import { CaseFile } from '../types/index.js';

const caseFileSchema = new mongoose.Schema<CaseFile>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    caseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed', 'resolved'],
      default: 'open',
    },
    testimoniesId: [
      {
        type: String,
        ref: 'Testimony',
      },
    ],
    evidenceId: [
      {
        type: String,
        ref: 'Evidence',
      },
    ],
    assignedAdvocate: {
      type: String,
      ref: 'User',
      sparse: true,
    },
    caseType: {
      type: String,
      enum: ['sexual-violence', 'domestic-abuse', 'trafficking', 'harassment', 'other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    notes: String,
    closedAt: Date,
  },
  { timestamps: true }
);

export const CaseFileModel = mongoose.model<CaseFile>('CaseFile', caseFileSchema);
