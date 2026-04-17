/**
 * Better Auth Client Configuration
 *
 * This file creates the Better Auth client for use in frontend components.
 * It provides methods for authentication operations and JWT token management.
 */

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// Create Better Auth client with JWT plugin
export const authClient = createAuthClient({
  // Base URL for auth endpoints
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  // Add JWT plugin to client
  plugins: [jwtClient()],
});

/**
 * Token cache to prevent repeated API calls
 */
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get JWT token for API requests with caching
 *
 * This function retrieves a JWT token from Better Auth
 * that can be sent to the FastAPI backend for authentication.
 * Tokens are cached for 5 minutes to reduce API calls.
 *
 * @returns JWT token string or null if not authenticated
 */
export async function getJWTToken(): Promise<string | null> {
  try {
    // Check if cached token is still valid (with 1 minute buffer)
    const now = Date.now();
    if (cachedToken && tokenExpiry > now + 60000) {
      return cachedToken;
    }

    // Fetch new token
    const { data, error } = await authClient.token();

    if (error) {
      console.error("Failed to get JWT token:", error);
      cachedToken = null;
      tokenExpiry = 0;
      return null;
    }

    // Cache token for 5 minutes
    cachedToken = data?.token || null;
    tokenExpiry = now + 5 * 60 * 1000;

    return cachedToken;
  } catch (error) {
    console.error("Error getting JWT token:", error);
    cachedToken = null;
    tokenExpiry = 0;
    return null;
  }
}

/**
 * Clear cached token (call on logout)
 */
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

/**
 * Get authorization header for API requests
 *
 * @returns Authorization header object or empty object
 */
export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getJWTToken();

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
}

// Export auth client as default
export default authClient;
