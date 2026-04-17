/**
 * Sign In Page - TaskNest
 * Modern dark theme authentication page
 */

'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import '../auth.css';

export default function SignInPage() {
  return (
    <div className="auth-page">
      {/* Back to Home Button */}
      <Link href="/" className="back-to-home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="signin-container">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <div className="logo-text">TaskNest</div>
          </Link>
        </div>

        {/* Sign In Card */}
        <div className="signin-card">
          {/* Header */}
          <div className="signin-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Sign In Form */}
          <LoginForm />

          {/* Sign Up Link */}
          <div className="signup-link">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
