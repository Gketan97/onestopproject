# Strategic Incident Simulator — Build Plan

## What We're Building

A complete rebuild of the case study experience: from SQL-focused to **Strategic Problem Solving**.
Target audience expands from Data Analysts → PMs, BizOps, Strategy, and Generalist roles.

---

## Architecture Overview

```
src/components/strategy/
├── data/
│   └── swiggyStrategyData.js     ← All mock data, KPIs, funnel, cohort, Arjun responses
├── hooks/
│   └── useStrategyState.js       ← Case state (triage → deep-dive → master → memo)
│   └── useArjunStrategy.js       ← Arjun AI hook with Socratic persona
├── components/
│   ├── StrategyHero.jsx          ← Hero section (replaces HomePage hero)
│   ├── ResumeWidget.jsx          ← Before/After glass card comparison
│   ├── KpiScorecard.jsx          ← Pulsing dashboard (Phase 1)
│   ├── ArjunSocraticChat.jsx     ← Slack-style mentor interface
│   ├── AnalysisWorkbench.jsx     ← NL query → Funnel + Cohort visualizer
│   ├── FunnelVisualizer.jsx      ← Noir funnel with drop-off annotations
│   ├── CohortMatrix.jsx          ← Glassmorphic retention table
│   └── StrategyMemo.jsx          ← Portfolio asset generator
└── StrategyCase.jsx              ← Root orchestrator (3-phase flow)
```

---

## Checkpoints

### ✅ CP0 — Plan (this file)

### 🔨 CP1 — Data + State Layer
- `swiggyStrategyData.js`: KPIs, funnel data, cohort matrix, Arjun mock responses
- `useStrategyState.js`: phase machine (triage → deepdive → master → memo)
- `useArjunStrategy.js`: Socratic AI hook with Staff Analyst persona

### 🔨 CP2 — Hero + Resume Widget
- `StrategyHero.jsx`: Full-screen noir hero, animated headline, scroll orbs
- `ResumeWidget.jsx`: Glass card comparison with shortlist animation

### 🔨 CP3 — Phase 1: KPI Triage
- `KpiScorecard.jsx`: GMV / Conversion / CAC / Fleet dashboard, one metric pulsing red
- `ArjunSocraticChat.jsx`: Slack-style chat with typing indicator

### 🔨 CP4 — Phase 2: Analysis Workbench
- `AnalysisWorkbench.jsx`: NL query input → response routing
- `FunnelVisualizer.jsx`: Search → Menu → Cart → Payment with % drop-offs
- Arjun Socratic response on wrong interpretation

### 🔨 CP5 — Phase 3: Cohort + Memo
- `CohortMatrix.jsx`: Week-over-week retention heatmap
- Impact sizing challenge (INR calculator)
- `StrategyMemo.jsx`: Generated memo with unique portfolio link

### 🔨 CP6 — Root Orchestrator + Route
- `StrategyCase.jsx`: Phase transitions, progress strip, splash screens
- Wire into `App.jsx` at `/strategy/swiggy`
- Update homepage CTA to point to strategy experience

---

## Design Language

| Token | Value |
|---|---|
| Background | `#050505` / `var(--bg)` |
| Orange glow | `#FC8019` Swiggy Orange |
| Blue glow | `#1E4FCC` → `#4F80FF` Strategy Blue |
| Glass | `rgba(255,255,255,0.04)` + `blur(12px)` |
| Grid | 20px dotted at 4% opacity |
| Font | Inter (UI) + JetBrains Mono (data/metrics) |

---

## Key Design Decisions

1. **No SQL anywhere** — The workbench accepts plain English. "Show me Sunday vs last Sunday conversion"
2. **Arjun is Socratic** — Never gives answers, only asks the next right question
3. **INR throughout** — Every metric framed in business impact, not rows
4. **Portfolio-first** — Phase 3 output is a shareable memo link, not a score
5. **Reuses existing tokens** — Slots into the noir design system already in place
