import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { checkAdminSession, loginAdmin, setupAdmin, removeAdminToken, getStoredAdminUser } from '../lib/api';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  setupFirstAdmin: (name: string, email: string, pass: string, code?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => getStoredAdminUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    checkAdminSession()
      .then(verifiedUser => {
        if (isMounted) {
          setUser(verifiedUser);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await loginAdmin(email, pass);
    setUser(res.user);
  };

  const setupFirstAdmin = async (name: string, email: string, pass: string, code?: string) => {
    const res = await setupAdmin(name, email, pass, code);
    setUser(res.user);
  };

  const logout = () => {
    removeAdminToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        setupFirstAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
