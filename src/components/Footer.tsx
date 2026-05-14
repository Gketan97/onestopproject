export default function Footer() {
  return (
    <>
      <style>{`
        .footer-section {
          background: var(--bg-base);
          padding: 48px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
          flex-wrap: wrap;
        }
        .footer-brand {
          font-family: 'DM Mono', monospace;
          font-size: 13px; letter-spacing: 0.12em;
          color: var(--text-primary);
        }
        .footer-links {
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
        }
        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-tertiary);
          text-decoration: none;
          transition: color 200ms ease;
        }
        .footer-link:hover { color: var(--text-secondary); }
        .footer-copy {
          width: 100%; text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary);
          letter-spacing: 0.08em;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--border-subtle);
        }
        @media (max-width: 640px) {
          .footer-inner { flex-direction: column; align-items: flex-start; }
          .footer-section { padding: 40px 24px; }
        }
      `}</style>

      <footer className="footer-section">
        <div className="footer-inner">
          <span className="footer-brand">KETAN GOEL</span>
          <div className="footer-links">
            <a href="https://linkedin.com/in/ketangoel" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="mailto:ketan@onestopcareers.in" className="footer-link">Contact</a>
            <a href="/privacy" className="footer-link">Privacy</a>
          </div>
          <p className="footer-copy">
            © 2026 Ketan Goel · onestopcareers.in · Built for ambitious professionals who take their thinking seriously.
          </p>
        </div>
      </footer>
    </>
  )
}
