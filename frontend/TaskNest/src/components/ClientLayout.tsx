/**
 * Client Layout Component
 *
 * Wraps all client-side providers and components
 * Separated from root layout to ensure SSR safety
 */

'use client';

import React from 'react';
import { Providers } from '@/components/Providers';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import LiveRegion from '@/components/accessibility/LiveRegion';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary>
      <Providers>
        {children}
      </Providers>
      <LiveRegion />
    </ErrorBoundary>
  );
}
