/**
 * LayoutEngine.jsx
 * Core vertical-stream engine for the Strategic Incident Simulator.
 * - Ambient orbs (Swiggy Orange + Strategy Blue)
 * - Dotted background grid
 * - Fixed left timeline sidebar with 6 milestones
 * - Progressive reveal / fog-of-war via IntersectionObserver
 */

import React, {
  createContext, useContext, useCallback,
  useEffect, useRef, useState, useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Milestone config ──────────────────────────────────────────────────────────
export const MILESTONES = [
  { id: 'metric',     num: 1, label: 'Metric Scoping',   icon: '◎' },
  { id: 'sanity',     num: 2, label: 'Data Sanity',      icon: '⚠' },
  { id: 'hypothesis', num: 3, label: 'Hypothesis MECE',  icon: '⊞' },
  { id: 'synthesis',  num: 4, label: 'Synthesis',        icon: '◈' },
  { id: 'impact',     num: 5, label: 'Impact Sizing',    icon: '△' },
  { id: 'brief',      num: 6, label: 'Executive Brief',  icon: '✦' },
];

// ── Context ───────────────────────────────────────────────────────────────────
const EngineContext = createContext(null);

export function useEngine() {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error('useEngine must be used within LayoutEngine');
  return ctx;
}

// ── Ambient Orbs ──────────────────────────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600, right: -180, top: -120,
          background: 'radial-gradient(circle, rgba(252,128,25,0.13) 0%, rgba(252,128,25,0.04) 50%, transparent 75%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.12, 0.96, 1.08, 1], opacity: [0.7, 1, 0.75, 0.95, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700, left: -220, bottom: -200,
          background: 'radial-gradient(circle, rgba(30,79,204,0.15) 0%, rgba(30,79,204,0.05) 50%, transparent 75%)',
          filter: 'blur(48px)',
        }}
        animate={{ scale: [1, 1.08, 1.15, 0.98, 1], opacity: [0.6, 0.9, 0.65, 0.85, 0.6] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300, left: '20%', top: '35%',
          background: 'radial-gradient(circle, rgba(30,79,204,0.08) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
        animate={{ x: [0, 60, -40, 80, 0], y: [0, -80, 60, -30, 0], opacity: [0.4, 0.7, 0.35, 0.6, 0.4] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
    </div>
  );
}

// ── Dotted Grid ───────────────────────────────────────────────────────────────
function DottedGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
  );
}

// ── Timeline Sidebar ──────────────────────────────────────────────────────────
function TimelineSidebar({ activeMilestone, unlockedMilestones, onJump }) {
  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-0"
      style={{ paddingLeft: '18px' }}
    >
      <div
        className="absolute left-[26px] top-0 bottom-0 w-px"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      {MILESTONES.map((m) => {
        const isActive   = activeMilestone === m.id;
        const isUnlocked = unlockedMilestones.includes(m.id);
        return (
          <motion.button
            key={m.id}
            onClick={() => isUnlocked && onJump(m.id)}
            className="relative flex items-center gap-3 py-2.5 group"
            style={{ cursor: isUnlocked ? 'pointer' : 'default' }}
            whileHover={isUnlocked ? { x: 3 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <motion.div
              className="relative z-10 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: isActive ? 'var(--accent)' : isUnlocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid rgba(252,128,25,0.6)' : isUnlocked ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isActive ? '0 0 12px rgba(252,128,25,0.4)' : 'none',
              }}
              animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            >
              {isActive && <span style={{ fontSize: 7, color: 'white', fontWeight: 700 }}>{m.num}</span>}
              {isUnlocked && !isActive && <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.7)' }}>✓</span>}
            </motion.div>
            <AnimatePresence>
              {(isActive || isUnlocked) && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="flex flex-col"
                >
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase whitespace-nowrap"
                    style={{ color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}
                  >
                    {m.num}. {m.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Fog Block ─────────────────────────────────────────────────────────────────
function FogBlock({ children, isRevealed, blockId }) {
  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            key={`fog-${blockId}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.97) 100%)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Stream Block ──────────────────────────────────────────────────────────────
export function StreamBlock({ id, milestoneId, children, className = '', skipFog = false }) {
  const { revealedBlocks, registerBlock } = useEngine();
  const isRevealed = revealedBlocks.has(id);

  useEffect(() => {
    registerBlock(id, milestoneId);
  }, [id, milestoneId, registerBlock]);

  return (
    <motion.div
      id={`stream-block-${id}`}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {skipFog ? children : (
        <FogBlock isRevealed={isRevealed} blockId={id}>
          {children}
        </FogBlock>
      )}
    </motion.div>
  );
}

// ── Gate Button ───────────────────────────────────────────────────────────────
export function GateButton({ nextBlockId, label = 'Continue →', variant = 'primary', disabled = false }) {
  const { revealBlock } = useEngine();

  const styles = {
    primary:   { background: 'var(--accent)', boxShadow: '0 4px 24px rgba(252,128,25,0.3)', color: 'white' },
    strategic: { background: 'rgba(30,79,204,0.15)', border: '1px solid rgba(30,79,204,0.4)', color: '#4F80FF' },
    ghost:     { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' },
  };

  return (
    <motion.button
      onClick={() => !disabled && revealBlock(nextBlockId)}
      className="px-6 py-3 rounded-xl font-semibold text-sm font-mono tracking-wide"
      style={{ ...(styles[variant] || styles.primary), opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {label}
    </motion.button>
  );
}

// ── Main LayoutEngine ─────────────────────────────────────────────────────────
export default function LayoutEngine({ children, initialMilestone = 'metric', className = '' }) {
  const [revealedBlocks, setRevealedBlocks]         = useState(new Set(['root']));
  const [activeMilestone, setActiveMilestone]       = useState(initialMilestone);
  const [unlockedMilestones, setUnlockedMilestones] = useState([initialMilestone]);
  const blockRegistry = useRef(new Map());

  const registerBlock = useCallback((id, milestoneId) => {
    blockRegistry.current.set(id, milestoneId);
  }, []);

  const revealBlock = useCallback((id) => {
    setRevealedBlocks(prev => new Set([...prev, id]));
    const milestoneId = blockRegistry.current.get(id);
    if (milestoneId) {
      setActiveMilestone(milestoneId);
      setUnlockedMilestones(prev => prev.includes(milestoneId) ? prev : [...prev, milestoneId]);
    }
  }, []);

  const revealAll = useCallback(() => {
    setRevealedBlocks(new Set(['root', ...blockRegistry.current.keys()]));
  }, []);

  const onJump = useCallback((milestoneId) => {
    const el = document.querySelector(`[data-milestone="${milestoneId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const ctx = useMemo(() => ({
    revealedBlocks, activeMilestone, unlockedMilestones,
    revealBlock, revealAll, registerBlock,
  }), [revealedBlocks, activeMilestone, unlockedMilestones, revealBlock, revealAll, registerBlock]);

  return (
    <EngineContext.Provider value={ctx}>
      <DottedGrid />
      <AmbientOrbs />
      <TimelineSidebar
        activeMilestone={activeMilestone}
        unlockedMilestones={unlockedMilestones}
        onJump={onJump}
      />
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </EngineContext.Provider>
  );
}
