// src/components/case-study/hooks/useCaseStudyState.js
// Persists the full case study state to localStorage.
// Returns [state, updater] — updater merges a partial object and saves.

import { useState, useCallback } from 'react';

const SK = 'osc_swiggy_v5';

const DEFAULTS = {
  // Navigation
  currentSection: 'landing',
  p2Step: 0,
  // Gap exercise
  gapAnswer: '',
  // Phase 1
  p1Predictions: {},
  p1Framework: '',
  // Phase 2
  p2ClarifyPre: '',
  p2Answers: {},
  p2Queries: {},
  p2QueryCount: 0,
  p2StartTime: null,
  p2ElapsedSeconds: 0,
  p2PriyaMsg1Sent: false,
  p2PriyaMsg2Sent: false,
  // Phase 3
  p3Answers: {},
  p3QueryCount: 0,
  // Scoring
  behaviours: { B1: false, B2: false, B3: false, B4: false, B5: false, B6: false, B7: false, B8: false },
  behaviourQuality: {},
  evidence: {},
  hints: 0,
  sqlEvalScores: {},
  // Payment & completion
  isPaid: false,
  completedPhases: [],
  _debriefBuilt: false,
  _debriefProfileText: '',
  arjunAsks: 0,
  candidateName: null,
  paymentId: null,
};

function load() {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (_) {}
  return { ...DEFAULTS };
}

function save(state) {
  try { localStorage.setItem(SK, JSON.stringify(state)); } catch (_) {}
}

export function useCaseStudyState() {
  const [state, _setState] = useState(() => load());

  const setState = useCallback((partial) => {
    _setState(prev => {
      // Support functional updater or plain object
      const next = typeof partial === 'function'
        ? { ...prev, ...partial(prev) }
        : { ...prev, ...partial };
      save(next);
      return next;
    });
  }, []);

  // Helper: mark a behaviour as demonstrated
  const setBehaviour = useCallback((code, evidence, quality = 'Adequate') => {
    setState(prev => ({
      behaviours: { ...prev.behaviours, [code]: true },
      evidence: { ...prev.evidence, [code]: evidence },
      behaviourQuality: { ...prev.behaviourQuality, [code]: quality },
    }));
  }, [setState]);

  // Helper: reset state (start over)
  const resetState = useCallback(() => {
    try { localStorage.removeItem(SK); } catch (_) {}
    _setState({ ...DEFAULTS });
  }, []);

  return { state, setState, setBehaviour, resetState };
}
