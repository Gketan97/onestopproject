import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .footer-root {
          background: var(--bg-base);
          border-top: 1px solid var(--border-subtle);
          padding: 48px 32px 32px;
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
        }
        .footer-top {
          display: grid; grid-template-columns: 1fr auto auto auto;
          gap: 48px; align-items: start; margin-bottom: 40px;
          padding-bottom: 40px; border-bottom: 1px solid var(--border-subtle);
        }
        .footer-brand {}
        .footer-logo {
          font-family: 'DM Mono', monospace; font-size: 15px;
          letter-spacing: 0.1em; color: var(--text-primary);
          font-weight: 500; cursor: pointer; display: inline-block;
          margin-bottom: 6px;
        }
        .footer-logo span {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer-tagline {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-tertiary); line-height: 1.6; max-width: 260px;
        }
        .footer-col-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 14px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-link {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: var(--text-secondary); background: none; border: none;
          cursor: pointer; padding: 0; text-align: left;
          transition: color 150ms ease; text-decoration: none; display: block;
        }
        .footer-link:hover { color: var(--text-primary); }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .footer-copy {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.06em; color: var(--text-tertiary);
        }
        .footer-legal {
          display: flex; gap: 24px;
        }
        .footer-legal-link {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.06em; color: var(--text-tertiary);
          background: none; border: none; cursor: pointer; padding: 0;
          transition: color 150ms ease;
        }
        .footer-legal-link:hover { color: var(--text-secondary); }
        .footer-refund {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #4ade80; display: flex; align-items: center; gap: 6px;
        }

        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-root { padding: 40px 24px 28px; }
        }
        @media (max-width: 480px) {
          .footer-top { grid-template-columns: 1fr; gap: 28px; }
          .footer-root { padding: 36px 20px 24px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo" onClick={() => navigate('/')}>
                onestop<span>careers</span>
              </div>
              <p className="footer-tagline">
                AI Problem Solving Lab. Built for professionals who want to think better — not just use better tools.
              </p>
            </div>

            <div>
              <p className="footer-col-label">NAVIGATE</p>
              <div className="footer-links">
                <button className="footer-link" onClick={() => navigate('/')}>Home</button>
                <button className="footer-link" onClick={() => navigate('/lab')}>The Lab</button>
                <button className="footer-link" onClick={() => navigate('/diagnostic')}>Free Diagnostic</button>
              </div>
            </div>

            <div>
              <p className="footer-col-label">ABOUT</p>
              <div className="footer-links">
                <a className="footer-link" href="https://linkedin.com/in/ketangoel" target="_blank" rel="noopener noreferrer">
                  Ketan on LinkedIn
                </a>
                <a className="footer-link" href="https://topmate.io/ketangoel" target="_blank" rel="noopener noreferrer">
                  Topmate Sessions
                </a>
              </div>
            </div>

            <div>
              <p className="footer-col-label">GUARANTEE</p>
              <p className="footer-refund">✓ No questions asked refund</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, lineHeight: 1.6 }}>
                If you are not satisfied after Session 1, we refund you in full. No conditions.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© {year} onestopcareers. All rights reserved.</span>
            <div className="footer-legal">
              <button className="footer-legal-link" onClick={() => alert('Terms of Service — Coming soon')}>Terms of Service</button>
              <button className="footer-legal-link" onClick={() => alert('Privacy Policy — Coming soon')}>Privacy Policy</button>
              <a className="footer-legal-link" href="mailto:ketan@onestopcareers.in">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
