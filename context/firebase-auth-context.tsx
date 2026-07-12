'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/services/service-factory';
import { User } from '@/lib/services/interfaces';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage on load
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const signup = async (email: string, password: string, name: string, role: string) => {
    try {
      const newUser = await authService.signup(email, password, name, role);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
