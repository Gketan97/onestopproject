// src/components/strategy/components/ThinkingReveal.jsx
// CP-6B: Sprint 6 — Metacognitive Layering
//
// CHANGES FROM CP12:
//   1. expertAnalysis now has shape: { title, layers: [{ id, label, icon, sublabel, items[] }] }
//   2. Each layer unblurs progressively with staggered delays:
//      - Layer 0 (Observations) → reveals at 0ms
//      - Layer 1 (Inferences)   → reveals at 300ms
//      - Layer 2 (Frameworks)   → reveals at 600ms
//   3. The outer card reveal animation is preserved.
//   4. "Commit your answer to unlock" overlay unchanged.
//
// Backward compat: if expertAnalysis uses old shape { insight, evidence[], implication }
// it falls back to the legacy single-block render so no regressions on existing data.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lightbulb } from 'lucide-react';

const ORANGE = '#FC8019';
const GREEN  = '#3DD68C';
const BLUE   = '#4F80FF';
const PURPLE = '#A78BFA';

// Layer accent colors — each layer gets its own hue
const LAYER_COLORS = {
  observations: BLUE,
  inferences:   ORANGE,
  frameworks:   PURPLE,
};

const LAYER_STAGGER_MS = 320; // delay between each layer reveal

// ── Single layer card ─────────────────────────────────────────────────────────
function LayerCard({ layer, isRevealed, layerIndex, milestoneColor }) {
  const color       = LAYER_COLORS[layer.id] || milestoneColor;
  const revealDelay = layerIndex * LAYER_STAGGER_MS * 0.001; // convert to seconds

  return (
    <motion.div
      animate={isRevealed
        ? { filter: 'blur(0px)', opacity: 1, y: 0 }
        : { filter: 'blur(14px)', opacity: 0.35, y: 4 }
      }
      transition={isRevealed
        ? { duration: 1.1, delay: revealDelay, ease: [0.16, 1, 0.3, 1] }
        : { duration: 0.25 }
      }
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${isRevealed ? `${color}28` : 'rgba(255,255,255,0.05)'}`,
        background: isRevealed
          ? `linear-gradient(135deg, ${color}06 0%, rgba(255,255,255,0.02) 100%)`
          : 'rgba(255,255,255,0.02)',
        marginBottom: 8,
        transition: 'border-color 0.5s, background 0.5s',
        userSelect: isRevealed ? 'text' : 'none',
        pointerEvents: isRevealed ? 'auto' : 'none',
      }}
    >
      {/* Layer header */}
      <div style={{
        padding: '8px 12px',
        background: isRevealed ? `${color}0C` : 'rgba(0,0,0,0.15)',
        borderBottom: `1px solid ${isRevealed ? `${color}18` : 'rgba(255,255,255,0.04)'}`,
        display: 'flex', alignItems: 'center', gap: 7,
        transition: 'background 0.5s, border-color 0.5s',
      }}>
        <span style={{ fontSize: 11, lineHeight: 1 }}>{layer.icon}</span>
        <div style={{ flex: 1 }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800,
            color: isRevealed ? color : 'var(--ink3)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            transition: 'color 0.5s',
          }}>
            {layer.label}
          </span>
          {layer.sublabel && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9,
              color: 'var(--ink3)', marginLeft: 8,
              transition: 'color 0.5s',
            }}>
              — {layer.sublabel}
            </span>
          )}
        </div>
        {/* Stagger badge */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: revealDelay + 0.4, duration: 0.3 }}
            style={{
              fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700,
              color: color, padding: '2px 6px', borderRadius: 4,
              background: `${color}12`, border: `1px solid ${color}25`,
            }}
          >
            {String(layerIndex + 1).padStart(2, '0')}
          </motion.div>
        )}
      </div>

      {/* Layer items */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {layer.items.map((item, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: isRevealed ? 1 : 0.3 }}
            transition={{ duration: 0.5, delay: isRevealed ? revealDelay + i * 0.1 : 0 }}
            style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '6px 9px', borderRadius: 7,
              background: isRevealed ? `${color}06` : 'rgba(255,255,255,0.015)',
              border: `1px solid ${isRevealed ? `${color}14` : 'rgba(255,255,255,0.04)'}`,
              transition: 'background 0.4s, border-color 0.4s',
            }}
          >
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              color: isRevealed ? color : 'var(--ink3)',
              flexShrink: 0, marginTop: 2,
              transition: 'color 0.4s',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{
              fontSize: 12, color: isRevealed ? 'var(--ink2)' : 'var(--ink3)',
              lineHeight: 1.65, margin: 0,
              transition: 'color 0.4s',
            }}>
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Legacy single-block render (backward compat) ──────────────────────────────
function LegacyBody({ expertAnalysis, isRevealed, milestoneColor }) {
  const { insight, evidence = [], implication } = expertAnalysis;
  return (
    <div style={{ padding: '16px' }}>
      <p style={{
        fontSize: 14, fontWeight: 600, lineHeight: 1.72,
        color: isRevealed ? 'var(--ink)' : 'var(--ink3)',
        marginBottom: 14, transition: 'color 0.6s',
      }}>
        {insight}
      </p>
      {evidence.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            color: isRevealed ? milestoneColor : 'var(--ink3)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
            transition: 'color 0.6s',
          }}>Evidence</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {evidence.map((e, i) => (
              <motion.div
                key={i}
                animate={{ opacity: isRevealed ? 1 : 0.4 }}
                transition={{ duration: 0.6, delay: isRevealed ? i * 0.12 : 0 }}
                style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '7px 10px', borderRadius: 8,
                  background: isRevealed ? `${milestoneColor}07` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isRevealed ? `${milestoneColor}18` : 'rgba(255,255,255,0.05)'}`,
                  transition: 'background 0.4s, border-color 0.4s',
                }}
              >
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                  color: milestoneColor, flexShrink: 0, marginTop: 2,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={{ fontSize: 12, color: isRevealed ? 'var(--ink2)' : 'var(--ink3)', lineHeight: 1.6, margin: 0, transition: 'color 0.4s' }}>{e}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {implication && (
        <motion.div
          animate={{ opacity: isRevealed ? 1 : 0.3 }}
          transition={{ duration: 0.8, delay: isRevealed ? 0.4 : 0 }}
          style={{
            padding: '10px 12px', borderRadius: 9,
            background: isRevealed ? `${GREEN}08` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isRevealed ? `${GREEN}22` : 'rgba(255,255,255,0.04)'}`,
            transition: 'background 0.5s, border-color 0.5s',
          }}
        >
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: isRevealed ? GREEN : 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, transition: 'color 0.5s' }}>What this means</p>
          <p style={{ fontSize: 12, color: isRevealed ? 'var(--ink)' : 'var(--ink3)', lineHeight: 1.65, margin: 0, fontStyle: 'italic', transition: 'color 0.5s' }}>{implication}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Main ThinkingReveal ───────────────────────────────────────────────────────
export default function ThinkingReveal({
  expertAnalysis,
  isRevealed,
  milestoneColor = ORANGE,
  onRevealDone,
}) {
  const [animDone, setAnimDone]               = useState(false);
  const [wasEverRevealed, setWasEverRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed) setWasEverRevealed(true);
  }, [isRevealed]);

  if (!expertAnalysis) return null;

  // Detect shape — new 3-layer vs legacy
  const isThreeLayer = Array.isArray(expertAnalysis.layers) && expertAnalysis.layers.length > 0;

  return (
    <div style={{ position: 'relative', marginTop: 16 }}>

      {/* Label above the card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <Lightbulb size={11} color={milestoneColor} />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          color: milestoneColor, textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {isRevealed ? "Arjun's expert read" : "Arjun's analysis — locked until you commit"}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          {isRevealed
            ? <Eye size={11} color={milestoneColor} />
            : <EyeOff size={11} color="var(--ink3)" />
          }
        </div>
      </div>

      {/* Outer card wrapper — scales up on reveal */}
      <motion.div
        animate={isRevealed
          ? { scale: 1.012, opacity: 1 }
          : { scale: 1,     opacity: 0.55 }
        }
        transition={isRevealed
          ? { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.3 }
        }
        onAnimationComplete={() => {
          if (isRevealed && !animDone) {
            setAnimDone(true);
            onRevealDone?.();
          }
        }}
        style={{
          borderRadius: 14, overflow: 'hidden',
          border: `1px solid ${isRevealed ? `${milestoneColor}30` : 'rgba(255,255,255,0.06)'}`,
          background: isRevealed
            ? `linear-gradient(135deg, ${milestoneColor}05 0%, rgba(255,255,255,0.02) 100%)`
            : 'rgba(255,255,255,0.02)',
          transition: 'border-color 0.6s, background 0.6s',
        }}
      >
        {/* Header stripe */}
        <div style={{
          padding: '10px 16px',
          background: isRevealed ? `${milestoneColor}10` : 'rgba(0,0,0,0.2)',
          borderBottom: `1px solid ${isRevealed ? `${milestoneColor}20` : 'rgba(255,255,255,0.05)'}`,
          display: 'flex', alignItems: 'center', gap: 9,
          transition: 'background 0.6s, border-color 0.6s',
          position: 'relative',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${milestoneColor}18`, border: `1px solid ${milestoneColor}35`,
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: milestoneColor,
          }}>AJ</div>
          <div>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: milestoneColor,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1,
            }}>
              Staff Analyst · Expert Model
            </p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', margin: 0 }}>
              {expertAnalysis.title}
            </p>
          </div>

          {/* Reveal shimmer */}
          {isRevealed && !animDone && (
            <motion.div
              initial={{ x: '-100%', opacity: 0.6 }}
              animate={{ x: '300%', opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(90deg, transparent 0%, ${milestoneColor}25 50%, transparent 100%)`,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* 3-layer pill count */}
          {isThreeLayer && isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                marginLeft: 'auto', display: 'flex', gap: 4,
              }}
            >
              {expertAnalysis.layers.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  style={{
                    width: 20, height: 20, borderRadius: 5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${LAYER_COLORS[l.id] || milestoneColor}15`,
                    border: `1px solid ${LAYER_COLORS[l.id] || milestoneColor}30`,
                    fontSize: 10,
                  }}
                >
                  {l.icon}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '12px 14px' }}>
          {isThreeLayer ? (
            // ── 3-layer progressive unblur ──
            expertAnalysis.layers.map((layer, i) => (
              <LayerCard
                key={layer.id}
                layer={layer}
                isRevealed={isRevealed}
                layerIndex={i}
                milestoneColor={milestoneColor}
              />
            ))
          ) : (
            // ── Legacy single-block fallback ──
            <LegacyBody
              expertAnalysis={expertAnalysis}
              isRevealed={isRevealed}
              milestoneColor={milestoneColor}
            />
          )}
        </div>
      </motion.div>

      {/* "Commit your answer to unlock" overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 999,
              background: 'rgba(8,8,16,0.85)',
              border: `1px solid ${milestoneColor}30`,
              backdropFilter: 'blur(8px)',
            }}>
              <EyeOff size={11} color={milestoneColor} />
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                color: milestoneColor, letterSpacing: '0.06em',
              }}>
                Commit your answer to unlock
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}