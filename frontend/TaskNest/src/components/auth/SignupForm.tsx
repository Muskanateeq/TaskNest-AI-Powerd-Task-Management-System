/**
 * Signup Form Component
 *
 * Form for user registration with email, password, and name.
 * Integrates with AuthContext for authentication.
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SocialLoginButtons from './SocialLoginButtons';

export default function SignupForm() {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [socialError, setSocialError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name) {
      errors.name = 'Full name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!agreedToTerms) {
      errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      // Navigation handled by AuthContext
    } catch (err) {
      // Error handled by AuthContext
      console.error('Registration failed:', err);
    }
  };

  return (
    <div>
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit}>
        {/* Global error message */}
        {(error || socialError) && (
          <div className="error-message">
            {error || socialError}
          </div>
        )}

        {/* Name field */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            disabled={isLoading}
          />
          {formErrors.name && (
            <p className="error-message" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              {formErrors.name}
            </p>
          )}
        </div>

        {/* Email field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={isLoading}
          />
          {formErrors.email && (
            <p className="error-message" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              {formErrors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="error-message" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              {formErrors.password}
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="terms"
            className="checkbox-input"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="terms" className="checkbox-label">
            I agree to the{' '}
            <a href="#">Terms of Service</a>
            {' '}and{' '}
            <a href="#">Privacy Policy</a>
          </label>
        </div>
        {formErrors.terms && (
          <p className="error-message" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
            {formErrors.terms}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="divider">
        <span>Or continue with</span>
      </div>

      {/* Social Login Buttons */}
      <SocialLoginButtons mode="signup" onError={setSocialError} />
    </div>
  );
}
