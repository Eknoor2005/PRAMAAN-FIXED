import mongoose from 'mongoose';
import { Testimony } from '../types/index.js';

const timelineEntrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['incident', 'report', 'action', 'note'],
      default: 'note',
    },
    evidence: [String],
  },
  { _id: true }
);

const testimonySchema = new mongoose.Schema<Testimony>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      sparse: true,
    },
    videoUrl: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'submitted', 'verified'],
      default: 'draft',
    },
    timeline: [timelineEntrySchema],
    caseId: {
      type: String,
      sparse: true,
      ref: 'CaseFile',
    },
    witnesses: [String],
    location: String,
    dateOfIncident: Date,
    encryptionKey: {
      type: String,
      required: true,
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const TestimonyModel = mongoose.model<Testimony>('Testimony', testimonySchema);
