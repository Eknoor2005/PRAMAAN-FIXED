// User roles in the PRAMAAN system
export type UserRole = 'survivor' | 'police' | 'lawyer' | 'ngo' | 'admin';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  isVerified: boolean;
}

// Case status
export type CaseStatus = 
  | 'draft'
  | 'incident_reported'
  | 'fir_filed'
  | 'investigation'
  | 'evidence_submitted'
  | 'court_hearing'
  | 'judgement'
  | 'closed';

// Case type
export interface Case {
  id: string;
  survivorId: string;
  title: string;
  description?: string;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedLawyer?: string;
  assignedPolice?: string;
  assignedNGO?: string;
}

// Testimony type
export type TestimonyType = 'voice' | 'video' | 'text';

// Memory fragment
export interface MemoryFragment {
  id: string;
  caseId: string;
  type: TestimonyType;
  content: string;
  mediaUrl?: string;
  duration?: number;
  timestamp: Date;
  tags: string[];
  prompts: {
    question: string;
    answer: string;
  }[];
}

// Structured testimony (AI processed)
export interface StructuredTestimony {
  id: string;
  caseId: string;
  fragments: string[];
  timeline: TimelineEvent[];
  keyFacts: KeyFact[];
  summary: string;
  generatedAt: Date;
  isEdited: boolean;
}

// Timeline event
export interface TimelineEvent {
  id: string;
  date?: Date;
  approximateTime?: string;
  description: string;
  linkedFragments: string[];
  linkedEvidence: string[];
}

// Key fact
export interface KeyFact {
  id: string;
  category: 'person' | 'location' | 'action' | 'evidence' | 'detail';
  content: string;
  importance: 'high' | 'medium' | 'low';
  linkedFragments: string[];
}

// Evidence type
export type EvidenceType = 
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'medical_report'
  | 'screenshot'
  | 'other';

// Evidence item
export interface Evidence {
  id: string;
  caseId: string;
  type: EvidenceType;
  name: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  tags: string[];
  isEncrypted: boolean;
}

// Message type
export interface Message {
  id: string;
  caseId: string;
  senderId: string;
  senderRole: UserRole;
  receiverId: string;
  receiverRole: UserRole;
  content: string;
  attachments?: string[];
  sentAt: Date;
  isRead: boolean;
  isEncrypted: boolean;
}

// Privacy settings
export interface PrivacySettings {
  userId: string;
  allowTestimonyAccess: UserRole[];
  allowEvidenceAccess: UserRole[];
  isAnonymous: boolean;
  canDownloadData: boolean;
}

// Support resource
export interface SupportResource {
  id: string;
  title: string;
  description: string;
  category: 'helpline' | 'ngo' | 'mental_health' | 'legal_education';
  contactInfo?: string;
  website?: string;
  isEmergency: boolean;
}

// Analytics data
export interface AnalyticsData {
  totalCases: number;
  activeInvestigations: number;
  evidenceSubmissions: number;
  resolutionRate: number;
  casesByStatus: Record<CaseStatus, number>;
  casesOverTime: {
    date: string;
    count: number;
  }[];
}

// Navigation item
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}
