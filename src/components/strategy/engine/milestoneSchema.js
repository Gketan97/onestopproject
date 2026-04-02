// src/components/strategy/engine/milestoneSchema.js
// Contract for every milestone config object.
// MilestoneRunner reads exclusively from this shape — no Swiggy-specific code.

/**
 * @typedef {Object} MilestoneConfig
 * @property {string}   id               - Unique milestone id e.g. 'scope'
 * @property {string}   number           - Display number e.g. '01'
 * @property {string}   title            - Display title
 * @property {string}   arjunOpening     - Arjun's first message when milestone starts
 * @property {string}   arjunQuestion    - Arjun's Socratic follow-up question
 * @property {string}   hint1            - Shown after first wrong attempt
 * @property {string}   hint2            - Shown after second wrong attempt
 * @property {string[]} correctSignals   - Keywords indicating a correct answer
 * @property {string}   successKey       - Mock response key to use on success
 * @property {number}   maxAttempts      - Attempts before force-advance
 * @property {string}   vizType          - 'kpi' | 'funnel' | 'cohort' | 'impact' | 'none'
 * @property {string}   interactionModel - 'text_input' | 'reasoning_then_clickable_kpi' | 'query_then_input' | 'hypothesis_input' | 'calculation_input'
 * @property {string}   synthesisPrompt  - The reflection question shown at milestone end
 * @property {string}   synthesisPlaceholder - Placeholder for synthesis textarea
 * @property {number}   synthesisMin     - Min chars for synthesis submission
 * @property {string}   synthesisColor   - Accent color for synthesis prompt
 */

export const MilestoneSchema = {
  id:                   String,
  number:               String,
  title:                String,
  arjunOpening:         String,
  arjunQuestion:        String,
  hint1:                String,
  hint2:                String,
  correctSignals:       [String],
  successKey:           String,
  maxAttempts:          Number,
  vizType:              String,
  interactionModel:     String,
  synthesisPrompt:      String,
  synthesisPlaceholder: String,
  synthesisMin:         Number,
  synthesisColor:       String,
};

// vizType values
export const VIZ_TYPES = {
  KPI:    'kpi',
  FUNNEL: 'funnel',
  COHORT: 'cohort',
  IMPACT: 'impact',
  NONE:   'none',
};
