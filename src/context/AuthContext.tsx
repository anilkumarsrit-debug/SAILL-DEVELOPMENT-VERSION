import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, UserRole, normalizeRole } from '../types/auth';
import { AuthService } from '../services/AuthService';
import { Page } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  hasAccess: (page: Page) => boolean;
  getRedirectPage: (roleInput?: UserRole) => Page;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore session on initial mount
    const savedUser = AuthService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    const authenticatedUser = await AuthService.login(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const hasAccess = (page: Page): boolean => {
    return AuthService.hasAccess(user, page);
  };

  const getRedirectPage = (roleInput?: UserRole): Page => {
    const r = roleInput || user?.role || 'STUDENT';
    return AuthService.getRedirectPage(normalizeRole(r));
  };

  const role = user ? user.role : null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasAccess,
        getRedirectPage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
