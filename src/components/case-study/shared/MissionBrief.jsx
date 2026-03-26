// Sticky mission brief — dark mode aware, shows Priya follow-up messages
import React, { useState } from 'react';
import SlackThread, { SlackMessage } from './SlackThread.jsx';

export default function MissionBrief({ priyaMessages = [], dark = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`sticky top-[88px] z-40 rounded-xl mb-3 transition-all mission-brief`}
      style={{
        background: dark ? '#13161D' : 'var(--surface)',
        border: `1px solid ${dark ? '#1E2330' : 'var(--border)'}`,
        boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : 'var(--card)',
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold"
            style={{
              background: dark ? 'rgba(79,128,255,0.12)' : 'var(--blue-bg)',
              color: dark ? '#4F80FF' : 'var(--phase2)',
              border: `1px solid ${dark ? 'rgba(79,128,255,0.25)' : 'var(--blue-border)'}`,
            }}>
            Phase 2
          </span>
          <span className="text-sm font-medium" style={{ color: dark ? '#E2E8F0' : 'var(--ink)' }}>
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
        <span className="font-mono text-[10px]" style={{ color: dark ? '#4A5568' : 'var(--ink3)' }}>
          {open ? '▲ Brief' : '▼ Brief'}
        </span>
      </button>

      {open && (
        <div className="px-3.5 pb-3 pt-3" style={{ borderTop: `1px solid ${dark ? '#1E2330' : 'var(--border)'}` }}>
          <SlackThread channel="analytics-incident · swiggy data team" dark={dark}>
            <SlackMessage initials="PS" name="Priya S." meta="Mon 4:47 PM" dark={dark}>
              Good news: overall orders are recovering. Bad news: North Bangalore is still lagging — specifically Biryani. Down 34% vs last Monday. Leadership review in 2 days. Need root cause by EOD.
            </SlackMessage>
            {priyaMessages.map((msg, i) => (
              <SlackMessage key={i} initials="PS" name="Priya S." meta="just now" dark={dark}>
                {msg}
              </SlackMessage>
            ))}
          </SlackThread>
        </div>
      )}
    </div>
  );
}
