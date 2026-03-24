import React, { useState } from 'react';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import SqlWorkbench from '../shared/SqlWorkbench.jsx';
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
          onSubmit={async (val) => { setPfDone(true); setTimeout(() => onDone(val), 400); }}
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
    <div className="px-5 pb-6">
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-phase3 uppercase">Phase 3 · Execute</span>
        <div className="flex-1 h-px bg-border" />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold border bg-phase3-bg text-phase3 border-phase3-border">Open workbench</span>
      </div>

      <ArjunVoice label="Phase 3 — No step structure" phase={3}>
        No guided steps. No hints unless you ask for them. This is the open workbench — closest to a real BigQuery session. Four tasks. All 10 tables available. You design the analysis.
      </ArjunVoice>

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
          className="w-full py-3.5 bg-phase3 text-white font-medium rounded-xl text-sm hover:bg-green-800 hover:-translate-y-px transition-all"
        >
          Get your full debrief + portfolio →
        </button>
      )}
    </div>
  );
}
