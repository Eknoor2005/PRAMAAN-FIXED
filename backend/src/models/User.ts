import mongoose from 'mongoose';
import { User } from '../types/index.js';

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['survivor', 'lawyer', 'police', 'ngo', 'admin'],
      default: 'survivor',
    },
    phone: {
      type: String,
      sparse: true,
    },
    country: {
      type: String,
      sparse: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKeyEncrypted: {
      type: String,
      required: true,
    },
    encryptionAlgorithm: {
      type: String,
      default: 'rsa-2048',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    lastLogin: {
      type: Date,
      sparse: true,
    },
    firebaseUid: {
      type: String,
      sparse: true,
      unique: true,
    },
    authMethod: {
      type: String,
      enum: ['jwt', 'firebase', 'google'],
      default: 'jwt',
    },
    linkedAuthMethods: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>('User', userSchema);
