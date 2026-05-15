#!/bin/bash
# Run from repo root: bash patch-cohort-refund.sh

python3 << 'PYEOF'
path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()

# Add refund policy style
old_style = "        .cohort-trust {"
new_style = """        .cohort-refund {
          background: rgba(34,197,94,0.07);
          border: 1px solid rgba(34,197,94,0.18);
          border-radius: 10px; padding: 12px 16px;
          margin-bottom: 14px; text-align: center;
        }
        .cohort-refund-text {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #4ade80; line-height: 1.5;
        }
        .cohort-refund-text strong { font-weight: 600; }
        .cohort-trust {"""

src = src.replace(old_style, new_style)

# Add refund div before the trust line in JSX
old_jsx = '              <p className="cohort-trust">'
new_jsx = """              <div className="cohort-refund">
                <p className="cohort-refund-text">
                  <strong>No questions asked refund.</strong> If you are not satisfied after Session 1, we refund you in full.
                </p>
              </div>
              <p className="cohort-trust">"""

src = src.replace(old_jsx, new_jsx)

with open(path, 'w') as f:
    f.write(src)
print('✓ Refund policy added to CohortDetails')
PYEOF

npm run build
