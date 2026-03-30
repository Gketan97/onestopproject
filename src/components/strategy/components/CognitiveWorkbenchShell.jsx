// src/components/strategy/components/CognitiveWorkbenchShell.jsx
// CP11: Sprint 2 — The Split-Pane Cognitive Workbench Shell
//
// ARCHITECTURE:
//   - IncidentHUD: Sticky top bar — pulsing red dot, incident ID, live status,
//     animated loss counter ticking up in real time.
//   - WorkbenchGrid: Two-column CSS Grid
//       Left (68%)  — "The Terminal" — scrollable data visualization stack
//       Right (32%) — "The Strategy Pad" — sticky chat feed container
//
// PROPS:
//   <CognitiveWorkbenchShell
//     milestoneName="SCOPE THE PROBLEM"      // current milestone label for HUD
//     lossAmount={1900000}                   // initial GMV loss in ₹ (e.g. ₹19L = 1900000)
//     lossTickRate={1200}                    // ₹ added per second to the counter
//     terminalBlocks={[...]}                 // array of { id, component } for Terminal Stack
//     onBlockUnlock={(blockId) => void}      // called when a new block is appended
//   >
//     {children}                            // right-pane content (ArjunSocraticChat)
//   </CognitiveWorkbenchShell>

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ORANGE = '#FC8019';
const RED    = '#F38BA8';
const GREEN  = '#3DD68C';
const BLUE   = '#4F80FF';

// ── Rupee formatter ───────────────────────────────────────────────────────────
function formatRupees(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

// ── Animated loss counter ─────────────────────────────────────────────────────
// Ticks up every second. Starts from lossAmount, increments by lossTickRate/s.
// The digits animate individually for a slot-machine effect.
function LossCounter({ initialAmount, tickRate = 1200 }) {
  const [amount, setAmount] = useState(initialAmount);
  const startTime = useRef(Date.now());
  const rafRef    = useRef(null);

  useEffect(() => {
    startTime.current = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      setAmount(initialAmount + elapsed * tickRate);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initialAmount, tickRate]);

  const display = formatRupees(amount);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--ink3)',
      }}>
        LIVE LOSS:
      </span>
      <motion.span
        key={display}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.08 }}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 13,
          fontWeight: 800,
          color: RED,
          letterSpacing: '0.04em',
          minWidth: 72,
          display: 'inline-block',
        }}
      >
        -{display}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: RED,
          opacity: 0.7,
        }}
      >
        and counting
      </motion.span>
    </div>
  );
}

// ── Incident HUD ──────────────────────────────────────────────────────────────
// Sticky bar: [● INCIDENT #ANALYTICS-WAR-ROOM] [STATUS: INVESTIGATING [MILESTONE]] [-₹X and counting]
export function IncidentHUD({ milestoneName, lossAmount = 1900000, lossTickRate = 1200, visible = true }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(5,5,5,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(243,139,168,0.18)',
        padding: '0 24px',
        height: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: `0 1px 0 0 ${RED}12`,
      }}
    >
      {/* Left: Pulsing dot + incident ID */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <motion.div
          animate={{ opacity: [1, 0.25, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: RED,
            boxShadow: `0 0 8px ${RED}80`,
            flexShrink: 0,
          }}
        />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink3)',
          whiteSpace: 'nowrap',
        }}>
          INCIDENT #ANALYTICS-WAR-ROOM
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* Center: Status + milestone */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: RED,
          flexShrink: 0,
        }}>
          STATUS: INVESTIGATING
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={milestoneName}
            initial={{ opacity: 0, x: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              fontWeight: 800,
              color: ORANGE,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            [{milestoneName}]
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* Right: Live loss counter */}
      <div style={{ flexShrink: 0 }}>
        <LossCounter initialAmount={lossAmount} tickRate={lossTickRate} />
      </div>
    </motion.div>
  );
}

// ── Terminal Stack — left pane data block manager ─────────────────────────────
// Blocks are appended to the bottom as they unlock.
// Each block fades + slides in. Blocks are never removed — they persist for reference.
export function TerminalStack({ blocks = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 200);
    }
  }, [blocks.length]);

  if (blocks.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 320,
        gap: 12,
        padding: 32,
      }}>
        {/* Terminal idle state */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(252,128,25,0.08)',
          border: '1px solid rgba(252,128,25,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 18,
              height: 3,
              borderRadius: 2,
              background: ORANGE,
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--ink3)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 4,
          }}>
            TERMINAL IDLE
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.6 }}>
            Data blocks unlock as you progress through milestones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {blocks.map((block, i) => (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ marginBottom: i < blocks.length - 1 ? 16 : 0 }}
        >
          {/* Block header with unlock badge */}
          {block.label && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 0 10px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 12,
            }}>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: `${block.color || ORANGE}20`,
                  border: `1px solid ${block.color || ORANGE}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: block.color || ORANGE }} />
              </motion.div>
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: 9,
                fontWeight: 700,
                color: block.color || ORANGE,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {block.label}
              </span>
              <div style={{ flex: 1, height: 1, background: `${block.color || ORANGE}12` }} />
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: 9,
                color: 'var(--ink3)',
              }}>
                UNLOCKED
              </span>
            </div>
          )}
          {/* The actual data visualization */}
          {block.component}
        </motion.div>
      ))}
      <div ref={bottomRef} style={{ height: 1 }} />
    </div>
  );
}

// ── Workbench Grid Layout ─────────────────────────────────────────────────────
// Two-column grid: 68% Terminal (left) | 32% Strategy Pad (right)
// Left pane scrolls independently. Right pane is sticky within the viewport.
// On narrow screens (<900px), stacks vertically.
export function WorkbenchGrid({ terminalContent, strategyPadContent }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 68fr) minmax(0, 32fr)',
      gap: 0,
      alignItems: 'start',
      minHeight: 'calc(100vh - 44px)', // subtract HUD height
      // Responsive: stack on narrow screens
      // (handled via a style tag below for media query support)
    }}>
      {/* Left Pane — The Terminal */}
      <div
        id="terminal-pane"
        style={{
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '24px 28px 80px',
          minHeight: 'calc(100vh - 44px)',
          overflowY: 'auto',
          // Custom scrollbar
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(252,128,25,0.2) transparent',
        }}
      >
        {/* Terminal header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
          paddingBottom: 14,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 5, marginRight: 4 }}>
            {[RED, ORANGE, GREEN].map((c, i) => (
              <div key={i} style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: c,
                opacity: 0.6,
              }} />
            ))}
          </div>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
            flex: 1,
          }}>
            THE TERMINAL · DATA STACK
          </span>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 9,
              color: GREEN,
              letterSpacing: '0.08em',
            }}
          >
            LIVE
          </motion.div>
        </div>

        {/* Data blocks stack */}
        {terminalContent}
      </div>

      {/* Right Pane — The Strategy Pad */}
      <div
        id="strategy-pad"
        style={{
          position: 'sticky',
          top: 44, // HUD height
          height: 'calc(100vh - 44px)',
          overflowY: 'auto',
          padding: '24px 24px 80px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
        }}
      >
        {/* Strategy Pad header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 5, marginRight: 4 }}>
            {[BLUE, BLUE, BLUE].map((c, i) => (
              <div key={i} style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: c,
                opacity: i === 0 ? 0.6 : i === 1 ? 0.35 : 0.15,
              }} />
            ))}
          </div>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
            flex: 1,
          }}>
            STRATEGY PAD · INVESTIGATION FEED
          </span>
        </div>

        {strategyPadContent}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          #terminal-pane, #strategy-pad {
            display: block !important;
          }
          [id="terminal-pane"] + [id="strategy-pad"] {
            position: static !important;
            height: auto !important;
          }
        }
        #terminal-pane::-webkit-scrollbar { width: 4px; }
        #terminal-pane::-webkit-scrollbar-track { background: transparent; }
        #terminal-pane::-webkit-scrollbar-thumb { background: rgba(252,128,25,0.2); border-radius: 2px; }
        #strategy-pad::-webkit-scrollbar { width: 4px; }
        #strategy-pad::-webkit-scrollbar-track { background: transparent; }
        #strategy-pad::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ── Full Cognitive Workbench Shell ────────────────────────────────────────────
// Wraps IncidentHUD + WorkbenchGrid into a single shell component.
// Usage:
//   <CognitiveWorkbenchShell
//     milestoneName="SCOPE THE PROBLEM"
//     lossAmount={1900000}
//     terminalBlocks={terminalBlocks}
//   >
//     <ArjunSocraticChat ... />
//   </CognitiveWorkbenchShell>
export default function CognitiveWorkbenchShell({
  milestoneName = 'SCOPE THE PROBLEM',
  lossAmount    = 1900000,
  lossTickRate  = 1200,
  terminalBlocks = [],
  showHUD = true,
  children,
}) {
  return (
    <div style={{
      background: '#050505',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {/* Incident HUD — always at very top */}
      <AnimatePresence>
        {showHUD && (
          <IncidentHUD
            milestoneName={milestoneName}
            lossAmount={lossAmount}
            lossTickRate={lossTickRate}
          />
        )}
      </AnimatePresence>

      {/* Two-pane grid */}
      <WorkbenchGrid
        terminalContent={<TerminalStack blocks={terminalBlocks} />}
        strategyPadContent={children}
      />
    </div>
  );
}