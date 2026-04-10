/**
 * Global Error Page
 *
 * Handles errors at the root level without relying on client contexts
 * Must include its own html and body tags
 */

'use client';

export const dynamic = 'force-static';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Error | TaskNest</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
        }}>
          <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: 'bold' }}>Oops!</h1>
          <h2 style={{ fontSize: '2rem', margin: '20px 0' }}>Something went wrong</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 30px',
              background: 'white',
              color: '#f5576c',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.1rem',
              marginRight: '10px',
            }}
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            style={{
              padding: '12px 30px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'inline-block',
              marginTop: '10px',
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </body>
    </html>
  );
}
