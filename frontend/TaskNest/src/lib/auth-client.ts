/**
 * Better Auth Client Configuration
 *
 * This file creates the Better Auth client for use in frontend components.
 * It provides methods for authentication operations and JWT token management.
 */

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

/**
 * Get the base URL for Better Auth
 * Priority: env var > production URL (if on Vercel) > localhost
 */
function getBaseURL(): string {
  console.log("🔍 [AUTH-CLIENT] Detecting baseURL...");
  console.log("🔍 [AUTH-CLIENT] NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
  console.log("🔍 [AUTH-CLIENT] VERCEL:", process.env.VERCEL);
  console.log("🔍 [AUTH-CLIENT] NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL);

  // If env var is set, use it
  if (process.env.NEXT_PUBLIC_APP_URL) {
    console.log("✅ [AUTH-CLIENT] Using NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Check if we're on Vercel (production)
  if (process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_URL) {
    console.log("✅ [AUTH-CLIENT] Detected Vercel, using hardcoded URL");
    return "https://tasknest-ai-powerd.vercel.app";
  }

  // Client-side: check if hostname is vercel.app
  if (typeof window !== "undefined") {
    console.log("🔍 [AUTH-CLIENT] Window hostname:", window.location.hostname);
    if (window.location.hostname.includes("vercel.app")) {
      const url = `https://${window.location.hostname}`;
      console.log("✅ [AUTH-CLIENT] Using window hostname:", url);
      return url;
    }
  }

  // Default to localhost for development
  console.log("✅ [AUTH-CLIENT] Using localhost (development)");
  return "http://localhost:3000";
}

// Create Better Auth client with JWT plugin
const baseURL = getBaseURL();
console.log("🚀 [AUTH-CLIENT] Creating authClient with baseURL:", baseURL);

export const authClient = createAuthClient({
  // Base URL for auth endpoints with smart fallback
  baseURL: baseURL,
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
