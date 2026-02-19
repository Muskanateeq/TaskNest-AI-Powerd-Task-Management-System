/**
 * Providers Component
 *
 * Client-side providers wrapper for the application.
 * Wraps all context providers (Auth, Toast, etc.)
 */

'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
