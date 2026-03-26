import React, { useState } from 'react';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import SqlWorkbench from '../shared/SqlWorkbench.jsx';
import SchemaPanel from '../shared/SchemaPanel.jsx';
import { P3_TASKS } from '../data/swiggyData.js';

function Task({ task, onDone }) {
  const [sqlRan, setSqlRan] = useState(false);
  const [pfDone, setPfDone] = useState(false);

  return (
    <div className="border border-phase3-border bg-phase3-bg rounded-xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-phase3-border">
        <p className="font-mono text-[9px] font-semibold text-phase3 tracking-widest uppercase mb-1">{task.label} · {task.title}</p>
        <p className="text-[13px] text-ink leading-relaxed">{task.desc}</p>
      </div>
      <div className="px-4 py-3">
        {task.sqlKey && (
          <SqlWorkbench
            id={`wb-p3-${task.id}`}
            title={`${task.id}.sql`}
            dataKey={task.sqlKey}
            onRun={() => setSqlRan(true)}
            showEvaluate={false}
          />
        )}
        <ProduceFirst
          id={`p3-${task.id}`}
          prompt={task.title}
          minWords={task.minWords}
          mockKey={task.mockKey}
          arjunAnswer={task.arjunAnswer}
          onSubmit={async ({ answer }) => { setPfDone(true); setTimeout(() => onDone(answer), 400); }}
        />
      </div>
    </div>
  );
}

export default function Phase3Section({ onDone }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleTaskDone = (taskId, val) => {
    const next = completedCount + 1;
    setAnswers(prev => ({ ...prev, [taskId]: val }));
    setCompletedCount(next);
  };

  return (
    <div>
      {/* ── Open workbench header ── */}
      <div className="border-b px-6 py-6 mb-6"
        style={{ background: 'rgba(61,214,140,0.04)', borderColor: 'rgba(61,214,140,0.15)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(61,214,140,0.1)', border: '1px solid rgba(61,214,140,0.25)' }}>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3DD68C' }}>
                Phase 3 · Execute
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>Open workbench · No hints</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            New restaurants are getting top visibility.
            <span className="ml-2 font-mono text-lg font-bold" style={{ color: '#3DD68C' }}>Users are churning.</span>
          </h2>
          <p className="text-sm" style={{ color: 'var(--ink2)' }}>
            Quantify it. Model the fix. Design the health score. Write the recommendation. All 9 tables available.
          </p>
        </div>
      </div>

      <div className="px-5 pb-6">
        <ArjunVoice label="Phase 3 — No step structure" variant="p3">
          No guided steps. No hints unless you ask for them. This is the open workbench — closest to a real BigQuery session. Four tasks. You design the analysis.
        </ArjunVoice>

        <SchemaPanel compact={true} />

        {P3_TASKS.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDone={(val) => handleTaskDone(task.id, val)}
          />
        ))}

        {completedCount >= P3_TASKS.length && (
          <button
            onClick={() => onDone(answers)}
            className="w-full py-4 text-white font-semibold rounded-xl text-sm btn-depress transition-all hover:-translate-y-px"
            style={{ background: '#1A6B45', boxShadow: '0 4px 20px rgba(61,214,140,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#135435'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A6B45'}
          >
            Get your full debrief + portfolio →
          </button>
        )}
      </div>
    </div>
  );
}
