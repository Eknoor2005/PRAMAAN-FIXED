import { DatabaseService } from '../interfaces';

export class MockDatabaseService implements DatabaseService {
  async saveTestimony(testimony: any): Promise<any> {
    const data = JSON.parse(localStorage.getItem('testimonies') || '[]');
    data.push({ ...testimony, id: Math.random().toString(36).substr(2, 9) });
    localStorage.setItem('testimonies', JSON.stringify(data));
    return data[data.length - 1];
  }

  async getTestimonies(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('testimonies') || '[]');
  }

  async saveEvidence(evidence: any): Promise<any> {
    const data = JSON.parse(localStorage.getItem('evidence') || '[]');
    data.push({ ...evidence, id: Math.random().toString(36).substr(2, 9) });
    localStorage.setItem('evidence', JSON.stringify(data));
    return data[data.length - 1];
  }

  async getEvidence(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('evidence') || '[]');
  }
}
