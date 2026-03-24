// src/components/case-study/hooks/useP2Timer.js
// Manages the Phase 2 elapsed timer and fires the two evolving Priya messages.

import { useState, useEffect, useRef } from 'react';

export function useP2Timer({ startTime, onPriyaMessage, priya1Sent, priya2Sent }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!startTime) return;
    intervalRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(s);
      if (s >= 600 && !priya1Sent) {
        onPriyaMessage(1, 'Any early signals? The VP is asking about timeline.');
      }
      if (s >= 1200 && !priya2Sent) {
        onPriyaMessage(2, 'I have the leadership channel open. Please share anything — even partial findings.');
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startTime, priya1Sent, priya2Sent, onPriyaMessage]);

  const fmt = (sec) => {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return { elapsed, fmtElapsed: fmt(elapsed) };
}
