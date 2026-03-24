// src/components/case-study/hooks/useP2Timer.js
// Manages the Phase 2 elapsed timer and fires the two Priya follow-up messages.
// Bug 9 fix: onPriyaMessage(n, msgText) — both args forwarded to parent.
// Bug 10 fix: onTick(elapsedSeconds) called every 30s so refresh doesn't lose time.

import { useState, useEffect, useRef } from 'react';

export function useP2Timer({ startTime, onPriyaMessage, onTick, priya1Sent, priya2Sent }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const lastTickSave = useRef(0);

  useEffect(() => {
    if (!startTime) return;
    intervalRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(s);

      // Priya follow-up messages at 10 min and 20 min
      if (s >= 600 && !priya1Sent) {
        onPriyaMessage?.(1, 'Any early signals? The VP is asking about timeline.');
      }
      if (s >= 1200 && !priya2Sent) {
        onPriyaMessage?.(2, 'I have the leadership channel open. Please share anything — even partial findings.');
      }

      // Persist elapsed to state every 30 s so a refresh doesn't lose it
      if (s - lastTickSave.current >= 30) {
        lastTickSave.current = s;
        onTick?.(s);
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startTime, priya1Sent, priya2Sent, onPriyaMessage, onTick]);

  const fmt = (sec) => {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return { elapsed, fmtElapsed: fmt(elapsed) };
}
