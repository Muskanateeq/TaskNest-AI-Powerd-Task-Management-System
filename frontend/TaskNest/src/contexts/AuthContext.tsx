/**
 * Authentication Context with Better Auth
 *
 * Provides authentication state and methods throughout the application.
 * Uses Better Auth for user login, logout, registration, and session management.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import authClient, { getJWTToken, clearTokenCache } from '@/lib/auth-client';

/**
 * User Interface (from Better Auth)
 */
interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session Interface (from Better Auth)
 */
interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Login Request
 */
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Authentication Context State
 */
interface AuthContextState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getToken: () => Promise<string | null>;
  clearError: () => void;
}

/**
 * Create Authentication Context with null default for SSR safety
 */
const AuthContext = createContext<AuthContextState | null>(null);

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Initialize authentication state from Better Auth session
   * Only runs once on mount to prevent repeated session checks
   */
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data, error } = await authClient.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Failed to get session:', error);
          setSession(null);
        } else if (data) {
          setSession(data as Session);
        } else {
          setSession(null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to initialize auth:', err);
        setSession(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Refresh session from Better Auth
   */
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await authClient.getSession();

      if (error) {
        console.error('Failed to refresh session:', error);
        setSession(null);
      } else if (data) {
        setSession(data as Session);
      }
    } catch (err) {
      console.error('Failed to refresh session:', err);
      setSession(null);
    }
  }, []);

  /**
   * Login user with Better Auth
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        // Check if this is an OAuth account trying to login with password
        let errorMessage = error.message || 'Login failed. Please try again.';

        // Detect OAuth account error
        if (errorMessage.toLowerCase().includes('invalid') ||
            errorMessage.toLowerCase().includes('credentials')) {
          // Try to provide helpful message
          errorMessage = `Invalid email or password. If you signed up with Google or GitHub, please use the social login buttons below.`;
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (data) {
        // Refresh session to get proper session structure
        const { data: sessionData } = await authClient.getSession();
        if (sessionData) {
          setSession(sessionData as Session);
          clearTokenCache(); // Clear old token cache
        }
        // Use window.location.href for full page reload to ensure cookie is sent to server
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Register new user with Better Auth
   */
  const register = useCallback(async (data: RegisterRequest) => {
    console.log("🔵 [AUTH-CONTEXT] Register called with email:", data.email);
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔵 [AUTH-CONTEXT] Calling authClient.signUp.email...");
      const { data: responseData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name || '',
      });

      console.log("🔵 [AUTH-CONTEXT] SignUp response:", { responseData, error });

      if (error) {
        console.error("❌ [AUTH-CONTEXT] SignUp error:", error);
        // Check if this is a duplicate email error
        let errorMessage = error.message || 'Registration failed. Please try again.';

        // Detect duplicate email / OAuth account
        if (errorMessage.toLowerCase().includes('already') ||
            errorMessage.toLowerCase().includes('exists') ||
            errorMessage.toLowerCase().includes('duplicate')) {
          errorMessage = `This email is already registered. If you signed up with Google or GitHub, please use the social login buttons below to sign in.`;
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (responseData) {
        console.log("✅ [AUTH-CONTEXT] SignUp successful, fetching session...");
        // Refresh session to get proper session structure
        const { data: sessionData, error: sessionError } = await authClient.getSession();
        console.log("🔵 [AUTH-CONTEXT] GetSession response:", { sessionData, sessionError });

        if (sessionData) {
          console.log("✅ [AUTH-CONTEXT] Session data received:", sessionData);
          setSession(sessionData as Session);
          clearTokenCache(); // Clear old token cache
          console.log("🔵 [AUTH-CONTEXT] Redirecting to /dashboard with full page reload...");
          // Use window.location.href for full page reload to ensure cookie is sent to server
          window.location.href = '/dashboard';
        } else {
          console.error("❌ [AUTH-CONTEXT] No session data after signup!");
          if (sessionError) {
            console.error("❌ [AUTH-CONTEXT] Session error:", sessionError);
          }
        }
      } else {
        console.error("❌ [AUTH-CONTEXT] No response data from signup!");
      }
    } catch (err) {
      console.error("❌ [AUTH-CONTEXT] Register exception:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      console.log("🔵 [AUTH-CONTEXT] Register completed");
    }
  }, [router]);

  /**
   * Logout user with Better Auth
   */
  const logout = useCallback(async () => {
    try {
      // Clear token cache first
      clearTokenCache();

      // Sign out from Better Auth
      await authClient.signOut();

      // Clear local session state
      setSession(null);
      setError(null);

      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      // Force logout even if API call fails
      clearTokenCache();
      setSession(null);
      // Redirect to home page
      window.location.href = '/';
    }
  }, []);

  /**
   * Get JWT token for API requests
   */
  const getToken = useCallback(async () => {
    return await getJWTToken();
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextState = {
    user: session?.user || null,
    session,
    isAuthenticated: !!session?.user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshSession,
    getToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * Custom hook to access authentication context.
 * Must be used within AuthProvider.
 *
 * @throws Error if used outside AuthProvider
 *
 * @example
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />;
 *   }
 *
 *   return <div>Welcome, {user?.name}!</div>;
 * }
 */
export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);

  // During SSR or when provider is not mounted, return safe defaults
  if (context === null) {
    // Check if we're on the server or during static generation
    if (typeof window === 'undefined') {
      // Return safe defaults for SSR
      return {
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        login: async () => {},
        register: async () => {},
        logout: async () => {},
        refreshSession: async () => {},
        getToken: async () => null,
        clearError: () => {},
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
