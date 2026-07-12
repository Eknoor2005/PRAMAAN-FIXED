'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface FirebaseAuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    }
  };

  const getIdToken = async () => {
    try {
      return await user?.getIdToken() ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token');
      return null;
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, error, logout, getIdToken }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider');
  }
  return context;
}
