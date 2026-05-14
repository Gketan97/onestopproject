import { useNavigate } from 'react-router-dom'

export default function Diagnostic() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '24px',
    }}>
      <span style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '12px',
        letterSpacing: '0.1em',
        color: 'var(--text-tertiary)',
      }}>DIAGNOSTIC — COMING IN PROMPT 3</span>
      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '10px 20px',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
      >
        ← Back to Home
      </button>
    </div>
  )
}
