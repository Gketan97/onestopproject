# PROJECT STATE — OneStopCareers AI Case Platform

Last updated: CP0 complete

---

## COMPLETED MODULES

### CP0 — Repository + Architecture Setup

| File | Purpose | Status |
|------|---------|--------|
| `src/types/index.ts` | Complete TypeScript type system — all interfaces | done |
| `cases/makemytrip_revenue_leak/config/case_config.json` | MMT case config — 7 milestones, ground truth, personas | done |
| `cases/makemytrip_revenue_leak/queries/all_queries.sql` | All SQL queries for MMT case | done |
| `src/services/ai/promptBuilders.ts` | All prompt builders, system prompts, response parser | done |
| `src/services/simulation/stateMachine.ts` | State machine reducer, board updater, score updater | done |
| `src/services/analytics/types.ts` | DuckDB engine interface + MMT query manifest | done |
| `src/services/analytics/datasetLoader.ts` | Dataset loader interface + lazy load strategy | done |

---

## PENDING MODULES

### CP1 — Repository Setup + Config
- [ ] package.json (Next.js 14, TypeScript, Tailwind, DuckDB WASM, Framer Motion)
- [ ] tsconfig.json strict mode
- [ ] tailwind.config.ts with SaaS-Noir design tokens
- [ ] next.config.ts (static export + Netlify config)
- [ ] netlify.toml
- [ ] .env.example

### CP2 — Python Data Generator
- [ ] scripts/generate_mmt_dataset.py
- [ ] CSV output: all 10 tables, 81k rows
- [ ] Anomaly injection at week 16 (pricing bug)
- [ ] Referential integrity validation

### CP3 — DuckDB Engine Implementation
- [ ] src/services/analytics/DuckDBEngine.ts
- [ ] src/services/analytics/QueryRunner.ts
- [ ] src/hooks/useDuckDB.ts

### CP4 — Case Engine Implementation
- [ ] src/services/simulation/CaseEngine.ts
- [ ] src/services/simulation/MistakeDetector.ts
- [ ] src/hooks/useSimulation.ts

### CP5 — AI Service Implementation
- [ ] src/services/ai/AIClient.ts
- [ ] netlify/functions/ai-proxy.ts
- [ ] src/hooks/useAI.ts

### CP6 — UI Assembly
- [ ] Design system tokens in index.css
- [ ] Three-panel layout
- [ ] Chat interface
- [ ] Investigation Board component
- [ ] Milestone strip
- [ ] Chart components (funnel, trend, table)
- [ ] Skill scorecard

### CP7 — Audit + Deploy
- [ ] TypeScript strict audit (zero errors)
- [ ] Bundle analysis (DuckDB WASM lazy load verified)
- [ ] Netlify deploy

---

## ARCHITECTURE NOTES

- State machine is pure — no side effects, testable in isolation
- Prompt builders are milestone-scoped — one function per MilestoneType
- System prompt sent once per session — not resent on each turn
- History pruned to last 4-6 turns per milestone — controls token usage
- AggregatedMetrics only reach Claude — never raw rows
- Lazy table loading — only tables required by current milestone are loaded
- DuckDB initialized once — persists across milestone transitions via singleton

---

## TOKEN BUDGET (estimated per full case)

| Phase | Tokens |
|-------|--------|
| System prompt (sent once) | ~400 |
| Per turn (6 milestones x 5 turns x ~800) | ~24,000 |
| Stakeholder review (3 personas x 3 turns) | ~3,600 |
| Total | ~28,000-40,000 tokens |

Cost at claude-sonnet-4 pricing: ~$0.14-0.20 per case completion.

---

## BUGS / RISKS LOGGED

| ID | Risk | Severity | Status |
|----|------|----------|--------|
| R01 | DuckDB WASM ~6MB bundle — needs lazy load | High | Mitigated by design |
| R02 | Next.js App Router + Netlify hybrid config | Medium | Addressed in CP1 tasks |
| R03 | AI response parsing — fragile tag extraction | Medium | parseAIResponse uses regex fallback |
| R04 | CSV load time on 3G | Low | MILESTONE_TABLE_MAP lazy strategy applied |
