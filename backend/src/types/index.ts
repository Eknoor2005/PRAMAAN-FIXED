import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'survivor' | 'advocate' | 'admin';
    publicKey?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'survivor' | 'advocate' | 'admin';
  phone?: string;
  country?: string;
  publicKey: string;
  privateKeyEncrypted: string;
  encryptionAlgorithm: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastLogin?: Date;
  firebaseUid?: string;
  authMethod: 'jwt' | 'firebase' | 'google' | 'github';
  linkedAuthMethods: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimony {
  _id: string;
  userId: string;
  title: string;
  description: string;
  content: string; // encrypted
  audioUrl?: string; // encrypted
  videoUrl?: string; // encrypted
  status: 'draft' | 'completed' | 'submitted' | 'verified';
  timeline?: TimelineEntry[];
  caseId?: string;
  witnesses?: string[];
  location?: string;
  dateOfIncident?: Date;
  encryptionKey: string;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEntry {
  _id?: string;
  date: Date;
  description: string;
  type: 'incident' | 'report' | 'action' | 'note';
  evidence?: string[];
}

export interface Evidence {
  _id: string;
  userId: string;
  testimoniesId: string[];
  casesId?: string[];
  fileUrl: string;
  fileType: 'document' | 'photo' | 'video' | 'audio';
  fileName: string;
  fileSize: number;
  fileHash: string;
  category?: string;
  description?: string;
  isEncrypted: boolean;
  encryptedKey: string;
  chain: string; // blockchain-style chain reference
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface CaseFile {
  _id: string;
  userId: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed' | 'resolved';
  testimoniesId: string[];
  evidenceId: string[];
  assignedAdvocate?: string;
  caseType: 'sexual-violence' | 'domestic-abuse' | 'trafficking' | 'harassment' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string; // encrypted
  isEncrypted: boolean;
  isRead: boolean;
  readAt?: Date;
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportResource {
  _id: string;
  title: string;
  description: string;
  category: 'hotline' | 'counseling' | 'legal' | 'housing' | 'health' | 'safety';
  country: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}
