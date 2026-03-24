import React, { useState, useCallback } from 'react';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import SqlWorkbench from '../shared/SqlWorkbench.jsx';
import { P3_TASKS } from '../data/swiggyData.js';

// Bug 12 fix: Task tracks completion via local state only. Parent tracks
// completed task IDs in a Set so double-firing never overshoots the count
// and every task is counted exactly once regardless of re-renders.
function Task({ task, onDone }) {
  const [pfDone, setPfDone] = useState(false);

  const handleSubmit = useCallback(({ answer }) => {
    if (pfDone) return; // guard against double-fire
    setPfDone(true);
    setTimeout(() => onDone(answer), 400);
  }, [pfDone, onDone]);

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
            onRun={() => {}}
            showEvaluate={false}
          />
        )}
        <ProduceFirst
          id={`p3-${task.id}`}
          prompt={task.title}
          minWords={task.minWords}
          mockKey={task.mockKey}
          arjunAnswer={task.arjunAnswer}
          onSubmit={handleSubmit}
        />
        {pfDone && (
          <p className="text-[11px] text-phase3 font-mono mt-1">✓ Task complete</p>
        )}
      </div>
    </div>
  );
}

export default function Phase3Section({ onDone }) {
  // Use a Set of completed task IDs — immune to double-fire and re-render order issues
  const [completedIds, setCompletedIds] = useState(new Set());
  const [answers, setAnswers] = useState({});

  const handleTaskDone = useCallback((taskId, val) => {
    setAnswers(prev => ({ ...prev, [taskId]: val }));
    setCompletedIds(prev => {
      if (prev.has(taskId)) return prev; // already counted — ignore
      return new Set([...prev, taskId]);
    });
  }, []);

  const allDone = completedIds.size >= P3_TASKS.length;

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

      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] text-ink3">{completedIds.size} / {P3_TASKS.length} tasks complete</span>
        <div className="flex gap-1">
          {P3_TASKS.map(t => (
            <span key={t.id}
              className={`w-2 h-2 rounded-full transition-colors ${completedIds.has(t.id) ? 'bg-phase3' : 'bg-border2'}`}
            />
          ))}
        </div>
      </div>

      {P3_TASKS.map((task) => (
        <Task
          key={task.id}
          task={task}
          onDone={(val) => handleTaskDone(task.id, val)}
        />
      ))}

      {allDone && (
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
