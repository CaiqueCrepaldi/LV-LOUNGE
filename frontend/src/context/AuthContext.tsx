import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (usuario: string, senha: string) => boolean;
  logout: () => void;
  isGerente: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Senha compartilhada de demonstração — configurável via VITE_DEMO_PASSWORD no .env.local
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined ?? 'demo';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (usuario: string, senha: string): boolean => {
    const found = mockUsers.find(u => u.usuario === usuario);
    if (found && senha === DEMO_PASSWORD) { setUser(found); return true; }
    return false;
  };

  const logout = () => setUser(null);
  const isGerente = user?.cargo === 'gerente';

  return (
    <AuthContext.Provider value={{ user, login, logout, isGerente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
