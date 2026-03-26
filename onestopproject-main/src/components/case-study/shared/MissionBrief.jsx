// Sticky mission brief — always noir
import React, { useState } from 'react';
import SlackThread, { SlackMessage } from './SlackThread.jsx';

export default function MissionBrief({ priyaMessages = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-[88px] z-40 rounded-xl mb-3 transition-all mission-brief"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold"
            style={{
              background: 'var(--phase2-bg)',
              color: 'var(--phase2)',
              border: '1px solid var(--phase2-border)',
            }}>
            Phase 2
          </span>
          <span className="text-sm font-medium text-ink">
            North Bangalore · Biryani down 34%
          </span>
          {priyaMessages.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold animate-pulse"
              style={{ background: 'rgba(255,90,101,0.12)', color: '#FF5A65', border: '1px solid rgba(255,90,101,0.25)' }}>
              <span className="w-1 h-1 rounded-full bg-[#FF5A65]" />
              {priyaMessages.length} follow-up{priyaMessages.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-ink3">
          {open ? '▲ Brief' : '▼ Brief'}
        </span>
      </button>

      {open && (
        <div className="px-3.5 pb-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <SlackThread channel="analytics-incident · swiggy data team">
            <SlackMessage initials="PS" name="Priya S." meta="Mon 4:47 PM">
              Good news: overall orders are recovering. Bad news: North Bangalore is still lagging — specifically Biryani. Down 34% vs last Monday. Leadership review in 2 days. Need root cause by EOD.
            </SlackMessage>
            {priyaMessages.map((msg, i) => (
              <SlackMessage key={i} initials="PS" name="Priya S." meta="just now">
                {msg}
              </SlackMessage>
            ))}
          </SlackThread>
        </div>
      )}
    </div>
  );
}
