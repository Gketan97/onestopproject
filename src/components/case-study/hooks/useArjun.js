// src/components/case-study/hooks/useArjun.js
// Calls the server-side /.netlify/functions/evaluate endpoint.
// In DEV mode, returns mock responses instantly from swiggyData.js.

import { useCallback } from 'react';
import { MOCK, ARJUN_SYS } from '../data/swiggyData.js';

const IS_DEV = true; // flip to false for production

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function useArjun() {
  const callArjun = useCallback(async (prompt, mockKey) => {
    if (IS_DEV) {
      await delay(700);
      const m = MOCK[mockKey];
      if (!m) return 'Good work on this step.';
      return typeof m === 'object' ? (m.feedback || m.label || JSON.stringify(m)) : m;
    }
    try {
      const res = await fetch('/.netlify/functions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: ARJUN_SYS,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
        }),
      });
      const data = await res.json();
      return data.content?.[0]?.text || '';
    } catch (e) {
      const m = MOCK[mockKey];
      return typeof m === 'object' ? (m.feedback || '') : (m || '');
    }
  }, []);

  return { callArjun, IS_DEV };
}
