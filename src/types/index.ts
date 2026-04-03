// ============================================================
// ONESTOP CAREERS — CORE TYPE SYSTEM
// All platform interfaces defined here. No types elsewhere.
// ============================================================

// ------------------------------------------------------------
// CASE STUDY ENGINE
// ------------------------------------------------------------

export type MilestoneType =
  | 'problem_scoping'
  | 'kpi_selection'
  | 'funnel_diagnosis'
  | 'root_cause'
  | 'impact_sizing'
  | 'solution_design'
  | 'stakeholder_review';

export type InvestigationPath =
  | 'customer_journey'
  | 'pricing_changes'
  | 'supplier_failures'
  | 'cohort_analysis'
  | 'funnel_drop';

export type CaseStatus = 'locked' | 'active' | 'completed';
export type MilestoneStatus = 'pending' | 'active' | 'completed' | 'skipped';

export interface MilestoneConfig {
  id: string;
  type: MilestoneType;
  title: string;
  description: string;
  order: number;
  requiredPriorMilestones: string[];
  availableQueries: string[];
  scoringRubric: ScoringRubric;
  exitCondition: ExitCondition;
}

export interface ExitCondition {
  minScore: number;
  requiredFields: string[];
  maxTurns?: number;
}

export interface CaseConfig {
  caseId: string;
  title: string;
  company: string;
  domain: 'travel' | 'food_delivery' | 'ecommerce' | 'streaming' | 'rideshare';
  difficulty: 'junior' | 'senior' | 'staff';
  estimatedMinutes: number;
  problemBrief: string;
  scenarioContext: string;
  investigationPaths: InvestigationPath[];
  milestones: MilestoneConfig[];
  groundTruth: GroundTruth;
  datasetManifest: DatasetManifest;
  mentorPersona: MentorPersona;
  stakeholderPersonas: StakeholderPersona[];
  skills: string[];
}

export interface GroundTruth {
  rootCause: string;
  affectedMetrics: string[];
  anomalyStartWeek: number;
  anomalyEndWeek?: number;
  expectedFindings: string[];
}

// ------------------------------------------------------------
// DATASET + DATA LAYER
// ------------------------------------------------------------

export interface DatasetManifest {
  basePath: string;
  tables: TableDefinition[];
  totalRows: number;
}

export interface TableDefinition {
  name: string;
  file: string;
  schema: ColumnDefinition[];
  rowCount: number;
  description: string;
}

export interface ColumnDefinition {
  name: string;
  type: 'INTEGER' | 'VARCHAR' | 'DOUBLE' | 'BOOLEAN' | 'TIMESTAMP' | 'DATE';
  nullable: boolean;
  description: string;
}

// ------------------------------------------------------------
// DUCKDB ANALYTICS ENGINE
// ------------------------------------------------------------

export interface QueryDefinition {
  queryId: string;
  milestoneType: MilestoneType;
  description: string;
  sql: string;
  outputSchema: QueryOutputSchema;
  metricKeys: string[];
}

export interface QueryOutputSchema {
  columns: { name: string; type: string }[];
}

export interface AggregatedMetrics {
  queryId: string;
  milestoneType: MilestoneType;
  executedAt: number;
  metrics: Record<string, number | string | null>;
  rowCount: number;
  executionMs: number;
}

export interface DuckDBEngineState {
  initialized: boolean;
  tablesLoaded: string[];
  error: string | null;
}

// ------------------------------------------------------------
// AI SERVICE LAYER
// ------------------------------------------------------------

export type AgentMode = 'mentor' | 'stakeholder';

export interface MentorPersona {
  name: string;
  role: string;
  company: string;
  tone: 'socratic' | 'direct' | 'challenging';
  traits: string[];
}

export interface StakeholderPersona {
  id: string;
  name: string;
  role: string;
  challengeStyle: 'skeptical' | 'aggressive' | 'analytical';
  focusAreas: string[];
}

export interface AIPromptPayload {
  agentMode: AgentMode;
  milestoneType: MilestoneType;
  milestoneTitle: string;
  caseContext: CasePromptContext;
  aggregatedMetrics?: AggregatedMetrics;
  userResponse: string;
  conversationHistory: ConversationTurn[];
  investigationBoard: InvestigationBoard;
  detectedMistakes: string[];
  scoreSoFar: number;
}

export interface CasePromptContext {
  caseId: string;
  company: string;
  problemBrief: string;
  currentMilestone: string;
  investigationPath: InvestigationPath;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  milestoneId: string;
  timestamp: number;
}

export interface AIResponse {
  content: string;
  milestoneId: string;
  scoreDelta: ScoreDelta | null;
  suggestedNextAction: SuggestedAction | null;
  boardUpdates: Partial<InvestigationBoard> | null;
  detectedMistakes: string[];
}

export interface SuggestedAction {
  type: 'run_query' | 'advance_milestone' | 'revisit' | 'none';
  queryId?: string;
  reason: string;
}

// ------------------------------------------------------------
// INVESTIGATION BOARD
// ------------------------------------------------------------

export interface InvestigationBoard {
  caseId: string;
  problem: string;
  findings: Finding[];
  hypotheses: Hypothesis[];
  insights: Insight[];
  solutions: Solution[];
  lastUpdated: number;
}

export interface Finding {
  id: string;
  milestoneId: string;
  text: string;
  supportingMetrics: AggregatedMetrics | null;
  confidence: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface Hypothesis {
  id: string;
  milestoneId: string;
  text: string;
  status: 'proposed' | 'supported' | 'rejected';
  evidence: string[];
  createdAt: number;
}

export interface Insight {
  id: string;
  milestoneId: string;
  text: string;
  dataReference: string | null;
  createdAt: number;
}

export interface Solution {
  id: string;
  milestoneId: string;
  text: string;
  estimatedImpact: string;
  effort: 'low' | 'medium' | 'high';
  createdAt: number;
}

// ------------------------------------------------------------
// SKILL SCORING ENGINE
// ------------------------------------------------------------

export interface ScoringRubric {
  problemFraming: number;
  dataInterpretation: number;
  hypothesisQuality: number;
  solutionImpact: number;
  maxScore: number;
}

export interface ScoreDelta {
  problemFraming: number;
  dataInterpretation: number;
  hypothesisQuality: number;
  solutionImpact: number;
  total: number;
  rationale: string;
}

export interface AnalystSkillProfile {
  userId: string;
  totalScore: number;
  casesCompleted: string[];
  skills: SkillEntry[];
  scorecard: Scorecard;
  lastUpdated: number;
}

export interface SkillEntry {
  skillId: string;
  label: string;
  verified: boolean;
  caseId: string;
  earnedAt: number;
}

export interface Scorecard {
  problemFraming: number;
  dataInterpretation: number;
  hypothesisQuality: number;
  solutionImpact: number;
}

// ------------------------------------------------------------
// SIMULATION STATE MACHINE
// ------------------------------------------------------------

export interface SimulationState {
  caseId: string;
  status: CaseStatus;
  currentMilestoneId: string;
  milestoneStates: Record<string, MilestoneState>;
  investigationPath: InvestigationPath;
  board: InvestigationBoard;
  profile: AnalystSkillProfile;
  conversation: ConversationTurn[];
  startedAt: number;
  completedAt: number | null;
}

export interface MilestoneState {
  milestoneId: string;
  status: MilestoneStatus;
  turns: number;
  score: number;
  scoreDelta: ScoreDelta | null;
  queriesRun: string[];
  startedAt: number | null;
  completedAt: number | null;
}

export type SimulationEvent =
  | { type: 'START_CASE'; caseId: string }
  | { type: 'USER_RESPONSE'; content: string }
  | { type: 'QUERY_EXECUTED'; metrics: AggregatedMetrics }
  | { type: 'ADVANCE_MILESTONE'; milestoneId: string }
  | { type: 'COMPLETE_CASE' }
  | { type: 'RESET' };

// ------------------------------------------------------------
// MISTAKE DETECTION
// ------------------------------------------------------------

export interface MistakePattern {
  id: string;
  label: string;
  description: string;
  trigger: (board: InvestigationBoard, metrics: AggregatedMetrics) => boolean;
  feedback: string;
}

// ------------------------------------------------------------
// MILESTONE PHASE SYSTEM
// Each milestone has 3 phases: teach → investigate → commit
// User cannot skip phases. Quality gate on commit.
// ------------------------------------------------------------

export type MilestonePhase = 'teach' | 'investigate' | 'commit';

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string; // shown after selection — right or wrong
}

export interface TeachingConcept {
  heading: string;
  body: string;           // plain text, max 3 sentences
  analogy?: string;       // optional real-world hook
}

export interface MilestoneTeachingContent {
  milestoneType: MilestoneType;
  arjunIntro: string;     // Arjun's opening in his voice
  concepts: TeachingConcept[]; // max 3
  checkpointQuestion: string;
  options: MCQOption[];   // exactly 3-4
  investigationNudge: string; // Arjun's first message when investigation opens
  commitPrompt: string;   // what Arjun asks user to document
  commitDepthQuestion: string; // follow-up if entry is too shallow
}

export interface MilestonePhaseState {
  phase: MilestonePhase;
  checkpointPassed: boolean;
  commitText: string;          // user's written finding
  commitAccepted: boolean;     // passed depth gate
  depthChallengeShown: boolean; // has Arjun challenged shallow entry
}
