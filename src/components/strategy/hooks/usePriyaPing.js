// src/components/strategy/hooks/usePriyaPing.js

import { useEffect, useRef } from 'react';

function buildPriyaPing(milestoneIndex, elapsedMs) {
  const elapsedMin  = Math.floor(elapsedMs / 60000);
  const lossRupees  = Math.round((elapsedMs / 1000) * 1200);
  const lossDisplay = lossRupees >= 100000
    ? `₹${(lossRupees / 100000).toFixed(1)}L`
    : `₹${lossRupees.toLocaleString('en-IN')}`;

  const pings = [
    `Hey — we're at ${elapsedMin} minutes on this. The counter's at ${lossDisplay} and climbing. VP wants something in 30. Where are you?`,
    `Still here. ${lossDisplay} gone since incident started. Need a number I can take upstairs.`,
    `Checking in — ${lossDisplay} total exposure now. Even a directional answer is better than silence. Go.`,
    `${lossDisplay} and rising. What's the one thing you're most confident about right now?`,
  ];

  return pings[Math.min(milestoneIndex, pings.length - 1)];
}

export function usePriyaPing(milestoneIndex, hasFired, onPing) {
  const startTimeRef = useRef(Date.now());
  const firedRef     = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    firedRef.current     = false;
  }, [milestoneIndex]);

  useEffect(() => {
    if (firedRef.current) return;
    const PING_DELAY_MS = 5 * 60 * 1000;
    const t = setTimeout(() => {
      if (firedRef.current) return;
      firedRef.current = true;
      const elapsed  = Date.now() - startTimeRef.current;
      const pingText = buildPriyaPing(milestoneIndex, elapsed);
      onPing?.({ role: 'priya', text: pingText, isNew: true, meta: 'just now' });
    }, PING_DELAY_MS);
    return () => clearTimeout(t);
  }, [milestoneIndex, onPing]);
}
