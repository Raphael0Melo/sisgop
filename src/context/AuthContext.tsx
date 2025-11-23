'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AuthContextType, People } from '@/types';
import { myApi } from '@/service/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<People | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      myApi.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(user));
    }

    setLoading(false);
  }, []);

  const signIn = async (cpf: string, password: string) => {
    try {
      setLoading(true);
      const response = await myApi.post('api/login', { cpf, password });
      console.log('response.data.user', response.data.user);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      myApi.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(user);
      router.push('/home');
      toast.success('Login realizado com sucesso!');
    } catch (error: unknown) {
      toast.error('Erro ao fazer login, tente novamente mais tarde.');
      console.error('Erro no login:', error);

    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      setUser(null);
      router.push('/');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  function hasPermission(permission: string): boolean {
    // console.log('user?.perfil?.permissions', user?.perfil?.permissions);

    return user?.perfil?.permissions?.includes(permission) ?? false;
  }

  const value: AuthContextType = {
    user,
    isLoged: !!user,
    signIn,
    signOut: handleSignOut,
    loading,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

