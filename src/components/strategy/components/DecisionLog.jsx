// src/components/strategy/components/DecisionLog.jsx
// Sprint 5 — Decision Log Artifact
//
// Generated on Milestone 6 (Respond to Priya) completion.
// Shows a clean, printable two-column view:
//   Left col:  user's inputs per milestone (their synthesis sentences)
//   Right col: Arjun's unblurred expert analysis (ThinkingReveal content)
//
// Props:
//   investigationLog  — [{ index, conclusion }] from ArjunSocraticChat
//   expertAnalyses    — { [milestoneIndex]: expertAnalysis } from useArjunStrategy
//   scenario          — SCENARIO object
//   onClose           — dismiss callback

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
import { MILESTONES } from '../data/swiggyStrategyData.js';

const ORANGE = '#FC8019';
const GREEN  = '#3DD68C';
const BLUE   = '#4F80FF';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';
const MILESTONE_COLORS = [ORANGE, BLUE, PURPLE, GREEN, RED, PURPLE, '#F9E2AF'];

// ── Print trigger ──────────────────────────────────────────────────────────────
function triggerPrint() {
  window.print();
}

// ── Single log row — user input vs Arjun's expert read ───────────────────────
function LogRow({ entry, expertAnalysis, index }) {
  const milestone = MILESTONES[entry.index];
  const color     = MILESTONE_COLORS[entry.index % MILESTONE_COLORS.length];
  if (!milestone) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Left: user input */}
      <div style={{
        padding: '16px 18px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${color}18`, border: `1px solid ${color}35`,
            fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 800, color,
          }}>
            {milestone.number}
          </div>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            color, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {milestone.title}
          </span>
        </div>
        {entry.conclusion ? (
          <p style={{
            fontSize: 13, color: 'var(--ink)', lineHeight: 1.65,
            margin: 0, fontStyle: 'italic',
            padding: '9px 12px', borderRadius: 8,
            background: `${color}06`, border: `1px solid ${color}12`,
          }}>
            "{entry.conclusion}"
          </p>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--ink3)', margin: 0, fontStyle: 'italic' }}>
            No synthesis recorded.
          </p>
        )}
      </div>

      {/* Right: Arjun's expert analysis */}
      <div style={{ padding: '16px 18px' }}>
        {expertAnalysis ? (
          <>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.07em',
              marginBottom: 8,
            }}>
              Arjun's read
            </p>
            <p style={{
              fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 8,
            }}>
              {expertAnalysis.insight}
            </p>
            {expertAnalysis.implication && (
              <p style={{
                fontSize: 11, color: GREEN, lineHeight: 1.6,
                fontFamily: 'var(--mono)', margin: 0,
                padding: '6px 10px', borderRadius: 7,
                background: `${GREEN}08`, border: `1px solid ${GREEN}18`,
              }}>
                → {expertAnalysis.implication}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--ink3)', margin: 0, marginTop: 24 }}>
            Expert analysis not available for this milestone.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DecisionLog({
  investigationLog = [],
  expertAnalyses   = {},
  scenario,
  onClose,
}) {
  const printRef = useRef(null);

  const completedEntries = investigationLog.filter(e => e.conclusion || expertAnalyses[e.index]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.88)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '32px 16px',
          overflowY: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          ref={printRef}
          style={{
            width: '100%', maxWidth: 900,
            background: '#080810',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 32px 64px rgba(0,0,0,0.7)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN }}
                />
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                  color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  Investigation Complete
                </span>
              </div>
              <h2 style={{
                fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em',
                color: 'var(--ink)', margin: 0,
              }}>
                Decision Log — {scenario?.company || 'Swiggy'} Incident
              </h2>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginTop: 4 }}>
                {scenario?.city} · {scenario?.period} · {scenario?.drop} GMV drop · {scenario?.category} category
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <motion.button
                onClick={triggerPrint}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 9,
                  background: `${ORANGE}12`, border: `1px solid ${ORANGE}25`,
                  color: ORANGE, cursor: 'pointer',
                  fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
                }}
              >
                <Download size={12} /> Export
              </motion.button>
              {onClose && (
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} color="var(--ink3)" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{
              padding: '10px 18px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                Your Thinking
              </span>
            </div>
            <div style={{ padding: '10px 18px' }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                Arjun's Expert Read (unblurred)
              </span>
            </div>
          </div>

          {/* Rows */}
          {completedEntries.length > 0 ? (
            completedEntries.map((entry, i) => (
              <LogRow
                key={i}
                entry={entry}
                expertAnalysis={expertAnalyses[entry.index]}
                index={i}
              />
            ))
          ) : (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>
                No investigation log entries yet.
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: '14px 24px',
            background: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
            }}>
              OneStopCareers · Strategic Incident Simulator · onestopcareers.com
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE }}>
                {completedEntries.length} milestones completed
              </span>
            </div>
          </div>
        </motion.div>

        {/* Print styles injected inline */}
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #decision-log-print, #decision-log-print * { visibility: visible !important; }
            #decision-log-print {
              position: fixed; inset: 0; background: white !important;
              color: black !important; font-size: 11pt;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}