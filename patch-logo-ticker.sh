#!/bin/bash
# Run from repo root: bash patch-logo-ticker.sh

python3 << 'PYEOF'
path = 'src/components/TruthStatement.tsx'
with open(path, 'r') as f:
    src = f.read()

# Remove old COMPANIES const and ticker section, replace with logo ticker

old_companies = """const COMPANIES = [
  'Flipkart', 'MakeMyTrip', 'Zomato', 'Nykaa', 'American Express',
  'JP Morgan', 'Meesho', 'Zepto', 'PhonePe', 'McKinsey',
  'Goldman Sachs', 'BCG', 'Meta', 'Swiggy', 'HDFC Bank',
  'Razorpay', 'CRED', 'Blinkit', 'Groww', 'Paytm',
]"""

new_companies = """const COMPANIES = [
  { name: 'Flipkart', domain: 'flipkart.com' },
  { name: 'Zomato', domain: 'zomato.com' },
  { name: 'MakeMyTrip', domain: 'makemytrip.com' },
  { name: 'Nykaa', domain: 'nykaa.com' },
  { name: 'American Express', domain: 'americanexpress.com' },
  { name: 'JP Morgan', domain: 'jpmorgan.com' },
  { name: 'PhonePe', domain: 'phonepe.com' },
  { name: 'McKinsey', domain: 'mckinsey.com' },
  { name: 'Goldman Sachs', domain: 'goldmansachs.com' },
  { name: 'BCG', domain: 'bcg.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Razorpay', domain: 'razorpay.com' },
  { name: 'CRED', domain: 'cred.club' },
  { name: 'Groww', domain: 'groww.in' },
  { name: 'Zepto', domain: 'zeptonow.com' },
  { name: 'Blinkit', domain: 'blinkit.com' },
  { name: 'Swiggy', domain: 'swiggy.com' },
  { name: 'HDFC Bank', domain: 'hdfcbank.com' },
]"""

src = src.replace(old_companies, new_companies)

# Replace ticker CSS — add logo styles
old_ticker_css = """        /* Ticker */
        .truth-ticker-wrap {
          overflow: hidden; padding: 28px 0;
          border-top: 1px solid var(--border-subtle);
          position: relative; margin-top: 0;
        }
        .truth-ticker-wrap::before,
        .truth-ticker-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 140px; z-index: 2; pointer-events: none;
        }
        .truth-ticker-wrap::before { left: 0; background: linear-gradient(to right, var(--bg-surface), transparent); }
        .truth-ticker-wrap::after { right: 0; background: linear-gradient(to left, var(--bg-surface), transparent); }
        .truth-ticker-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary);
          text-align: center; margin-bottom: 18px;
        }
        .truth-ticker {
          display: flex; animation: ticker-scroll 30s linear infinite;
          width: max-content;
        }
        .truth-ticker:hover { animation-play-state: paused; }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .truth-ticker-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0 32px; white-space: nowrap;
        }
        .truth-ticker-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(168,85,247,0.4); flex-shrink: 0;
        }
        .truth-ticker-name {
          font-family: 'DM Mono', monospace; font-size: 13px;
          letter-spacing: 0.08em; color: var(--text-secondary); font-weight: 500;
        }"""

new_ticker_css = """        /* Ticker */
        .truth-ticker-wrap {
          overflow: hidden; padding: 32px 0;
          border-top: 1px solid var(--border-subtle);
          position: relative; margin-top: 0;
          background: var(--bg-surface);
        }
        .truth-ticker-wrap::before,
        .truth-ticker-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 160px; z-index: 2; pointer-events: none;
        }
        .truth-ticker-wrap::before { left: 0; background: linear-gradient(to right, var(--bg-surface), transparent); }
        .truth-ticker-wrap::after { right: 0; background: linear-gradient(to left, var(--bg-surface), transparent); }
        .truth-ticker-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary);
          text-align: center; margin-bottom: 20px;
        }
        .truth-ticker {
          display: flex; align-items: center;
          animation: ticker-scroll 35s linear infinite;
          width: max-content;
        }
        .truth-ticker:hover { animation-play-state: paused; }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .truth-ticker-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0 28px; white-space: nowrap;
          opacity: 0.7; transition: opacity 200ms ease;
        }
        .truth-ticker-item:hover { opacity: 1; }
        .truth-ticker-logo {
          width: 24px; height: 24px; border-radius: 6px;
          object-fit: contain; background: white; padding: 2px;
          flex-shrink: 0;
        }
        .truth-ticker-logo-err { display: none; }
        .truth-ticker-name {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 500; color: var(--text-secondary);
        }
        .truth-ticker-sep {
          width: 1px; height: 20px; background: var(--border-subtle);
          margin: 0 4px; flex-shrink: 0;
        }"""

src = src.replace(old_ticker_css, new_ticker_css)

# Replace ticker JSX
old_ticker_jsx = """        {/* Ticker */}
        <div className="truth-ticker-wrap">
          <p className="truth-ticker-label">PROFESSIONALS FROM THESE COMPANIES ARE BUILDING THIS SKILL</p>
          <div className="truth-ticker">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className="truth-ticker-item">
                <span className="truth-ticker-dot" />
                <span className="truth-ticker-name">{c}</span>
              </div>
            ))}
          </div>
        </div>"""

new_ticker_jsx = """        {/* Ticker */}
        <div className="truth-ticker-wrap">
          <p className="truth-ticker-label">PROFESSIONALS FROM THESE ORGANISATIONS ARE BUILDING THIS SKILL</p>
          <div className="truth-ticker">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className="truth-ticker-item">
                <img
                  className="truth-ticker-logo"
                  src={`https://logo.clearbit.com/${c.domain}`}
                  alt={c.name}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="truth-ticker-name">{c.name}</span>
                {i !== COMPANIES.length * 2 - 1 && <span className="truth-ticker-sep" />}
              </div>
            ))}
          </div>
        </div>"""

src = src.replace(old_ticker_jsx, new_ticker_jsx)

with open(path, 'w') as f:
    f.write(src)
print('✓ Logo ticker applied')
PYEOF

npm run build && echo "✅ Done — push to see logos live"
