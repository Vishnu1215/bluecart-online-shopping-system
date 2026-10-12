import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authApi, RegisterDto } from '../api/auth.api';
import { verifyToken } from '../services/jwt-sim';
import { db } from '../db/localStorageDb';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean, roleCheck?: UserRole) => Promise<{ success: boolean; error?: string; lockRemainingSeconds?: number }>;
  register: (data: RegisterDto) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'bluecart_jwt_token';
const USER_KEY = 'bluecart_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(() => {
    if (!user) return;
    const fresh = db.findById<User>('users', user.id);
    if (fresh) {
      setUser(fresh);
      const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(fresh));
    }
  }, [user]);

  useEffect(() => {
    // Restore session on mount
    const storedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      const verification = verifyToken(storedToken);
      if (verification.valid && verification.payload) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Verify with latest DB record
          const dbUser = db.findById<User>('users', parsedUser.id);
          if (dbUser && dbUser.status === 'Active') {
            setUser(dbUser);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      } else {
        // Token expired or invalid
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string, 
    password: string, 
    rememberMe: boolean = true, 
    roleCheck?: UserRole
  ): Promise<{ success: boolean; error?: string; lockRemainingSeconds?: number }> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password, roleCheck);
      if (!res.success || !res.data) {
        setIsLoading(false);
        return { 
          success: false, 
          error: res.error, 
          lockRemainingSeconds: (res as any).lockRemainingSeconds 
        };
      }

      const { user: loggedInUser, token: jwtToken } = res.data;
      if (loggedInUser && jwtToken) {
        setUser(loggedInUser);
        setToken(jwtToken);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, jwtToken);
        storage.setItem(USER_KEY, JSON.stringify(loggedInUser));

        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'An error occurred during login.' };
    }
  };

  const register = async (data: RegisterDto): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      setIsLoading(false);
      if (!res.success) {
        return { success: false, error: res.error };
      }
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    // Convenience helper for demo evaluations
    const users = db.get('users') || [];
    let targetUser: User | undefined;
    if (newRole === 'admin') {
      targetUser = users.find(u => u.email === 'admin@shop.example');
    } else if (newRole === 'vendor') {
      targetUser = users.find(u => u.email === 'vendor@techwest.example');
    } else {
      targetUser = users.find(u => u.email === 'ananya.rao@example.com');
    }

    if (targetUser) {
      login(targetUser.email, targetUser.role === 'admin' ? 'Admin@123' : (targetUser.role === 'vendor' ? 'Vendor@123' : 'Customer@123'), true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshUser
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
