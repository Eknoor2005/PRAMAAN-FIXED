import { AuthService, User } from '../interfaces';

export class MockAuthService implements AuthService {
  async login(email: string, password: string): Promise<User> {
    console.log('Mock login:', email);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: 'mock-user-123',
      email,
      role: 'survivor',
      name: 'Test User'
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }

  async signup(email: string, password: string, name: string, role: string): Promise<User> {
    console.log('Mock signup:', email, role);
    const mockUser: User = {
      id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email,
      role: role as any,
      name
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
