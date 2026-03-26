import React, { useState, useEffect, useRef, useMemo } from 'react';
import SlackThread, { SlackMessage } from '../shared/SlackThread.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import { P1_STEPS, SQL_RES } from '../data/swiggyData.js';


// ── Typewriter hook ─────────────────────────────────────────
function useTypewriter(text, speed = 14) {

  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {

    if (!text) return;

    setDisplayed('');
    setDone(false);

    let i = 0;

    const id = setInterval(() => {

      i++;

      setDisplayed(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }

    }, speed);

    return () => clearInterval(id);

  }, [text, speed]);

  return { displayed, done };
}


// ── Animated SQL table ──────────────────────────────────────
function AnimatedResultsTable({ data, onDone }) {

  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {

    if (!data?.rows?.length) return;

    let i = 0;

    const id = setInterval(() => {

      i++;
      setVisibleRows(i);

      if (i >= data.rows.length) {

        clearInterval(id);
        setTimeout(() => onDone?.(), 300);

      }

    }, 140);

    return () => clearInterval(id);

  }, [data.rows.length]);

  return (

    <div className="overflow-x-auto max-h-52 overflow-y-auto transition-opacity duration-300">

      <table className="w-full border-collapse font-mono text-[11px]">

        <thead>
          <tr>
            {data.cols.map(col => (
              <th
                key={col}
                className="bg-sql-surface text-sql-kw px-2.5 py-1.5 text-left border-b border-sql-border text-[10px]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.rows.slice(0, visibleRows).map((row, i) => (

            <tr key={i} className="hover:bg-sql-surface transition">

              {row.map((cell, j) => (
                <td
                  key={j}
                  className="text-sql-text px-2.5 py-1.5 border-b border-sql-border/80"
                >
                  {cell}
                </td>
              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}


// ── Live SQL run animation ──────────────────────────────────
function LiveQueryReveal({ sqlTitle, sqlKey, children, onDataDone }) {

  const [runPhase, setRunPhase] = useState('queuing');

  useEffect(() => {

    setRunPhase('queuing');

    const t1 = setTimeout(() => setRunPhase('running'), 400);
    const t2 = setTimeout(() => setRunPhase('results'), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };

  }, [sqlKey]);

  return (

    <div className="my-3 bg-sql-bg border border-sql-border rounded-xl overflow-hidden">

      <div className="px-3.5 py-2 bg-sql-surface border-b border-sql-border flex justify-between">

        <span className="font-mono text-[10px] text-sql-kw">
          {sqlTitle}
        </span>

        <span className="font-mono text-[9px] text-sql-comment">
          BigQuery · prod.swiggy
        </span>

      </div>


      {runPhase === 'queuing' && (
        <div className="px-4 py-4 text-sql-comment text-sm">
          Queuing job…
        </div>
      )}

      {runPhase === 'running' && (
        <div className="px-4 py-4 text-sql-comment text-sm">
          Running query…
        </div>
      )}

      {runPhase === 'results' && children && (
        <AnimatedResultsTable data={children} onDone={onDataDone} />
      )}

    </div>

  );

}


// ── Arjun voice block ───────────────────────────────────────
function ArjunTypewriter({ label, text }) {

  const { displayed, done } = useTypewriter(text, 13);

  return (

    <div className="border-l-2 border-phase1 pl-4 py-2 my-3">

      <p className="font-mono text-[9px] uppercase tracking-widest mb-1">
        {label}
      </p>

      <p
        aria-live="polite"
        className="text-[13px] text-ink2 italic"
      >
        {displayed}

        {!done && (
          <span className="inline-block w-0.5 h-3.5 bg-current ml-1 animate-pulse"/>
        )}

      </p>

    </div>

  );

}


// ── Prediction confidence selector ──────────────────────────
function ConfidenceSelector({ onChange }) {

  const [value, setValue] = useState(null);

  const options = ['Low', 'Medium', 'High'];

  return (

    <div className="mt-2 flex gap-2">

      {options.map(o => (

        <button
          key={o}
          onClick={() => {
            setValue(o);
            onChange?.(o);
          }}
          className={`px-3 py-1 text-xs rounded border ${
            value === o
              ? 'bg-phase1 text-white'
              : 'bg-surface2 text-ink2'
          }`}
        >
          {o}
        </button>

      ))}

    </div>

  );

}


// ── Step component ──────────────────────────────────────────
function Step({ step, onNext, onSavePrediction }) {

  const [phase, setPhase] = useState('prompt');
  const [showInsight, setShowInsight] = useState(false);

  const stepRef = useRef(null);

  const sqlData = useMemo(
    () => step.reveal.sqlKey ? SQL_RES[step.reveal.sqlKey] : null,
    [step.reveal.sqlKey]
  );


  const handleSubmit = ({ answer }) => {

    onSavePrediction?.(step.num - 1, answer);

    setPhase('revealing');

  };


  return (

    <div ref={stepRef} className="mb-8">

      <h3 className="font-semibold mb-2">
        Step {step.num}: {step.title}
      </h3>


      <ArjunTypewriter
        label="Arjun — what he’s thinking"
        text={step.arjun}
      />


      {phase === 'prompt' && (

        <>

          <ProduceFirst
            id={`p1-${step.num}`}
            prompt={step.prediction}
            minWords={5}
            onSubmit={handleSubmit}
          />

          <ConfidenceSelector
            onChange={(c) => onSavePrediction?.(step.idx, `${answers[step.idx] || ''} [confidence: ${c}]`)}
          />

        </>

      )}


      {phase !== 'prompt' && sqlData && (

        <LiveQueryReveal
          sqlTitle={step.reveal.sqlTitle}
          sqlKey={step.reveal.sqlKey}
          onDataDone={() => {
            setPhase('revealed');
            setShowInsight(true);
          }}
        >
          {sqlData}
        </LiveQueryReveal>

      )}


      {showInsight && (

        <>
          <ArjunTypewriter
            label="Arjun — what he found"
            text={step.reveal.arjunAfter}
          />

          <button
            onClick={onNext}
            className="mt-3 w-full py-3 bg-phase1 text-white rounded-lg"
          >
            Continue →
          </button>
        </>

      )}

    </div>

  );

}


// ── Main Phase section ──────────────────────────────────────
export default function Phase1Section({ onDone, onSavePrediction }) {

  const [currentStep, setCurrentStep] = useState(0);

  const advance = () => {

    if (currentStep < P1_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onDone();
    }

  };


  return (

    <div className="max-w-3xl mx-auto px-6 pb-10">

      <SlackThread channel="analytics-incident · Swiggy data team">

        <SlackMessage
          initials="PS"
          name="Priya S."
          time="Mon 9:14 AM"
        >
          Morning — orders are down 8.3% week-over-week as of Sunday. Leadership noticed. Arjun, can you take a look before EOD?
        </SlackMessage>

        <SlackMessage
          initials="AJ"
          name="Arjun M."
          time="9:22 AM"
        >
          On it. I’ll start with the metric definition, then baseline, then decompose. I’ll share a root cause update by 3pm.
        </SlackMessage>

      </SlackThread>


      <ArjunTypewriter
        label="Arjun — before I touch any data"
        text={`When Priya says “orders are down 8.3%” — I always ask: which definition? Completed orders only? Including cancellations? Platform-wide or a specific vertical? If I pull the wrong metric, I’ll spend three hours investigating noise.`}
      />


      {P1_STEPS.slice(0, currentStep + 1).map(step => (

        <Step
          key={`step-${step.num}`}
          step={step}
          onNext={advance}
          onSavePrediction={onSavePrediction}
        />

      ))}

    </div>

  );

}