// src/components/case-study/hooks/usePhase2Timer.js
// Runs the Phase 2 elapsed timer and fires Priya follow-up messages at 10/20 min.

import { useState, useEffect, useRef } from 'react';

export function usePhase2Timer({ startTime, onPriyaMsg1, onPriyaMsg2, msg1Sent, msg2Sent }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!startTime) return;
    intervalRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(secs);
      if (secs >= 600 && !msg1Sent) onPriyaMsg1?.();
      if (secs >= 1200 && !msg2Sent) onPriyaMsg2?.();
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startTime, msg1Sent, msg2Sent, onPriyaMsg1, onPriyaMsg2]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return { elapsed, formatted: fmt(elapsed) };
}
