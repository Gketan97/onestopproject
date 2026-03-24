import React, { useState, useCallback, useEffect } from 'react';
import MissionBrief from '../shared/MissionBrief.jsx';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import SqlWorkbench from '../shared/SqlWorkbench.jsx';
import { useP2Timer } from '../hooks/useP2Timer.js';
import { useArjun } from '../hooks/useArjun.js';

/* ── Arjun ask bar ── */
function AskArjunBar({ onAsk }) {
  const [q, setQ] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { callArjun: call } = useArjun();

  const ask = async () => {
    if (!q.trim()) return;

    setLoading(true);
    setResponse('');

    const fb = await call(
      `Socratic question about Swiggy investigation: ${q}\nRespond Socratically — ask a question back, don't give the answer.`,
      'clarify'
    );

    setResponse(fb);
    setLoading(false);
    setQ('');
    onAsk?.();
  };

  return (
    <div className="sticky bottom-0 border-t border-border bg-surface -mx-5 px-5 py-3 z-40">
      <div className="flex gap-2 items-center">
        <div className="w-7 h-7 rounded-lg bg-phase1-bg border border-phase1-border flex items-center justify-center font-mono text-[9px] font-bold text-phase1 flex-shrink-0">
          AJ
        </div>

        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') ask(); }}
          placeholder="Ask Arjun anything about this investigation..."
          className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2 text-[13px] font-sans text-ink outline-none focus:border-border2"
        />

        <button
          onClick={ask}
          className="px-3 py-2 bg-phase2 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          Ask →
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 mt-2">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-ink3 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          <span className="text-[12px] text-ink3">Arjun is thinking...</span>
        </div>
      )}

      {response && (
        <ArjunVoice label="Arjun (Socratic mode)" phase={2} className="mt-2">
          {response}
        </ArjunVoice>
      )}
    </div>
  );
}

/* ── Step rendering ── */
function Step({ stepId, onDone, onBehaviour, queryCount, onQueryCount }) {
  const [showNext, setShowNext] = useState(false);

  const handleSqlRun = (query) => {
    onQueryCount();
    setTimeout(() => setShowNext(true), 1500);
  };

  const handlePFSubmit = useCallback(async (val) => {
    setShowNext(true);
  }, []);

  if (stepId === 'clarify') {
    return (
      <div className="mb-4">
        <ArjunVoice label="Your turn — Phase 1 framework in action" phase={2}>
          Apply what you watched Arjun do. Before you write a single query — what's the first thing you ask Priya?
        </ArjunVoice>
        <ProduceFirst
          id="p2-clarify"
          prompt="What clarification do you ask Priya before pulling any data? (Step 1 from Phase 1 — apply it here.)"
          minWords={8}
          mockKey="clarify"
          arjunAnswer={'I\'d ask: "Which definition of orders — completed only? And is this North Bangalore all cuisines, or specifically Biryani? Last question: has anything changed in North Bangalore recently?"'}
          onSubmit={handlePFSubmit}
        />
        {showNext && (
          <button onClick={onDone} className="w-full py-2.5 bg-phase2 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mt-2">
            Step 2: Establish the baseline →
          </button>
        )}
      </div>
    );
  }

  if (stepId === 'baseline') {
    return (
      <div className="mb-4">
        <ArjunVoice label="Step 2 — Establish the baseline" phase={2}>
          Before calling it a 34% drop, confirm it. Write a query: North Bangalore, Biryani category, orders this Monday vs last Monday.
        </ArjunVoice>
        <SqlWorkbench id="wb-baseline" title="baseline_nb_biryani.sql" dataKey="p2_baseline" onRun={handleSqlRun} onQueryCount={onQueryCount} />
        {showNext && (
          <>
            <ArjunVoice label="Arjun — on your baseline" phase={2}>
              Confirmed: 32.97% down. Now decompose. Which specific restaurants are driving this?
            </ArjunVoice>
            <button onClick={onDone} className="w-full py-2.5 bg-phase2 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Step 3: Find the restaurants →
            </button>
          </>
        )}
      </div>
    );
  }

  if (stepId === 'decompose') {
    return (
      <div className="mb-4">
        <ArjunVoice label="Step 3 — Find the specific restaurants" phase={2}>
          Which specific restaurants are down? Join orders with restaurants and reviews to get rating changes and complaint data alongside the order drop.
        </ArjunVoice>
        <SqlWorkbench id="wb-decomp" title="restaurants_nb_biryani.sql" dataKey="p2_restaurants" onRun={handleSqlRun} onQueryCount={onQueryCount} />
        {showNext && (
          <>
            <ArjunVoice label="Arjun — what you should see" phase={2}>
              3 restaurants with complaint spikes driving ~45% of the drop. But that only explains 45%. What explains the other 55%? Keep investigating.
            </ArjunVoice>
            <div className="px-3 py-2.5 bg-amber-bg border border-amber-border rounded-lg mb-2">
              <p className="font-mono text-[9px] font-semibold text-amber tracking-widest uppercase mb-1">Partial explanation alert</p>
              <p className="text-[12px] text-ink leading-relaxed">Quality complaints explain ~45% of the drop. What explains the other ~55%? Check external factors.</p>
            </div>
            <button onClick={() => { onBehaviour('B3', 'Decomposed to restaurant level before hypothesising'); onBehaviour('B4', 'Recognised partial explanation — asked "does this close the gap?"'); onDone(); }} className="w-full py-2.5 bg-phase2 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Step 4: Free investigation →
            </button>
          </>
        )}
      </div>
    );
  }

  if (stepId === 'investigate') {
    return (
      <div className="mb-4">
        <ArjunVoice label="Step 4 — Open investigation" phase={2}>
          You have partial root cause. Quality complaints explain ~45%. What explains the rest? Explore freely — try external events, competitor activity. The answer is in the tables.
        </ArjunVoice>
        <SqlWorkbench id="wb-open" title="open_investigation.sql" dataKey={null} onRun={handleSqlRun} onQueryCount={onQueryCount}
          placeholder={"-- Try anything: external_events, competitor_pricing,\n-- weather, delivery_partners, search_events...\nSELECT ..."} minHeight={110} />
        {showNext && (
          <>
            <ArjunVoice label="Did you find it?" phase={2}>
              If you checked external_events — you found a Zomato 40% discount on Biryani running specifically in North Bangalore this week. That's the second cause. Two interacting causes = 100% explained.
            </ArjunVoice>
            <button onClick={() => { onBehaviour('B5', 'Checked external signals — found Zomato promotion'); onDone(); }} className="w-full py-2.5 bg-phase2 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Step 5: Confirm and quantify →
            </button>
          </>
        )}
      </div>
    );
  }

  if (stepId === 'causation') {
    return (
      <div className="mb-4">
        <ArjunVoice label="Step 5 — Confirm root cause" phase={2}>
          You have two hypotheses: restaurant quality complaints (~45%) and Zomato promo (~55%). Quantify both. Confirm they're additive. Numbers should close to 100%.
        </ArjunVoice>
        <ProduceFirst
          id="p2-causation"
          prompt="State your root cause clearly: what are the two causes, what percentage does each explain, and how do you confirm causation (not just correlation)?"
          minWords={20}
          mockKey="causation"
          arjunAnswer="Two causes: (1) Quality spike in 3 restaurants — rating drops of 0.9–1.4pts with confirmed complaint spikes, driving ~45% of the drop. Causation: temporal match. (2) Zomato 40% off Biryani specifically in North Bangalore — externally verified. Causation: geography-specific match. Together: 100% explained. Two separate owners required."
          hint="Check: does your explanation account for 100% of the drop? Does the geography match? Does the timeline match?"
          onSubmit={async ({ answer }) => { onBehaviour('B7', 'Confirmed causation via temporal + geographic evidence for both causes'); setShowNext(true); }}
        />
        {showNext && (
          <button onClick={() => { onBehaviour('B6', 'Identified two separate owners for two separate causes'); onDone(); }} className="w-full py-2.5 bg-phase2 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mt-2">
            Step 6: Write the VP message →
          </button>
        )}
      </div>
    );
  }

  if (stepId === 'vp') {
    return (
      <div className="mb-4">
        <ArjunVoice label="Step 6 — Write the VP message" phase={2}>
          Root cause confirmed. Write the message to Priya. S/C/R format: Situation, Complication, Resolution. Specific owners and timelines.
        </ArjunVoice>
        <ProduceFirst
          id="p2-vp"
          prompt="Write the VP-ready message to Priya. Situation → Complication → Resolution. Specific owners and timelines."
          minWords={30}
          mockKey="vp"
          arjunAnswer={"Situation: North Bangalore Biryani down 34% WoW. Two interacting causes confirmed.\nComplication: (1) Quality spike in 3 restaurants (~45% of drop). (2) Zomato 40% off Biryani in North Bangalore this week (~55% of drop).\nResolution: (1) Restaurant quality team: QA review of 3 affected restaurants by EOD. (2) Growth team: evaluate competitive response. Two owners. Weekly monitoring of category-geography cross-tabs."}
          hint="Structure: Situation (confirmed number, which segment). Complication (two causes, each quantified). Resolution (two separate actions, two owners, specific timelines)."
          onSubmit={async ({ answer }) => { onBehaviour('B8', 'Wrote VP message with S/C/R format, two owners, specific timelines'); onDone(answer); }}
        />
      </div>
    );
  }

  return null;
}

const P2_STEP_IDS = ['clarify', 'baseline', 'decompose', 'investigate', 'causation', 'vp'];
const P2_LABELS = ['Step 1 · Clarify', 'Step 2 · Baseline', 'Step 3 · Decompose', 'Step 4 · Investigate', 'Step 5 · Causation', 'Step 6 · Communicate'];

export default function Phase2Section({ startTime, priya1Sent, priya2Sent, onPriyaMessage, onDone, onBehaviour, onQueryCount, queryCount, vpText }) {
  const [stepIdx, setStepIdx] = useState(0);
  const { fmtElapsed } = useP2Timer({ startTime, onPriyaMessage, priya1Sent, priya2Sent });
  const [priyaMessages, setPriyaMessages] = useState([]);
  const [showAskBar, setShowAskBar] = useState(false);

  useEffect(() => {
    if (stepIdx >= 3) setShowAskBar(true);
  }, [stepIdx]);

  const handlePriyaMessage = useCallback((n, msg) => {
    setPriyaMessages(prev => [...prev, msg]);
    onPriyaMessage(n, msg);
  }, [onPriyaMessage]);

  const advance = (val) => {
    if (stepIdx === P2_STEP_IDS.length - 1) onDone(val);
    else setStepIdx(i => i + 1);
  };

  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-phase2 uppercase">Phase 2 · Practice</span>
        <div className="flex-1 h-px bg-border" />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold border bg-phase2-bg text-phase2 border-phase2-border">~25 min</span>
      </div>

      <MissionBrief priyaMessages={priyaMessages} />

      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] font-semibold text-phase2 tracking-widest uppercase">{P2_LABELS[stepIdx]}</p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink3">{fmtElapsed}</span>
          <span className="text-[11px] text-ink3">{queryCount} {queryCount === 1 ? 'query' : 'queries'}</span>
        </div>
      </div>

      {P2_STEP_IDS.slice(0, stepIdx + 1).map((id, i) => (
        <Step
          key={id}
          stepId={id}
          onDone={i === stepIdx ? advance : () => {}}
          onBehaviour={onBehaviour}
          queryCount={queryCount}
          onQueryCount={onQueryCount}
        />
      ))}

      {showAskBar && <AskArjunBar onAsk={() => {}} />}
    </div>
  );
}