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
 * Get JWT token for API requests
 *
 * This function retrieves a JWT token from Better Auth
 * that can be sent to the FastAPI backend for authentication.
 *
 * @returns JWT token string or null if not authenticated
 */
export async function getJWTToken(): Promise<string | null> {
  try {
    // CORRECT METHOD: Use authClient.token() not getToken()
    // This is the documented Better Auth API
    const { data, error } = await authClient.token();

    if (error) {
      console.error("Failed to get JWT token:", error);
      return null;
    }

    return data?.token || null;
  } catch (error) {
    console.error("Error getting JWT token:", error);
    return null;
  }
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
