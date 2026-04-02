// src/hooks/useCase.js
// CP6-B: Hook to load a case config by id from the registry.
// Handles loading + error states. Used by StrategyCase.jsx.

import { useState, useEffect } from 'react';
import { loadCase } from '../data/cases/caseRegistry.js';

/**
 * Load a case config lazily by caseId.
 * @param {string} caseId - e.g. 'swiggy' | 'zomato'
 * @returns {{ caseConfig: object|null, loading: boolean, error: Error|null }}
 */
export function useCase(caseId) {
  const [caseConfig, setCaseConfig] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    setError(null);
    setCaseConfig(null);
    loadCase(caseId)
      .then(config => { setCaseConfig(config); setLoading(false); })
      .catch(err   => { setError(err);          setLoading(false); });
  }, [caseId]);

  return { caseConfig, loading, error };
}
