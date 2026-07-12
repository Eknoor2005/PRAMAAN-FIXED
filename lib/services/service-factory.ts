import { AuthService, DatabaseService, StorageService } from '../interfaces';
import { MockAuthService } from './mock/auth.service';
import { MockDatabaseService } from './mock/database.service';
import { MockStorageService } from './mock/storage.service';

export const authService: AuthService = new MockAuthService();
export const databaseService: DatabaseService = new MockDatabaseService();
export const storageService: StorageService = new MockStorageService();
