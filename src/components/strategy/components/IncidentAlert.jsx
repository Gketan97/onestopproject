// src/components/strategy/components/IncidentAlert.jsx
// CP-A: Narrative bridge — fires BEFORE PhaseOneIntro.
// Full-screen simulated Slack/PagerDuty alert from Priya (Head of Growth).
// Single CTA: "Enter War Room" → unmounts alert, fades in Arjun's warmup.
// No raw hex codes. Uses design tokens + named brand constants.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';

const ORANGE = '#FC8019';
const RED    = '#F38BA8';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';

// Simulated PagerDuty-style top bar with scanning line
function IncidentScanBar() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: 'rgba(243,139,168,0.15)',
      overflow: 'hidden',
    }}>
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${RED} 40%, ${ORANGE} 60%, transparent 100%)`,
        }}
      />
    </div>
  );
}

// Blinking alert dot
function PulseDot({ color = RED, size = 8 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%', background: color,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%', background: color,
      }} />
    </div>
  );
}

// Slack-style message row
function SlackMessage({ name, role, roleColor, initials, avatarColor, time, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${avatarColor}20`,
        border: `1px solid ${avatarColor}40`,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: avatarColor,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{name}</span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            color: roleColor, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{role}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 'auto' }}>{time}</span>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// Simulated system/bot message
function SystemMessage({ icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 8,
        background: `${color}08`,
        border: `1px solid ${color}20`,
        borderLeft: `2px solid ${color}`,
        marginLeft: 48, // align with message content
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
        color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color,
        marginLeft: 'auto',
      }}>{value}</span>
    </motion.div>
  );
}

export default function IncidentAlert({ onEnter }) {
  const [isExiting, setIsExiting] = useState(false);
  const [showCta, setShowCta] = useState(false);

  // Stagger the CTA appearance — give the message time to land
  useEffect(() => {
    const t = setTimeout(() => setShowCta(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    // Small delay so the exit animation plays before unmounting
    setTimeout(() => onEnter(), 550);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="incident-alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(5,5,10,0.97)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '24px',
          }}
        >
          {/* Ambient red glow — top left */}
          <div style={{
            position: 'fixed', top: -200, left: -200,
            width: 600, height: 600, borderRadius: '50%',
            background: `radial-gradient(circle, ${RED}12 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          {/* Main modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%', maxWidth: 560,
              borderRadius: 18, overflow: 'hidden',
              background: 'rgba(10,10,20,0.98)',
              border: `1px solid ${RED}30`,
              boxShadow: `0 0 0 1px ${RED}18, 0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${RED}10`,
              position: 'relative',
            }}
          >
            <IncidentScanBar />

            {/* ── PagerDuty-style alert header ── */}
            <div style={{
              padding: '14px 20px',
              background: `${RED}10`,
              borderBottom: `1px solid ${RED}20`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <PulseDot color={RED} size={8} />
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800,
                color: RED, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                CRITICAL INCIDENT · P0
              </span>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <AlertTriangle size={12} color={RED} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED }}>LIVE</span>
              </motion.div>
            </div>

            {/* ── Channel header ── */}
            <div style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink3)', fontWeight: 600 }}>
                #analytics-war-room
              </span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
                padding: '2px 7px', borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                Swiggy Analytics · North Bangalore
              </span>
            </div>

            {/* ── Message body ── */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Priya's Slack message */}
              <SlackMessage
                name="Priya"
                role="Head of Growth"
                roleColor={RED}
                initials="PR"
                avatarColor={RED}
                time="9:04 AM"
                delay={0.15}
              >
                <p style={{
                  fontSize: 15, color: 'var(--ink)', lineHeight: 1.72,
                  margin: 0,
                }}>
                  🚨{' '}
                  <strong style={{ color: RED }}>CRITICAL</strong>: Orders in North Bangalore down{' '}
                  <strong style={{ color: RED }}>8.3% week-over-week</strong>. Need a full breakdown
                  by EOD. Are you on this?
                </p>
              </SlackMessage>

              {/* Auto-generated incident metrics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <SystemMessage
                  icon={<AlertTriangle size={11} color={RED} />}
                  label="GMV impact"
                  value="₹19L and rising"
                  color={RED}
                  delay={0.55}
                />
                <SystemMessage
                  icon={<Zap size={11} color={ORANGE} />}
                  label="Started"
                  value="Tuesday — 72hrs active"
                  color={ORANGE}
                  delay={0.7}
                />
                <SystemMessage
                  icon={<div style={{ width: 11, height: 11, borderRadius: '50%', background: BLUE, opacity: 0.8 }} />}
                  label="Scope"
                  value="North Bangalore · All segments"
                  color={BLUE}
                  delay={0.85}
                />
              </motion.div>

              {/* Arjun joining message */}
              <SlackMessage
                name="Arjun"
                role="Staff Analyst"
                roleColor={ORANGE}
                initials="AJ"
                avatarColor={ORANGE}
                time="9:05 AM"
                delay={1.1}
              >
                <p style={{
                  fontSize: 14, color: 'var(--ink2)', lineHeight: 1.65,
                  margin: 0,
                }}>
                  I'll walk you through this one. Before we touch the data — tell me how you'd
                  approach it first.
                </p>
              </SlackMessage>

              {/* CTA — appears after message settles */}
              <AnimatePresence>
                {showCta && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ paddingTop: 4 }}
                  >
                    <motion.button
                      onClick={handleEnter}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '14px 24px', borderRadius: 12,
                        background: ORANGE,
                        color: '#fff',
                        fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 800,
                        border: 'none', cursor: 'pointer',
                        letterSpacing: '-0.01em',
                        boxShadow: `0 0 0 1px ${ORANGE}60, 0 4px 28px rgba(252,128,25,0.4)`,
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      Enter War Room
                      <ArrowRight size={16} />
                    </motion.button>
                    <p style={{
                      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)',
                      textAlign: 'center', marginTop: 10, marginBottom: 0,
                    }}>
                      Arjun is waiting · Priya needs this by EOD
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}