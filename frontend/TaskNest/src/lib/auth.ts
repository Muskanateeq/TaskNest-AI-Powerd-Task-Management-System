/**
 * Better Auth Server Configuration
 *
 * This file configures Better Auth to handle authentication for TaskNest.
 * It connects to the Neon PostgreSQL database and enables JWT token generation.
 */

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

/**
 * Get the base URL for Better Auth server
 * Priority: env var > production URL (if on Vercel) > localhost
 */
function getAuthBaseURL(): string {
  console.log("🔧 [AUTH-SERVER] Detecting server baseURL...");
  console.log("🔧 [AUTH-SERVER] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
  console.log("🔧 [AUTH-SERVER] VERCEL:", process.env.VERCEL);
  console.log("🔧 [AUTH-SERVER] VERCEL_URL:", process.env.VERCEL_URL);

  // If env var is set, use it
  if (process.env.BETTER_AUTH_URL) {
    console.log("✅ [AUTH-SERVER] Using BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
    return process.env.BETTER_AUTH_URL;
  }

  // Check if we're on Vercel (production)
  if (process.env.VERCEL || process.env.VERCEL_URL) {
    console.log("✅ [AUTH-SERVER] Detected Vercel, using hardcoded URL");
    return "https://tasknest-ai-powerd.vercel.app";
  }

  // Default to localhost for development
  console.log("✅ [AUTH-SERVER] Using localhost (development)");
  return "http://localhost:3000";
}

const authBaseURL = getAuthBaseURL();
console.log("🚀 [AUTH-SERVER] Creating Better Auth with baseURL:", authBaseURL);
console.log("🚀 [AUTH-SERVER] DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("🚀 [AUTH-SERVER] BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);

export const auth = betterAuth({
  // Database connection - uses Neon PostgreSQL with pg Pool
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: {
      rejectUnauthorized: false, // Required for Neon
    },
  }),

  // Base URL for authentication endpoints with smart fallback
  baseURL: authBaseURL,
  basePath: "/api/auth",

  // Secret key for signing tokens (must match backend)
  secret: process.env.BETTER_AUTH_SECRET!,

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for Phase 2, enable later
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // Social providers - Google and GitHub only
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },

  // Account linking configuration - PRODUCTION GRADE
  account: {
    accountLinking: {
      enabled: true,
      // Trusted providers will auto-link even without email verification
      trustedProviders: ["google", "github"],
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  // Enable JWT plugin for token generation
  plugins: [
    jwt({
      jwt: {
        // JWT configuration with smart fallback
        issuer: getAuthBaseURL(),
        audience: getAuthBaseURL(),
        expirationTime: "7d",

        // Define JWT payload structure
        definePayload: ({ user, session }) => {
          return {
            user_id: user.id,
            email: user.email,
            session_id: session.id,
          };
        },
      },
    }),
  ],

  // Advanced configuration for production
  advanced: {
    // Force secure cookies to ensure proper cookie delivery over HTTPS
    // This is the most reliable way per Better Auth docs (not conditional on NODE_ENV)
    useSecureCookies: true,
  },

  // Trusted origins for CORS with production URL
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://tasknest-ai-powerd.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean),
});

// Export the auth handler type for use in API routes
export type Auth = typeof auth;
