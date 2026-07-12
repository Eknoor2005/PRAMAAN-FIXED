export interface User {
  id: string;
  email: string;
  role: 'survivor' | 'lawyer' | 'police' | 'ngo' | 'admin';
  name: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<User>;
  signup(email: string, password: string, name: string, role: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}

export interface DatabaseService {
  saveTestimony(testimony: any): Promise<any>;
  getTestimonies(): Promise<any[]>;
  saveEvidence(evidence: any): Promise<any>;
  getEvidence(): Promise<any[]>;
}

export interface StorageService {
  uploadFile(file: File): Promise<string>; // returns URL
}

export interface AIService {
  analyzeEvidence(evidence: any): Promise<string>;
  generateSummary(text: string): Promise<string>;
}
