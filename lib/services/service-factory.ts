import { AuthService, DatabaseService } from '../interfaces';
import { MockAuthService } from './mock/auth.service';
import { MockDatabaseService } from './mock/database.service';

export const authService: AuthService = new MockAuthService();
export const databaseService: DatabaseService = new MockDatabaseService();
