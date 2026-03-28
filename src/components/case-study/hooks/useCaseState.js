// src/components/case-study/hooks/useCaseState.js
// Manages all persisted state for the Swiggy case study via localStorage.
// Exposes a typed state object + a dispatcher so components never touch storage directly.

import { useState, useCallback } from 'react';

const SK = 'osc_swiggy_v4';

const DEFAULT_STATE = {
  section: 'landing',           // current section id
  gapAnswer: '',
  p1Predictions: {},            // { stepIndex: string }
  p1Framework: '',
  p2Answers: {},                // { stepId: string }
  p2Queries: {},                // { key: sqlText }
  p2QueryCount: 0,
  p3Answers: {},                // { taskId: string }
  p3QueryCount: 0,
  behaviours: { B1:false, B2:false, B3:false, B4:false, B5:false, B6:false, B7:false, B8:false },
  behaviourQuality: {},         // { Bn: 'Strong' | 'Adequate' }
  evidence: {},                 // { Bn: string }
  hints: 0,
  p2StartTime: null,            // ms epoch
  p2ElapsedSeconds: 0,
  isPaid: false,
  completedPhases: [],
  debriefBuilt: false,
  arjunAsks: 0,
  sqlEvalScores: {},            // { stepKey: { attempts, issues } }
  priya1Sent: false,
  priya2Sent: false,
  debriefProfileText: '',
  candidateName: null,
};

function load() {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (_) {}
  return { ...DEFAULT_STATE };
}

function persist(state) {
  try { localStorage.setItem(SK, JSON.stringify(state)); } catch (_) {}
}

export function useCaseState() {
  const [state, setState] = useState(() => load());

  const update = useCallback((patch) => {
    setState(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(SK); } catch (_) {}
    setState({ ...DEFAULT_STATE });
  }, []);

  // Mark a behaviour as demonstrated
  const markBehaviour = useCallback((code, evidence, quality = 'Adequate') => {
    update(prev => ({
      ...prev,
      behaviours:       { ...prev.behaviours,      [code]: true },
      evidence:         { ...prev.evidence,         [code]: evidence },
      behaviourQuality: { ...prev.behaviourQuality, [code]: quality },
    }));
  }, [update]);

  // Record a SQL evaluation result
  const recordSqlEval = useCallback((stepKey, hadIssue) => {
    update(prev => {
      const scores = { ...prev.sqlEvalScores };
      if (!scores[stepKey]) scores[stepKey] = { attempts: 0, issues: 0 };
      scores[stepKey] = { attempts: scores[stepKey].attempts + 1, issues: scores[stepKey].issues + (hadIssue ? 1 : 0) };
      return { ...prev, sqlEvalScores: scores };
    });
  }, [update]);

  return { state, update, reset, markBehaviour, recordSqlEval };
}
