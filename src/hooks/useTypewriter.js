// src/hooks/useTypewriter.js
// Shared typewriter hook — single source of truth for all animated text.
//
// @param {string} text        — The full string to animate
// @param {object} options
// @param {number} options.speed   — ms per character (default 10)
// @param {boolean} options.trigger — start animating (default true)
//
// @returns {{ displayed: string, done: boolean, skip: () => void }}
//   displayed — the currently visible substring
//   done      — true when animation is complete
//   skip      — call to instantly reveal full text and mark done

import { useState, useEffect, useRef, useCallback } from 'react';

export function useTypewriter(text, { speed = 10, trigger = true } = {}) {
  // Respect prefers-reduced-motion — skip animation entirely
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [displayed, setDisplayed] = useState(() =>
    (!trigger || prefersReduced) ? (text || '') : ''
  );
  const [done, setDone] = useState(() =>
    !trigger || prefersReduced || !text
  );

  const ivRef  = useRef(null);
  const idxRef = useRef(0);

  // Programmatic skip — clears interval, reveals full text immediately
  const skip = useCallback(() => {
    if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; }
    setDisplayed(text || '');
    setDone(true);
  }, [text]);

  useEffect(() => {
    // Clean up any running interval on unmount or dep change
    return () => { if (ivRef.current) clearInterval(ivRef.current); };
  }, []);

  useEffect(() => {
    if (!trigger || !text) {
      setDisplayed(text || '');
      setDone(true);
      return;
    }

    // Reduced motion — show full text immediately
    if (prefersReduced) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    // Reset and start
    idxRef.current = 0;
    setDisplayed('');
    setDone(false);

    ivRef.current = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(ivRef.current);
        ivRef.current = null;
        setDone(true);
      }
    }, speed);

    return () => {
      if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; }
    };
  }, [text, speed, trigger, prefersReduced]);

  return { displayed, done, skip };
}