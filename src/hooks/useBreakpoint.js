// src/hooks/useBreakpoint.js

import { useState, useEffect } from 'react';

export function useIsMobile(threshold = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < threshold);

  useEffect(() => {
    const mql     = window.matchMedia(`(max-width: ${threshold - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [threshold]);

  return isMobile;
}