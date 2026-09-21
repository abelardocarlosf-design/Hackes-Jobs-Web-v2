'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cerrarSesion } from '@/lib/sesion-cliente';

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

/**
 * `login` y `register` devuelven el usuario además del éxito: quien llama
 * necesita el rol para decidir a dónde redirigir. Antes se descartaba, y por
 * eso todos los roles acababan en /dashboard.
 */
interface ResultadoAuth {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ResultadoAuth>;
  register: (data: RegisterData) => Promise<ResultadoAuth>;
  logout: () => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'company' | 'candidate';
  companyName?: string;
  companyIndustry?: string;
  companySize?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        }
      }
    } catch {
      // No hay sesión
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data.user);
        return { success: true, user: data.data.user as AuthUser };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Error de conexión' };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data.user);
        return { success: true, user: data.data.user as AuthUser };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    cerrarSesion();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
