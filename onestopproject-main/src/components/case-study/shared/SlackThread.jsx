// Slack-style message thread — staggered entrances, dark mode aware
import React from 'react';

const AVATAR_STYLES = {
  PS: { light: 'bg-phase2-bg text-phase2', dark: 'bg-[#4F80FF]/20 text-[#4F80FF]' },
  AJ: { light: 'bg-phase1-bg text-phase1', dark: 'bg-[#4F80FF]/20 text-[#4F80FF]' },
  IV: { light: 'bg-ink text-white',        dark: 'bg-white/10 text-white' },
  PR: { light: 'bg-red-bg text-red',       dark: 'bg-[#FF5A65]/20 text-[#FF5A65]' },
  YOU:{ light: 'bg-surface2 text-ink2',    dark: 'bg-white/5 text-[#94A3B8]' },
};

export function SlackMessage({ initials, name, meta, children, dark = false }) {
  const styles = AVATAR_STYLES[initials] || AVATAR_STYLES.YOU;
  const avatarClass = dark ? styles.dark : styles.light;

  return (
    <div className="flex gap-2.5 mb-2.5 last:mb-0 block-enter">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 ${avatarClass}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className={`text-xs font-semibold ${dark ? 'text-[#E2E8F0]' : 'text-ink'}`}>{name}</span>
          {meta && <span className={`text-[10px] ${dark ? 'text-[#4A5568]' : 'text-ink3'}`}>{meta}</span>}
        </div>
        <p className={`text-[13px] leading-relaxed whitespace-pre-wrap ${dark ? 'text-[#94A3B8]' : 'text-ink'}`}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function SlackThread({ channel, children, className = '', dark = false }) {
  return (
    <div className={`rounded-xl p-3.5 mb-4 ${className}`} style={{
      background: dark ? '#13161D' : 'var(--surface)',
      border: `1px solid ${dark ? '#1E2330' : 'var(--border)'}`,
    }}>
      {channel && (
        <p className="font-mono text-[9px] font-semibold tracking-widest uppercase mb-3"
          style={{ color: dark ? '#4A5568' : 'var(--ink3)' }}>
          # {channel}
        </p>
      )}
      {children}
    </div>
  );
}
