// src/components/strategy/hooks/useSessionCheckpoint.js
// Sprint 6 — Session persistence + exit capture
//
// Exports:
//   useSessionCheckpoint() — localStorage save/restore for simulation progress
//   RestorePromptBanner    — sticky banner shown when a valid save exists
//   useExitCapture()       — exit-intent modal via mouseleave (desktop only)

import React, { useState, useEffect, useRef, useCallback, createPortal } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MILESTONES } from '../data/swiggyStrategyData.js';

const STORAGE_KEY   = 'osc_checkpoint_v1';
const PHONE_KEY     = 'osc_exit_phone';
const ORANGE        = '#FC8019';
const GREEN         = '#3DD68C';
const MAX_AGE_MS    = 48 * 60 * 60 * 1000; // 48 hours

// ── Safe localStorage helpers ─────────────────────────────────────────────────
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}
function lsClear(key) {
  try { localStorage.removeItem(key); } catch { /* private mode */ }
}

// ── useSessionCheckpoint ──────────────────────────────────────────────────────
export function useSessionCheckpoint() {
  const [checkpoint, setCheckpoint] = useState(() => {
    const saved = lsGet(STORAGE_KEY);
    if (!saved) return null;
    // Expire stale saves
    if (Date.now() - new Date(saved.savedAt).getTime() > MAX_AGE_MS) {
      lsClear(STORAGE_KEY);
      return null;
    }
    return saved;
  });

  const debounceRef = useRef(null);

  const saveCheckpoint = useCallback((phase, milestoneIndex, log) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const data = { phase, milestoneIndex, log, savedAt: new Date().toISOString() };
      lsSet(STORAGE_KEY, data);
      setCheckpoint(data);
    }, 500);
  }, []);

  const clearCheckpoint = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    lsClear(STORAGE_KEY);
    setCheckpoint(null);
  }, []);

  return {
    savedPhase:          checkpoint?.phase          ?? null,
    savedMilestoneIndex: checkpoint?.milestoneIndex ?? null,
    savedLog:            checkpoint?.log            ?? [],
    hasSave:             !!checkpoint,
    saveCheckpoint,
    clearCheckpoint,
  };
}

// ── RestorePromptBanner ───────────────────────────────────────────────────────
export function RestorePromptBanner({ hasSave, savedMilestoneIndex, onResume, onDiscard }) {
  const [visible, setVisible] = useState(hasSave);

  useEffect(() => { setVisible(hasSave); }, [hasSave]);

  if (!visible) return null;

  const milestoneTitle = savedMilestoneIndex !== null
    ? (MILESTONES[savedMilestoneIndex]?.title ?? `Milestone ${savedMilestoneIndex + 1}`)
    : null;

  const handleResume = () => {
    setVisible(false);
    onResume?.();
  };

  const handleDiscard = () => {
    setVisible(false);
    onDiscard?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'rgba(252,128,25,0.08)',
            borderBottom: '1px solid rgba(252,128,25,0.22)',
            padding: '10px 24px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {/* Left: pulse dot + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE, flexShrink: 0 }}
            />
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
              color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.08em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {milestoneTitle
                ? `You were at Milestone ${savedMilestoneIndex + 1} — ${milestoneTitle}. Resume from where you stopped?`
                : 'You have a saved session. Resume from where you stopped?'
              }
            </span>
          </div>

          {/* Right: Resume + Start fresh + dismiss */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <motion.button
              onClick={handleResume}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{
                padding: '6px 16px', borderRadius: 7,
                background: ORANGE, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                boxShadow: `0 2px 10px rgba(252,128,25,0.35)`,
              }}
            >
              Resume
            </motion.button>

            <button
              onClick={handleDiscard}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--mono)', fontSize: 11,
                color: 'var(--ink3)', padding: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
            >
              Start fresh
            </button>

            <button
              onClick={handleDiscard}
              style={{
                background: 'rgba(255,255,255,0.06)', border: 'none',
                borderRadius: '50%', width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--ink3)',
                fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Exit Capture Modal (portal) ───────────────────────────────────────────────
function ExitCaptureModal({ onClose }) {
  const [phone, setPhone]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]     = useState(false);
  const canSubmit = phone.replace(/\D/g, '').length >= 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    lsSet(PHONE_KEY, phone);
    setSubmitted(true);
    setTimeout(() => onClose(), 2800);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 440,
          borderRadius: 20, overflow: 'hidden',
          background: 'rgba(10,10,20,0.98)',
          border: `1px solid ${ORANGE}35`,
          boxShadow: `0 0 0 1px ${ORANGE}15, 0 24px 60px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Header stripe */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
        }} />

        <div style={{ padding: '24px 24px 28px' }}>
          {!submitted ? (
            <>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                background: `${ORANGE}15`, border: `1px solid ${ORANGE}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                ⚡
              </div>

              <h3 style={{
                fontSize: 18, fontWeight: 800, color: 'var(--ink)',
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>
                You're 70% done — don't lose your progress.
              </h3>
              <p style={{
                fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 20,
              }}>
                Get your investigation link on WhatsApp — pick up exactly where you left off.
              </p>

              {/* Phone input */}
              <div style={{
                display: 'flex', alignItems: 'center',
                borderRadius: 10, overflow: 'hidden',
                border: `1px solid ${focused ? ORANGE : 'rgba(255,255,255,0.1)'}`,
                background: 'rgba(255,255,255,0.04)',
                marginBottom: 12,
                transition: 'border-color 0.18s',
                boxShadow: focused ? `0 0 0 1px ${ORANGE}30` : 'none',
              }}>
                <span style={{
                  padding: '12px 14px',
                  fontFamily: 'var(--mono)', fontSize: 13,
                  color: 'var(--ink3)',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  flexShrink: 0,
                }}>
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^\d\s\-]/g, ''))}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="98765 43210"
                  style={{
                    flex: 1, padding: '12px 14px',
                    background: 'none', border: 'none', outline: 'none',
                    fontFamily: 'var(--mono)', fontSize: 13,
                    color: 'var(--ink)',
                  }}
                />
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                whileHover={canSubmit ? { scale: 1.02, y: -1 } : {}}
                whileTap={canSubmit ? { scale: 0.97 } : {}}
                style={{
                  width: '100%', padding: '12px 20px', borderRadius: 10,
                  background: canSubmit ? ORANGE : 'rgba(255,255,255,0.05)',
                  color: canSubmit ? '#fff' : 'var(--ink3)',
                  border: 'none', cursor: canSubmit ? 'pointer' : 'default',
                  fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700,
                  transition: 'all 0.15s',
                  boxShadow: canSubmit ? `0 2px 16px ${ORANGE}40` : 'none',
                  marginBottom: 12,
                }}
              >
                Send me my progress link
              </motion.button>

              {/* Dismiss */}
              <button
                onClick={onClose}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '8px 0',
                  fontFamily: 'var(--mono)', fontSize: 11,
                  color: 'var(--ink3)', transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
              >
                No thanks, I'll come back later
              </button>
            </>
          ) : (
            // Confirmation state
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '16px 0' }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: GREEN, marginBottom: 8 }}>
                We'll WhatsApp you a link to continue.
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6 }}>
                Check WhatsApp on +91 {phone} in a few minutes.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ── useExitCapture ────────────────────────────────────────────────────────────
// Tracks cursor leaving viewport (exit intent, desktop only).
// Fires once per session when milestoneIndex >= 2 and portfolio not yet generated.
export function useExitCapture(milestoneIndex, portfolioGenerated) {
  const [showModal, setShowModal] = useState(false);
  const firedRef                  = useRef(false);
  const debounceRef               = useRef(null);

  useEffect(() => {
    // Don't attach if: already fired, portfolio done, or not far enough
    if (firedRef.current || portfolioGenerated || milestoneIndex < 2) return;

    const handleMouseLeave = (e) => {
      // Only trigger when cursor leaves through the top of the viewport
      if (e.clientY > 20) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (firedRef.current) return;
        firedRef.current = true;
        setShowModal(true);
      }, 400);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [milestoneIndex, portfolioGenerated]);

  // Reset if portfolio completes mid-session
  useEffect(() => {
    if (portfolioGenerated) setShowModal(false);
  }, [portfolioGenerated]);

  const handleClose = useCallback(() => setShowModal(false), []);

  return (
    <AnimatePresence>
      {showModal && <ExitCaptureModal onClose={handleClose} />}
    </AnimatePresence>
  );
}