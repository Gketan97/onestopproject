// src/data/cases/caseRegistry.js
// CP6-A: Lazy-loading case registry.
// Adding a new case = create the config file + one line here.
// Each case loads only when its route is hit — bundle stays flat at 20+ cases.

/**
 * @typedef {Object} CaseLoader
 * @type {Record<string, () => Promise<object>>}
 */
const CASE_REGISTRY = {
  swiggy: () => import('./swiggy.js').then(m => m.SWIGGY_CASE),
  zomato: () => import('./zomato.js').then(m => m.ZOMATO_CASE),
};

/**
 * Load a case config by id.
 * @param {string} caseId
 * @returns {Promise<object>} the case config
 */
export async function loadCase(caseId) {
  const loader = CASE_REGISTRY[caseId];
  if (!loader) throw new Error(`Case not found: ${caseId}`);
  return loader();
}

export const AVAILABLE_CASES = Object.keys(CASE_REGISTRY);
