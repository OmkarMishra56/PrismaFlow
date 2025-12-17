
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  register: (username: string, email: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = api.auth.getSession();
    if (session) {
      setState({ user: session, isAuthenticated: true, loading: false });
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const login = async (email: string) => {
    setError(null);
    try {
      const user = await api.auth.login(email);
      setState({ user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (username: string, email: string) => {
    setError(null);
    try {
      const user = await api.auth.register(username, email);
      setState({ user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    api.auth.logout();
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
