export interface StorageService {
  uploadFile(file: File): Promise<string>; // returns a local mock URL
}
