import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulasi data user untuk demo (nanti diganti dengan API)
const DEMO_USERS: { user: User; password: string }[] = [
  {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@homestock.com',
      createdAt: new Date(),
    },
    password: 'demo123',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check localStorage saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem('homestock_token');
    const userStr = localStorage.getItem('homestock_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('homestock_token');
        localStorage.removeItem('homestock_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulasi API call (nanti diganti dengan real API)
    const foundUser = DEMO_USERS.find(
      u => u.user.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      const token = 'demo_token_' + Date.now();
      localStorage.setItem('homestock_token', token);
      localStorage.setItem('homestock_user', JSON.stringify(foundUser.user));
      
      setAuthState({
        user: foundUser.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Login Berhasil! 🎉',
        description: `Selamat datang kembali, ${foundUser.user.name}`,
      });
      
      return true;
    } else {
      toast({
        title: 'Login Gagal',
        description: 'Email atau password salah',
        variant: 'destructive',
      });
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    // Simulasi API call (nanti diganti dengan real API)
    const exists = DEMO_USERS.find(u => u.user.email === credentials.email);
    
    if (exists) {
      toast({
        title: 'Registrasi Gagal',
        description: 'Email sudah terdaftar',
        variant: 'destructive',
      });
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: credentials.name,
      email: credentials.email,
      createdAt: new Date(),
    };

    DEMO_USERS.push({ user: newUser, password: credentials.password });

    const token = 'demo_token_' + Date.now();
    localStorage.setItem('homestock_token', token);
    localStorage.setItem('homestock_user', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
    
    toast({
      title: 'Registrasi Berhasil! 🎉',
      description: 'Akun kamu sudah dibuat',
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('homestock_token');
    localStorage.removeItem('homestock_user');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    toast({
      title: 'Logout Berhasil',
      description: 'Sampai jumpa lagi!',
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
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
