# Better Auth Production Debugging Skill

## Skill Metadata
- **Name:** Better Auth Production Cookie & Redirect Issues
- **Category:** Authentication, Production Debugging, Vercel Deployment
- **Difficulty:** Advanced
- **Last Updated:** 2026-04-20

## Problem Statement

When deploying Better Auth with Next.js to Vercel production, users experience authentication issues where:
- Signup/login succeeds locally but fails in production
- After successful account creation, users are redirected to signin page instead of dashboard
- Middleware cannot detect session cookies
- Browser console shows no errors, but authentication state is not persisted

## Root Causes

### 1. **Secure Cookie Flag Missing**
**Symptom:** Cookies work on localhost (HTTP) but not on production (HTTPS)

**Cause:** 
- Browsers require `Secure` flag on cookies over HTTPS
- Better Auth's `useSecureCookies` defaults to checking `NODE_ENV === "production"`
- Vercel may not set `NODE_ENV` reliably, or the check fails

**Solution:**
```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  // ... other config
  advanced: {
    useSecureCookies: true, // Force secure cookies unconditionally
  },
});
```

### 2. **Middleware Cookie Detection Mismatch**
**Symptom:** Middleware redirects authenticated users to signin page

**Cause:**
- With `useSecureCookies: true`, cookie name becomes `__Secure-better-auth.session_token`
- Middleware using `request.cookies.get('better-auth.session_token')` fails to find it
- Cookie prefix changes based on security settings

**Solution:**
```typescript
// middleware.ts
import { getSessionCookie } from 'better-auth/cookies';

export function middleware(request: NextRequest) {
  // Use Better Auth helper - automatically handles __Secure- prefix
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;
  // ... rest of middleware logic
}
```

### 3. **Environment Variables Not Set in Vercel**
**Symptom:** Auth configuration falls back to localhost URLs in production

**Required Vercel Environment Variables:**
```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Diagnostic Process

### Step 1: Check Browser DevTools
```
F12 → Application → Cookies → your-domain.vercel.app
Look for: better-auth.session_token or __Secure-better-auth.session_token
Verify: Secure flag is checked ✓
```

### Step 2: Check Vercel Runtime Logs
```bash
# Via Vercel MCP or Dashboard
Filter by: "AUTH-SERVER" or "signup" or "dashboard"
Look for: 307 redirects, cookie-related errors
```

### Step 3: Verify Environment Variables
```bash
# Vercel Dashboard → Project → Settings → Environment Variables
Ensure all required vars are set for "Production" environment
```

### Step 4: Test Cookie Propagation
```javascript
// Add temporary logging in AuthContext
console.log("Session data:", sessionData);
console.log("Redirecting to:", window.location.href);
```

## Complete Fix Checklist

- [ ] Set `useSecureCookies: true` in `auth.ts` (unconditional)
- [ ] Update middleware to use `getSessionCookie()` helper
- [ ] Verify all environment variables in Vercel dashboard
- [ ] Clear browser cookies before testing
- [ ] Test in incognito/private window
- [ ] Check Vercel runtime logs for errors
- [ ] Verify cookie has `Secure` flag in DevTools

## Code Examples

### Complete auth.ts Configuration
```typescript
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  }),
  
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET!,
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  
  plugins: [jwt()],
  
  // CRITICAL: Force secure cookies
  advanced: {
    useSecureCookies: true,
  },
  
  trustedOrigins: [
    "http://localhost:3000",
    "https://your-domain.vercel.app",
  ],
});
```

### Complete middleware.ts
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const publicRoutes = ['/', '/signin', '/signup'];
const authRoutes = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Use Better Auth helper - handles __Secure- prefix automatically
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;
  
  if (publicRoutes.includes(pathname)) {
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  if (!isAuthenticated) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signinUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Common Pitfalls

1. **Using `process.env.NODE_ENV === "production"`** - Unreliable on Vercel
2. **Manual cookie name checking** - Breaks with secure cookies
3. **Forgetting to redeploy** - After setting environment variables
4. **Testing without clearing cookies** - Old cookies interfere
5. **Missing HTTPS in baseURL** - Causes cookie security issues

## Related Issues

- Better Auth GitHub Issue #2157: "in production not getting session data after login"
- Better Auth GitHub Issue #7156: "baseURL empty string bypasses Secure flag"
- Better Auth GitHub Issue #1487: "Cookie parsing issue in production build"

## References

- [Better Auth Cookies Documentation](https://better-auth.com/docs/concepts/cookies)
- [Better Auth Security Options](https://better-auth.com/docs/reference/security)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## Success Criteria

✅ Signup creates account and redirects to dashboard (not signin)
✅ Cookie has `Secure` flag in production DevTools
✅ Middleware correctly detects authenticated users
✅ No 307 redirects to signin after successful authentication
✅ Works consistently across multiple signups/logins

## Troubleshooting Commands

```bash
# Check Vercel deployment logs
vercel logs <deployment-url>

# Test cookie in browser console
document.cookie

# Verify environment variables
vercel env ls

# Force redeploy
git commit --allow-empty -m "trigger redeploy" && git push
```

---

**Created by:** Claude Code
**Project:** TaskNest AI-Powered Task Management
**Date:** April 20, 2026
