// src/components/strategy/hooks/useStrategyState.js
// Phase machine for the Strategic Incident Simulator
// Phases: triage → deepdive → master → memo → complete

import { useState, useCallback } from 'react';

const SK = 'osc_strategy_v1';

const DEFAULT = {
  phase: 'triage',         // triage | deepdive | master | memo | complete
  triageStep: 0,            // 0=briefing 1=hypothesis 2=scoping 3=done
  deepdiveQuery: '',        // last NL query
  deepdiveViz: null,        // 'funnel' | 'cohort' | 'impact' | null
  deepdiveInsight: '',      // user's written insight
  masterSizing: '',         // user's impact sizing answer
  masterMemo: '',           // user's executive memo draft
  memoUrl: null,            // generated portfolio link
  arjunMessages: [],        // [{ role: 'arjun'|'user', text, ts }]
  behaviours: {},           // { B1: true/false, ... } — tracks quality signals
  startTime: null,
  completedAt: null,
};

function load() {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch (_) {}
  return { ...DEFAULT };
}

function persist(state) {
  try { localStorage.setItem(SK, JSON.stringify(state)); } catch (_) {}
}

export function useStrategyState() {
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
    setState({ ...DEFAULT });
  }, []);

  // Add a message to the Arjun chat thread
  const addMessage = useCallback((role, text) => {
    update(prev => ({
      ...prev,
      arjunMessages: [
        ...prev.arjunMessages,
        { role, text, ts: Date.now() },
      ],
    }));
  }, [update]);

  // Advance the triage phase step
  const advanceTriage = useCallback(() => {
    update(prev => ({
      ...prev,
      phase: 'deepdive',
      startTime: prev.startTime || Date.now(),
    }));
  }, [update]);

  // Set the deepdive visualizer
  const setViz = useCallback((vizType) => {
    update(prev => ({ ...prev, deepdiveViz: vizType }));
  }, [update]);

  // Advance to master phase
  const advanceToMaster = useCallback(() => {
    update(prev => ({ ...prev, phase: 'master', deepdiveViz: null }));
  }, [update]);

  // Generate memo URL and advance to complete
  const generateMemo = useCallback((memoText) => {
    const id = `osc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const url = `${window.location.origin}/portfolio/${id}`;
    update(prev => ({
      ...prev,
      phase: 'complete',
      masterMemo: memoText,
      memoUrl: url,
      completedAt: Date.now(),
    }));
    return url;
  }, [update]);

  // Mark a behaviour observed
  const markBehaviour = useCallback((code) => {
    update(prev => ({
      ...prev,
      behaviours: { ...prev.behaviours, [code]: true },
    }));
  }, [update]);

  return {
    state,
    update,
    reset,
    addMessage,
    advanceTriage,
    setViz,
    advanceToMaster,
    generateMemo,
    markBehaviour,
  };
}
