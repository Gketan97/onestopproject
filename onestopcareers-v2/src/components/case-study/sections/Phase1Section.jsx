import React, { useState } from 'react';
import SlackThread, { SlackMessage } from '../shared/SlackThread.jsx';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import SqlWorkbench from '../shared/SqlWorkbench.jsx';
import { P1_STEPS } from '../data/swiggyData.js';

// Safe renderer for static authored HTML from swiggyData.js
// These strings are author-controlled, never user-generated.
// eslint-disable-next-line react/no-danger
function CustomReveal({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Step({ step, onNext, onSavePrediction }) {
  const [revealed, setRevealed] = useState(false);

  const handleSubmit = async (val) => {
    onSavePrediction?.(val);
  };

  return (
    <div className="mb-4">
      {/* Step header */}
      <div className="flex gap-3 items-start px-3 py-2.5 border border-phase1-border bg-phase1-bg rounded-xl mb-1">
        <span className="font-mono text-[10px] font-bold text-phase1 flex-shrink-0 pt-0.5">{step.num}</span>
        <p className="text-[13px] font-semibold text-phase1">{step.title}</p>
      </div>

      <ArjunVoice label="Arjun — what he's thinking" phase={1}>
        {step.arjun}
      </ArjunVoice>

      {!revealed ? (
        <ProduceFirst
          id={`p1-pred-${step.num}`}
          prompt={step.prediction}
          minWords={5}
          mockKey="clarify"
          arjunAnswer={step.reveal.arjunAfter}
          onSubmit={({ answer }) => { onSavePrediction?.(answer); setRevealed(true); }}
        />
      ) : (
        <div className="space-y-2">
          {/* Arjun's actual move */}
          {step.reveal.customHtml ? (
            <CustomReveal html={step.reveal.customHtml} />
          ) : step.reveal.sqlKey ? (
            <SqlWorkbench
              id={`p1-wb-${step.num}`}
              title={step.reveal.sqlTitle}
              dataKey={step.reveal.sqlKey}
              showEvaluate={false}
            />
          ) : null}

          <ArjunVoice label="Arjun — what he found" phase={1}>
            {step.reveal.arjunAfter}
          </ArjunVoice>

          {step.behaviourCode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-bg border border-green-border rounded-lg">
              <span className="text-green font-bold text-xs">✓</span>
              <p className="text-[11px] text-green leading-relaxed">{step.behaviourEvidence}</p>
            </div>
          )}

          <button onClick={onNext} className="w-full py-2.5 bg-phase1 text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors">
            {step.num >= P1_STEPS.length ? 'See how your predictions compared →' : `Watch step ${step.num + 1} →`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Phase1Section({ onDone, onMarkBehaviour, onSavePrediction }) {
  const [currentStep, setCurrentStep] = useState(0);

  const advance = () => {
    const step = P1_STEPS[currentStep];
    if (step.behaviourCode) onMarkBehaviour?.(step.behaviourCode, step.behaviourEvidence);
    if (currentStep < P1_STEPS.length - 1) setCurrentStep(s => s + 1);
    else onDone();
  };

  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-phase1 uppercase">Phase 1 · Watch</span>
        <div className="flex-1 h-px bg-border" />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold border bg-phase1-bg text-phase1 border-phase1-border">~20 min</span>
      </div>

      <SlackThread channel="analytics-incident · Swiggy data team" className="mb-4">
        <SlackMessage initials="PS" name="Priya S." time="Mon 9:14 AM">
          Morning — orders are down 8.3% WoW as of Sunday. Significant enough that leadership noticed. Arjun, can you look into this before EOD? I need root cause, not just the number.
        </SlackMessage>
        <SlackMessage initials="AJ" name="Arjun M." time="9:22 AM">
          On it. Will start with the metric definition, then baseline, then decompose. Will Slack you by 3pm with root cause.
        </SlackMessage>
      </SlackThread>

      <ArjunVoice label="Arjun — before I touch any data" phase={1}>
        When Priya says "orders are down 8.3%" — I always ask: which definition? Completed orders only? Including cancellations? Platform-wide or a specific vertical? If I pull the wrong metric, I'll spend 3 hours investigating noise.
      </ArjunVoice>

      {P1_STEPS.slice(0, currentStep + 1).map((step, i) => (
        <Step
          key={step.num}
          step={step}
          onNext={advance}
          onSavePrediction={(val) => onSavePrediction?.(i, val)}
        />
      ))}
    </div>
  );
}
