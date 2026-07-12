import { DatabaseService, EvidenceRecord } from '../interfaces';

export class MockDatabaseService implements DatabaseService {
  async saveTestimony(testimony: any): Promise<any> {
    const data = JSON.parse(localStorage.getItem('testimonies') || '[]');
    const newTestimony = { ...testimony, id: Math.random().toString(36).substr(2, 9) };
    data.push(newTestimony);
    localStorage.setItem('testimonies', JSON.stringify(data));
    return newTestimony;
  }

  async getTestimonies(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('testimonies') || '[]');
  }

  async saveEvidence(evidence: Omit<EvidenceRecord, '_id' | 'createdAt'>): Promise<EvidenceRecord> {
    const data: EvidenceRecord[] = JSON.parse(localStorage.getItem('evidence') || '[]');
    const newEvidence: EvidenceRecord = { 
        ...evidence, 
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    };
    data.push(newEvidence);
    localStorage.setItem('evidence', JSON.stringify(data));
    return newEvidence;
  }

  async getEvidence(): Promise<EvidenceRecord[]> {
    return JSON.parse(localStorage.getItem('evidence') || '[]');
  }

  async deleteEvidence(id: string): Promise<void> {
    const data: EvidenceRecord[] = JSON.parse(localStorage.getItem('evidence') || '[]');
    const filtered = data.filter(e => e._id !== id);
    localStorage.setItem('evidence', JSON.stringify(filtered));
  }
}
