/**
 * Custom 404 Not Found Page
 *
 * This page is statically generated and doesn't use client contexts
 * Must export its own html/body to bypass root layout
 */

export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | TaskNest</title>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <h1 style={{ fontSize: '6rem', margin: '0', fontWeight: 'bold' }}>404</h1>
          <h2 style={{ fontSize: '2rem', margin: '20px 0' }}>Page Not Found</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <a
            href="/dashboard"
            style={{
              padding: '12px 30px',
              background: 'white',
              color: '#667eea',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'transform 0.2s',
              display: 'inline-block',
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </body>
    </html>
  );
}
