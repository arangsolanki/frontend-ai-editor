/**
 * Authentication Context
 * 
 * Provides authentication state management across the application.
 * Simple username/password authentication with session persistence.
 * 
 * Uses sessionStorage to persist authentication state across page refreshes.
 * Session is automatically cleared when the browser tab is closed.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session storage key for auth state
const AUTH_SESSION_KEY = 'ai_editor_auth';

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if user is already authenticated on mount
   * Runs only once when component mounts
   */
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error reading auth status from sessionStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login function - validates credentials against backend
   * On success, stores auth state in sessionStorage
   */
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Store authenticated state in sessionStorage
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  /**
   * Logout function - clears auth state and sessionStorage
   */
  const logout = useCallback(() => {
    // Clear sessionStorage
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

