// src/components/strategy/components/ArjunSocraticChat.jsx
// CP3-E: Generic orchestrator — under 300 lines.
// All milestone components replaced by MilestoneRunner.
// MilestoneRespond stays separate (unique interaction model).
// Receives caseConfig as prop — no Swiggy-specific imports needed here.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, ChevronDown, ChevronRight } from 'lucide-react';
import {
  FUNNEL_THIS_WEEK, FUNNEL_LAST_WEEK,
  FUNNEL_NEW_USERS, FUNNEL_RETURNING_USERS,
  MILESTONES, PREDICTIONS,
} from '../data/swiggyStrategyData.js';
import { useArjunStrategy } from '../hooks/useArjunStrategy.js';
import { track } from '../../../analytics/posthog.js';
import { SWIGGY_CASE } from '../../../data/cases/swiggy.js';
import MilestoneRunner   from '../engine/MilestoneRunner.jsx';
import MilestoneRespond  from '../engine/MilestoneRespond.jsx';
import MilestoneStrip    from './MilestoneStrip.jsx';
import PlatformContextBar from './PlatformContextBar.jsx';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

const MILESTONE_COLORS = [ORANGE, BLUE, PURPLE, GREEN, RED, PURPLE, '#F9E2AF'];
const MILESTONE_PULSE_COLORS = { 0: ORANGE, 1: ORANGE, 2: BLUE, 3: PURPLE, 4: GREEN, 5: RED };

// Enrich caseData with funnel arrays MilestoneRunner's VizBlock needs
const CASE_DATA = {
  ...SWIGGY_CASE.data,
  funnelThisWeek:  FUNNEL_THIS_WEEK,
  funnelLastWeek:  FUNNEL_LAST_WEEK,
  funnelNewUsers:  FUNNEL_NEW_USERS,
  funnelReturning: FUNNEL_RETURNING_USERS,
};

// ── Log updating animation ────────────────────────────────────────────────────
function LogUpdating() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {[0,1,2].map(i => <motion.div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--ink3)' }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />)}
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>investigation log updating...</span>
    </motion.div>
  );
}

// ── Collapsed milestone card ──────────────────────────────────────────────────
function CollapsedMilestoneCard({ milestone, index, conclusion, isExpanded, onToggle }) {
  const color = MILESTONE_COLORS[index % MILESTONE_COLORS.length];
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.4 }} style={{ marginBottom: 8 }}>
      <div onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: isExpanded ? '10px 10px 0 0' : 10, cursor: 'pointer', background: `${color}06`, border: `1px solid ${color}18`, transition: 'background 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = `${color}0E`}
        onMouseLeave={e => e.currentTarget.style.background = `${color}06`}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}20`, border: `1.5px solid ${color}45` }}>
          <Check size={10} color={color} strokeWidth={3} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color, letterSpacing: '0.04em' }}>{milestone.number} {milestone.title}</span>
          {conclusion && <p style={{ fontSize: 12, color: 'var(--ink2)', margin: '2px 0 0', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isExpanded ? 'normal' : 'nowrap' }}>"{conclusion}"</p>}
        </div>
        <div style={{ color: 'var(--ink3)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{isExpanded ? 'collapse' : 'expand'}</span>
          {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main orchestrator ─────────────────────────────────────────────────────────
export default function ArjunSocraticChat({ phase, onVizRequest, onAdvance, onMilestoneAdvance, onExpertAnalysesUpdate, onLogUpdate }) {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [log, setLog]                                   = useState([]);
  const [expandedCards, setExpandedCards]               = useState(new Set());
  const [updating, setUpdating]                         = useState(false);

  const { callArjunMilestone, getExpertAnalyses } = useArjunStrategy();
  const milestoneRefs = useRef([]);
  const feedBottomRef = useRef(null);

  useEffect(() => {
    feedBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [log, activeMilestoneIndex, updating]);

  const completedIndices = log.map(e => MILESTONES[e.index]?.id).filter(Boolean);
  const currentPulseColor = MILESTONE_PULSE_COLORS[activeMilestoneIndex] || ORANGE;
  const currentMilestone  = MILESTONES[activeMilestoneIndex];

  const handleComplete = useCallback((index, conclusion) => {
    setUpdating(true);
    track('milestone_completed', {
      caseId:         'swiggy',
      milestoneId:    MILESTONES[index]?.id,
      milestoneIndex: index,
      hasConclusion:  !!conclusion,
    });
    setTimeout(() => {
      setUpdating(false);
      setLog(prev => {
        const next = [...prev, { index, conclusion }];
        onExpertAnalysesUpdate?.(getExpertAnalyses());
        onLogUpdate?.(next);
        return next;
      });
      if (index < MILESTONES.length - 1) {
        const nextIndex = index + 1;
        setTimeout(() => {
          setActiveMilestoneIndex(nextIndex);
          const nextMilestone = MILESTONES[nextIndex];
          if (nextMilestone) onMilestoneAdvance?.(nextMilestone.title.toUpperCase(), nextIndex, conclusion);
        }, 400);
      } else {
        setTimeout(() => onAdvance?.(), 2500);
      }
    }, 1200);
  }, [onAdvance, onMilestoneAdvance, getExpertAnalyses, onLogUpdate]);

  const toggleCard = useCallback((index) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  const handlePriyaPing = useCallback(() => {}, []);

  const headerLabel = currentMilestone
    ? `# analytics-incident · ${currentMilestone.number} ${currentMilestone.title}`
    : '# analytics-incident';

  // Map milestone index to prediction config
  const PREDICTION_MAP = { 1: PREDICTIONS.dashboard, 2: PREDICTIONS.funnel, 3: PREDICTIONS.rootcause };

  return (
    <div>
      {/* Channel header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <MessageSquare size={13} color="var(--ink3)" />
        <motion.span key={headerLabel} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
          {headerLabel}
        </motion.span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: RED, display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Incident Active</span>
        </div>
      </div>

      <MilestoneStrip currentIndex={activeMilestoneIndex} completedIndices={completedIndices} onMilestoneClick={(idx) => milestoneRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />

      {/* Completed cards */}
      {log.map((entry) => (
        <div key={entry.index} ref={el => { milestoneRefs.current[entry.index] = el; }}>
          <CollapsedMilestoneCard
            milestone={MILESTONES[entry.index]}
            index={entry.index}
            conclusion={entry.conclusion}
            isExpanded={expandedCards.has(entry.index)}
            onToggle={() => toggleCard(entry.index)}
          />
        </div>
      ))}

      <AnimatePresence>{updating && <LogUpdating />}</AnimatePresence>

      {/* Active milestone */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeMilestoneIndex}
          ref={el => { milestoneRefs.current[activeMilestoneIndex] = el; }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: log.length > 0 ? 16 : 0 }}
        >
          {log.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: `${currentPulseColor}20` }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: currentPulseColor, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {currentMilestone?.number} {currentMilestone?.title}
              </span>
              <div style={{ flex: 1, height: 1, background: `${currentPulseColor}20` }} />
            </div>
          )}

          {/* Milestones 0–4 via MilestoneRunner */}
          {activeMilestoneIndex <= 4 && (
            <MilestoneRunner
              config={MILESTONES[activeMilestoneIndex]}
              caseData={CASE_DATA}
              onComplete={(c) => handleComplete(activeMilestoneIndex, c)}
              callArjunMilestone={callArjunMilestone}
              onPriyaPing={handlePriyaPing}
              milestoneColor={MILESTONE_COLORS[activeMilestoneIndex]}
              pulseColor={currentPulseColor}
              milestoneIndex={activeMilestoneIndex}
              prediction={PREDICTION_MAP[activeMilestoneIndex] || null}
            />
          )}

          {/* Milestone 5 — Respond (separate) */}
          {activeMilestoneIndex === 5 && (
            <MilestoneRespond
              onComplete={(c) => handleComplete(5, c)}
              callArjunMilestone={callArjunMilestone}
              investigationLog={log}
              onPriyaPing={handlePriyaPing}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div ref={feedBottomRef} style={{ height: 1 }} />
      <PlatformContextBar milestonesCompleted={log.length} />
    </div>
  );
}
