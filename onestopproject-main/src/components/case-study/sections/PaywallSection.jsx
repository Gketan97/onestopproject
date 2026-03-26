import React from 'react';

export default function PaywallSection({ vpText = '', onUnlock, onSkip }) {
  const handlePayment = () => {
    const btn = document.getElementById('pay-btn');
    if (btn) { btn.textContent = 'Processing...'; btn.disabled = true; }

    fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 49900, currency: 'INR', receipt: `osc_phase3_${Date.now()}` }),
    })
      .then(r => r.json())
      .then(order => {
        const opts = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: 'onestopcareers',
          description: 'Phase 3 — Swiggy Advanced Analytics',
          theme: { color: 'var(--phase1)' },
          handler: () => onUnlock(),
          modal: { ondismiss: () => { if (btn) { btn.textContent = 'Unlock Phase 3 — ₹499 →'; btn.disabled = false; } } },
        };
        const load = (cb) => {
          if (window.Razorpay) { cb(); return; }
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = cb;
          document.head.appendChild(s);
        };
        load(() => new window.Razorpay(opts).open());
      })
      .catch(() => { alert('Payment could not be initialised. Please try again.'); if (btn) { btn.textContent = 'Unlock Phase 3 — ₹499 →'; btn.disabled = false; } });
  };

  const IS_DEV = import.meta.env.DEV;

  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-green uppercase">Phase 2 Complete</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Win badge */}
      <div className="flex items-center gap-3 p-4 bg-green-bg border border-green-border rounded-xl mb-4">
        <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center text-white font-bold text-base flex-shrink-0">✓</div>
        <div>
          <p className="text-[14px] font-semibold text-green">You found it — two-cause root cause</p>
          <p className="text-[12px] text-ink2">Quality complaints (~45%) + Zomato promotion (~55%). That was real analytical work.</p>
        </div>
      </div>

      {vpText && (
        <div className="rounded-xl p-4 mb-4 glass">
          <p className="font-mono text-[9px] text-ink3 tracking-widest uppercase mb-2">Your VP message</p>
          <p className="text-[12px] text-ink2 leading-relaxed italic">{vpText.slice(0, 300)}{vpText.length > 300 ? '...' : ''}</p>
        </div>
      )}

      {/* Phase 3 preview */}
      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="bg-surface2 px-4 py-2.5"><p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase">Phase 3 — Advanced analytics · Open workbench</p></div>
        <div className="px-4 py-3">
          <p className="text-[13px] text-ink leading-relaxed mb-2">The North Bangalore fix is live. But the data team surfaced something systemic: <strong>new restaurants are getting top-of-feed visibility with lower ratings</strong>, and users who order from them churn faster.</p>
          <p className="text-[13px] font-medium text-ink">Is this a problem? Quantify it. Design the fix.</p>
        </div>
      </div>

      {/* Features */}
      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="bg-surface2 px-4 py-2.5"><p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase">What ₹499 unlocks</p></div>
        <div className="px-4 py-3 space-y-3">
          {[
            { icon: '📊', title: 'Cohort retention analysis', desc: 'Confirm users who order from new restaurants churn 23% faster. Open workbench — all 10 tables.' },
            { icon: '🔢', title: 'LTV vs GMV quantification', desc: '₹31.7Cr annual LTV loss vs ₹12.4Cr quarterly GMV gain. You build the model.' },
            { icon: '📐', title: 'Restaurant health score design', desc: 'Design from scratch. Handles cold-start. Bayesian rating prior.' },
            { icon: '📄', title: 'Full portfolio export', desc: 'Shareable link with your queries, reasoning, and AI evaluation.' },
          ].map(f => (
            <div key={f.title} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
              <span className="text-base flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-[13px] font-semibold text-ink">{f.title}</p>
                <p className="text-[12px] text-ink2 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA card */}
      <div className="rounded-xl p-4 glass">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-ink font-mono text-2xl font-bold">₹499</p>
            <p className="text-ink3 text-[11px] mt-0.5">One-time · Instant access · No account</p>
          </div>
          <div className="text-right">
            <p className="text-ink3 text-[11px]">vs ₹18–35L roles</p>
            <p className="text-green text-[11px] font-semibold mt-0.5">you're targeting</p>
          </div>
        </div>
        <button
          id="pay-btn"
          onClick={handlePayment}
          className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl text-[15px] hover:bg-accent-dark hover:-translate-y-px transition-all"
        >
          Unlock Phase 3 — ₹499 →
        </button>
        {IS_DEV && (
          <div className="mt-3 p-3 bg-green/10 border border-green/20 rounded-lg">
            <p className="font-mono text-[10px] text-green mb-2">⚡ DEV MODE</p>
            <button onClick={onUnlock} className="w-full py-2 bg-phase2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors">
              Continue to Phase 3 (dev) →
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <button onClick={onSkip} className="text-[13px] text-ink3 underline hover:text-ink2 transition-colors bg-transparent border-0 cursor-pointer font-sans">
          See basic debrief without Phase 3 →
        </button>
      </div>
    </div>
  );
}
