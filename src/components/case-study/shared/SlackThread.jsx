// Slack-style message thread used throughout all phases for stakeholder messages
import React from 'react';

const AVATAR_STYLES = {
  PS: 'bg-phase2-bg text-phase2',
  AJ: 'bg-phase1-bg text-phase1',
  IV: 'bg-ink text-white',
  YOU: 'bg-surface2 text-ink2',
};

export function SlackMessage({ initials, name, meta, children }) {
  const avatarClass = AVATAR_STYLES[initials] || 'bg-surface2 text-ink2';
  return (
    <div className="flex gap-2.5 mb-2.5 last:mb-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 ${avatarClass}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className="text-xs font-semibold text-ink">{name}</span>
          {meta && <span className="text-[10px] text-ink3">{meta}</span>}
        </div>
        <p className="text-[13px] text-ink leading-relaxed whitespace-pre-wrap">{children}</p>
      </div>
    </div>
  );
}

export default function SlackThread({ channel, children, className = '' }) {
  return (
    <div className={`bg-surface border border-border rounded-xl p-3.5 mb-4 ${className}`}>
      {channel && (
        <p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase mb-3">
          # {channel}
        </p>
      )}
      {children}
    </div>
  );
}
