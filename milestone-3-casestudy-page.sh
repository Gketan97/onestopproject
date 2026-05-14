#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# MILESTONE 3 — Case Study Hub (/case-study)
# Run from repo root: bash milestone-3-casestudy-page.sh
# Prerequisites: Milestones 1 & 2 done.
# Not linked from Nav — Ketan shares URL directly with students.
# ═══════════════════════════════════════════════════════════════

echo "→ Creating src/pages/CaseStudy.tsx..."

cat > src/pages/CaseStudy.tsx << 'COMPONENT'
import { useState, useEffect } from 'react'

// ─── Data — Ketan edits these sections before each cohort ─────
const CASE = {
  company: 'Swiggy',
  title: 'Why do users browse but not order?',
  background: `Swiggy is India's leading food delivery platform, operating in 500+ cities with millions of daily active users. In Q3, the product team noticed a significant segment of users opening the app, browsing restaurant listings for 3–7 minutes, and exiting without placing an order. The drop-off was highest among users in metro cities between 7–9 PM — peak ordering hours.`,
  problemStatement: `You are a junior analyst on the growth team. Your manager wants to understand what's driving this browse-abandon behaviour and what the team should prioritize to reduce it. The data is available below. What's your analysis?`,
  relevance: `Browse-abandon is a €bn problem across e-commerce and food-tech. The hypotheses you generate here apply to Zomato, Blinkit, Amazon, and any marketplace with a discovery-to-purchase gap. This is the type of ambiguous, data-heavy problem asked in PM and analyst interviews at top Indian tech companies.`,
}

const DATA_FILES = [
  {
    name: 'user_sessions.csv',
    icon: '📊',
    description: 'Session-level data: user ID, session duration, pages viewed, exit point, city, time of day',
    usage: 'Use this to identify patterns in where users drop off in the browse flow',
    link: 'https://drive.google.com/your-link-here',  // ← Ketan updates this
  },
  {
    name: 'restaurant_inventory.csv',
    icon: '🗂',
    description: 'Restaurant availability by time slot, cuisine, price band, and delivery ETA by city',
    usage: 'Cross-reference with session data to check if inventory gaps explain drop-off',
    link: 'https://drive.google.com/your-link-here',  // ← Ketan updates this
  },
  {
    name: 'pricing_experiments.pdf',
    icon: '📄',
    description: 'Summary of 3 recent A/B tests on delivery fee display, surge pricing, and coupon visibility',
    usage: 'Check if pricing friction is a contributing factor to abandonment',
    link: 'https://drive.google.com/your-link-here',  // ← Ketan updates this
  },
]

const METHODOLOGY = [
  {
    num: '01',
    phase: 'Define the problem space',
    covered: true,
    what: 'Break down "browse-abandon" into distinct user segments, time windows, and behavioral patterns. What does the data actually show?',
    aiHelp: 'Ask AI to help you build a structured problem tree. Prompt: "Help me decompose the browse-abandon problem into mutually exclusive, collectively exhaustive sub-problems."',
    output: 'A 1-page problem decomposition with 3–5 distinct hypotheses ranked by likelihood.',
  },
  {
    num: '02',
    phase: 'Analyse the session data',
    covered: true,
    what: 'Run descriptive analysis on user_sessions.csv. What are the exit patterns? Which segments over-index on drop-off?',
    aiHelp: 'Upload the CSV to Claude or ChatGPT and ask it to summarise key patterns. Prompt: "Analyse this dataset and identify the top 3 segments with the highest browse-abandon rate. Explain what might drive each."',
    output: 'A table of key segments + drop-off rates + 1-line hypothesis per segment.',
  },
  {
    num: '03',
    phase: 'Test your hypotheses',
    covered: false,
    what: 'Cross-reference each hypothesis against the available data files. Which ones hold? Which ones fall apart?',
    aiHelp: 'Prompt: "Given these 5 hypotheses and this dataset, which hypotheses are supported, which are unsupported, and what data would you need to confirm the unsupported ones?"',
    output: 'Updated hypothesis list with evidence strength (Supported / Partially supported / Unsupported).',
  },
  {
    num: '04',
    phase: 'Root cause synthesis',
    covered: false,
    what: 'Narrow to 2–3 root causes with the strongest evidence. Build a causal chain from user behaviour to business metric impact.',
    aiHelp: 'Prompt: "Help me build a causal chain from [hypothesis] to [business metric]. What are the intermediate steps and how would I validate each?"',
    output: 'A 1-page causal chain diagram or written walkthrough.',
  },
  {
    num: '05',
    phase: 'Recommendations',
    covered: false,
    what: 'Prioritise 2–3 interventions using an effort/impact framework. What should the team do first and why?',
    aiHelp: 'Prompt: "Given these root causes and these constraints (small team, 2-week sprint), rank these interventions by expected impact. Justify your ranking."',
    output: 'A prioritised recommendation table with rationale and success metrics.',
  },
]

const STARTER_PROMPTS = [
  {
    id: 'p1',
    label: 'Problem decomposition',
    prompt: 'I am analysing why users on a food delivery app browse for 3–7 minutes but exit without ordering. Help me build a structured problem tree that breaks this into mutually exclusive, collectively exhaustive sub-problems. I want hypotheses across user intent, product friction, inventory gaps, and pricing.',
  },
  {
    id: 'p2',
    label: 'Data pattern analysis',
    prompt: 'Here is a dataset of user sessions on a food delivery app [paste data or describe it]. Identify the top 3 segments with the highest browse-abandon rate. For each segment, give a 1-line hypothesis about why they drop off and what data would confirm it.',
  },
  {
    id: 'p3',
    label: 'Hypothesis testing',
    prompt: 'I have 4 hypotheses about why users abandon a food delivery app without ordering: [list your hypotheses]. For each, tell me: (1) what evidence would support it, (2) what evidence would refute it, (3) how strong my current evidence is based on this data [describe data].',
  },
  {
    id: 'p4',
    label: 'Recommendation prioritisation',
    prompt: 'Based on this analysis [paste your summary], what are the top 3 product interventions to reduce browse-abandon? Prioritise by expected impact vs. implementation effort. For each, define what success looks like and how you would measure it in a 2-week sprint.',
  },
]

const SUBMISSION = {
  deadline: 'Before the Friday Session 2 (WhatsApp to Ketan)',
  checklist: [
    'Your hypotheses (at least 3, ranked by likelihood)',
    'Methodology: which phases you completed and how',
    'Key findings from each phase (data-backed where possible)',
    'Root causes you identified (with evidence)',
    'Your prioritised recommendations (2–3, with rationale)',
    'Which AI prompts you used and found most useful',
    'What you got stuck on — Ketan will address this in Session 2',
  ],
  format: 'Any format you prefer — Google Doc, Notion, PDF, or even a clear WhatsApp voice note. Clarity of thinking matters, not formatting.',
}

// ─── Component ────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className="cs-copy-btn" onClick={copy}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

export default function CaseStudy() {
  const [activePrompt, setActivePrompt] = useState<string | null>(null)

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <style>{`
        .cs-root {
          min-height: 100vh;
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: var(--font-body);
        }
        /* ── Header ── */
        .cs-header {
          padding: 64px 32px 48px;
          border-bottom: 1px solid var(--border-subtle);
          max-width: 860px; margin: 0 auto;
        }
        .cs-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.14em;
          color: var(--text-muted); text-transform: uppercase;
          margin-bottom: 16px;
        }
        .cs-h1 {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 44px);
          line-height: 1.15; margin: 0 0 16px;
          color: var(--text-primary);
        }
        .cs-sub {
          font-size: 16px; color: var(--text-muted);
          line-height: 1.7; max-width: 640px; margin: 0;
        }
        /* ── Body layout ── */
        .cs-body {
          max-width: 860px; margin: 0 auto;
          padding: 0 32px 96px;
        }
        /* ── Section ── */
        .cs-section { padding: 56px 0 0; }
        .cs-section-label {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.14em;
          color: var(--text-muted); text-transform: uppercase;
          margin-bottom: 20px;
        }
        .cs-section-h2 {
          font-family: var(--font-display);
          font-size: clamp(20px, 3vw, 26px);
          color: var(--text-primary);
          margin: 0 0 20px; line-height: 1.2;
        }
        .cs-body-text {
          font-size: 15px; line-height: 1.8;
          color: var(--text-muted); margin: 0 0 16px;
        }
        .cs-callout {
          border-left: 2px solid var(--border-subtle);
          padding: 16px 20px; margin: 24px 0;
          background: var(--bg-surface);
          border-radius: 0 8px 8px 0;
        }
        .cs-callout-label {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.1em;
          color: var(--text-muted); text-transform: uppercase;
          margin-bottom: 8px;
        }
        .cs-callout-text {
          font-size: 15px; color: var(--text-primary);
          line-height: 1.7; margin: 0;
        }
        /* ── Data files ── */
        .cs-files { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
        .cs-file-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 20px 24px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .cs-file-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
        .cs-file-name {
          font-family: var(--font-mono);
          font-size: 13px; color: var(--text-primary);
          margin-bottom: 4px;
        }
        .cs-file-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 8px; }
        .cs-file-usage {
          font-size: 12px; color: var(--text-muted);
          font-style: italic; margin-bottom: 12px;
        }
        .cs-file-link {
          display: inline-block;
          font-size: 13px; color: var(--text-primary);
          text-decoration: none; font-weight: 600;
          border: 1px solid var(--border-subtle);
          border-radius: 6px; padding: 6px 14px;
          transition: background 0.15s;
        }
        .cs-file-link:hover { background: var(--bg-hover, rgba(255,255,255,0.06)); }
        /* ── Methodology steps ── */
        .cs-steps { display: flex; flex-direction: column; gap: 0; margin-top: 8px; }
        .cs-step {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 0 20px;
          padding: 28px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cs-step:last-child { border-bottom: none; }
        .cs-step-num {
          font-family: var(--font-mono);
          font-size: 11px; color: var(--text-muted);
          padding-top: 3px;
        }
        .cs-step-badge {
          display: inline-block;
          font-size: 10px; font-family: var(--font-mono);
          letter-spacing: 0.08em;
          padding: 3px 8px; border-radius: 4px;
          margin-bottom: 8px;
        }
        .cs-step-badge.covered {
          background: rgba(74,222,128,0.12);
          color: #4ade80;
        }
        .cs-step-badge.yours {
          background: rgba(251,191,36,0.12);
          color: #fbbf24;
        }
        .cs-step-phase {
          font-size: 16px; font-weight: 600;
          color: var(--text-primary); margin-bottom: 8px;
        }
        .cs-step-what { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px; }
        .cs-step-ai-label {
          font-size: 11px; font-family: var(--font-mono);
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 4px;
        }
        .cs-step-ai-tip { font-size: 13px; color: var(--text-muted); line-height: 1.6; font-style: italic; margin-bottom: 12px; }
        .cs-step-output-label {
          font-size: 11px; font-family: var(--font-mono);
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 4px;
        }
        .cs-step-output { font-size: 13px; color: var(--text-primary); line-height: 1.6; }
        /* ── Prompts ── */
        .cs-prompts { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
        .cs-prompt-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; overflow: hidden;
        }
        .cs-prompt-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; cursor: pointer;
          transition: background 0.15s;
        }
        .cs-prompt-header:hover { background: var(--bg-hover, rgba(255,255,255,0.04)); }
        .cs-prompt-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .cs-prompt-actions { display: flex; gap: 8px; align-items: center; }
        .cs-prompt-toggle { font-size: 18px; color: var(--text-muted); }
        .cs-copy-btn {
          font-size: 12px; font-family: var(--font-mono);
          color: var(--text-muted); background: none;
          border: 1px solid var(--border-subtle);
          border-radius: 5px; padding: 4px 10px;
          cursor: pointer; transition: color 0.15s;
        }
        .cs-copy-btn:hover { color: var(--text-primary); }
        .cs-prompt-body {
          padding: 0 20px 20px;
          font-size: 14px; color: var(--text-muted);
          line-height: 1.7; white-space: pre-wrap;
          font-family: var(--font-mono);
          border-top: 1px solid var(--border-subtle);
          padding-top: 16px;
        }
        /* ── Submission ── */
        .cs-checklist { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 10px; }
        .cs-checklist li {
          display: flex; gap: 12px; align-items: flex-start;
          font-size: 14px; color: var(--text-muted); line-height: 1.6;
        }
        .cs-check-icon { color: var(--text-muted); flex-shrink: 0; margin-top: 2px; }
        .cs-submit-note {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 20px 24px;
          font-size: 14px; color: var(--text-muted);
          line-height: 1.7;
        }
        .cs-submit-deadline {
          font-family: var(--font-mono);
          font-size: 11px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 4px;
        }
        .cs-submit-deadline-val {
          font-size: 15px; font-weight: 600;
          color: var(--text-primary); margin-bottom: 16px;
        }
        /* ── Responsive ── */
        @media (max-width: 600px) {
          .cs-header, .cs-body { padding-left: 20px; padding-right: 20px; }
          .cs-step { grid-template-columns: 36px 1fr; gap: 0 12px; }
        }
      `}</style>

      <div className="cs-root">
        {/* Header */}
        <div className="cs-header">
          <p className="cs-eyebrow">Friday AI Problem Solving Lab — Session 1 Case</p>
          <h1 className="cs-h1">{CASE.title}</h1>
          <p className="cs-sub">{CASE.company} · Browse-abandon analysis · Growth team</p>
        </div>

        <div className="cs-body">

          {/* A — Case Context */}
          <div className="cs-section">
            <p className="cs-section-label">Case context</p>
            <h2 className="cs-section-h2">Background</h2>
            <p className="cs-body-text">{CASE.background}</p>

            <div className="cs-callout">
              <p className="cs-callout-label">Your problem statement</p>
              <p className="cs-callout-text">{CASE.problemStatement}</p>
            </div>

            <h2 className="cs-section-h2" style={{ marginTop: 32 }}>Why this case matters</h2>
            <p className="cs-body-text">{CASE.relevance}</p>
          </div>

          {/* B — Data Files */}
          <div className="cs-section">
            <p className="cs-section-label">Raw data</p>
            <h2 className="cs-section-h2">Data files</h2>
            <p className="cs-body-text" style={{ marginBottom: 20 }}>Download these before your independent work session. Each file is referenced in the methodology below.</p>
            <div className="cs-files">
              {DATA_FILES.map((f, i) => (
                <div key={i} className="cs-file-card">
                  <div className="cs-file-icon">{f.icon}</div>
                  <div>
                    <div className="cs-file-name">{f.name}</div>
                    <div className="cs-file-desc">{f.description}</div>
                    <div className="cs-file-usage">How to use: {f.usage}</div>
                    <a className="cs-file-link" href={f.link} target="_blank" rel="noopener noreferrer">
                      Download ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C — Methodology */}
          <div className="cs-section">
            <p className="cs-section-label">Methodology</p>
            <h2 className="cs-section-h2">Step-by-step approach</h2>
            <p className="cs-body-text" style={{ marginBottom: 20 }}>
              Phases marked <span style={{ color: '#4ade80', fontWeight: 600 }}>Covered in Session 1</span> were walked through with Ketan.
              Phases marked <span style={{ color: '#fbbf24', fontWeight: 600 }}>Your work</span> are for you to complete independently this week.
            </p>
            <div className="cs-steps">
              {METHODOLOGY.map((step) => (
                <div key={step.num} className="cs-step">
                  <div className="cs-step-num">{step.num}</div>
                  <div>
                    <span className={`cs-step-badge ${step.covered ? 'covered' : 'yours'}`}>
                      {step.covered ? 'Covered in Session 1' : 'Your work'}
                    </span>
                    <div className="cs-step-phase">{step.phase}</div>
                    <div className="cs-step-what">{step.what}</div>
                    <div className="cs-step-ai-label">AI prompt direction</div>
                    <div className="cs-step-ai-tip">{step.aiHelp}</div>
                    <div className="cs-step-output-label">Expected output</div>
                    <div className="cs-step-output">{step.output}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D — Submission */}
          <div className="cs-section">
            <p className="cs-section-label">Submission</p>
            <h2 className="cs-section-h2">What to include in your report</h2>
            <ul className="cs-checklist">
              {SUBMISSION.checklist.map((item, i) => (
                <li key={i}>
                  <span className="cs-check-icon">◦</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="cs-submit-note">
              <div className="cs-submit-deadline">Deadline</div>
              <div className="cs-submit-deadline-val">{SUBMISSION.deadline}</div>
              <div>{SUBMISSION.format}</div>
            </div>
          </div>

          {/* E — Starter Prompts */}
          <div className="cs-section">
            <p className="cs-section-label">AI prompts</p>
            <h2 className="cs-section-h2">Starter prompts to get you going</h2>
            <p className="cs-body-text" style={{ marginBottom: 20 }}>
              These are not scripts — adapt them to your actual analysis. The goal is to use AI as a thinking partner, not an answer machine.
            </p>
            <div className="cs-prompts">
              {STARTER_PROMPTS.map((p) => (
                <div key={p.id} className="cs-prompt-card">
                  <div
                    className="cs-prompt-header"
                    onClick={() => setActivePrompt(activePrompt === p.id ? null : p.id)}
                  >
                    <span className="cs-prompt-title">{p.label}</span>
                    <div className="cs-prompt-actions">
                      <CopyButton text={p.prompt} />
                      <span className="cs-prompt-toggle">{activePrompt === p.id ? '−' : '+'}</span>
                    </div>
                  </div>
                  {activePrompt === p.id && (
                    <div className="cs-prompt-body">{p.prompt}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
COMPONENT

echo "  ✓ CaseStudy.tsx created"

echo "→ Registering /case-study route in App.tsx..."

python3 - <<PYEOF
path = 'src/App.tsx'
with open(path, 'r') as f:
    src = f.read()

if 'CaseStudy' not in src:
    src = src.replace(
        "import Evaluation from './pages/Evaluation'",
        "import Evaluation from './pages/Evaluation'\nimport CaseStudy from './pages/CaseStudy'"
    )
    src = src.replace(
        "<Route path=\"/evaluation\" element={<Evaluation />} />",
        "<Route path=\"/evaluation\" element={<Evaluation />} />\n        <Route path=\"/case-study\" element={<CaseStudy />} />"
    )
    with open(path, 'w') as f:
        f.write(src)
    print('  ✓ App.tsx updated with /case-study route')
else:
    print('  ✓ /case-study route already present')
PYEOF

echo ""
echo "✅ Milestone 3 complete."
echo "   - CaseStudy page created: /case-study"
echo "   - Sections: Context, Data files, Methodology (covered vs yours), Submission checklist, Starter prompts"
echo "   - Route registered in App.tsx"
echo "   - Not linked from Nav — share URL directly with students"
echo ""
echo "⚠  Before using:"
echo "   1. Update DATA_FILES[].link in src/pages/CaseStudy.tsx with real Google Drive URLs"
echo "   2. Edit CASE.background / problemStatement / relevance for each new cohort"
echo "   3. Update METHODOLOGY covered: true/false based on how far Session 1 goes"
echo ""
echo "🚀 All 3 milestones done. Ready to deploy:"
echo "   npm run build"
echo "   vercel --prod"
