// src/components/ErrorBoundary.jsx
// CP4-A: Reusable error boundary — wraps critical components.
// Dev: shows raw error message in mono pre block.
// Prod: shows friendly message only.

import React from 'react';

const ORANGE = '#FC8019';
const RED    = '#F38BA8';
const IS_DEV = import.meta.env.DEV;

function ErrorFallback({ error, onReset, fullPage = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: fullPage ? '100vh' : '240px',
      padding: '24px',
      background: fullPage ? 'var(--bg)' : 'transparent',
    }}>
      <div style={{
        maxWidth: 400, width: '100%',
        padding: '28px 24px',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${RED}30`,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Label */}
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: RED, marginBottom: 12,
        }}>
          Something went wrong
        </p>

        {/* Message */}
        <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 16 }}>
          A component crashed. Your investigation progress is saved.
        </p>

        {/* Dev-only error detail */}
        {IS_DEV && error?.message && (
          <pre style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: RED, lineHeight: 1.6,
            padding: '10px 12px', borderRadius: 8,
            background: `${RED}08`, border: `1px solid ${RED}25`,
            overflowX: 'auto', marginBottom: 16, whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {error.message}
          </pre>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 18px', borderRadius: 9,
              background: ORANGE, color: '#fff',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: `0 2px 10px ${ORANGE}40`,
            }}
          >
            Refresh page
          </button>
          <a href="/" style={{
            fontFamily: 'var(--mono)', fontSize: 11,
            color: 'var(--ink3)', textDecoration: 'underline',
            cursor: 'pointer',
          }}>
            Back to home
          </a>
          {onReset && (
            <button onClick={onReset} style={{
              fontFamily: 'var(--mono)', fontSize: 11,
              color: 'var(--ink3)', background: 'none',
              border: 'none', cursor: 'pointer', textDecoration: 'underline',
            }}>
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.PROD) {
      try {
        // posthog may not be initialised yet — guard with optional chaining
        window.posthog?.capture('component_error', {
          error:     error.message,
          component: info.componentStack?.split('\n')[1]?.trim(),
        });
      } catch (_) {}
    } else {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <ErrorFallback
        error={this.state.error}
        fullPage={this.props.fullPage || false}
        onReset={() => this.setState({ hasError: false, error: null })}
      />
    );
  }
}

// Convenience full-page variant for App-level wrapping
export function FullPageErrorBoundary({ children }) {
  return (
    <ErrorBoundary fullPage>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
