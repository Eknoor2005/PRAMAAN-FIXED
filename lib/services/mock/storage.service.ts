import { StorageService } from '../interfaces';

export class MockStorageService implements StorageService {
  async uploadFile(file: File): Promise<string> {
    console.log('Mock upload:', file.name);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In mock, return a fake local URL
    return URL.createObjectURL(file);
  }
}
