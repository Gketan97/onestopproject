// src/components/strategy/components/DesktopGate.jsx
// Sprint 6 — Mobile gate for /strategy/* routes
//
// Shows a polished holding screen on viewports < 768px.
// Explains the desktop-only workbench, lets user copy the URL,
// and provides a back-to-home link.
// Zero workbench components mount when this renders.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ORANGE = '#FC8019';

export default function DesktopGate() {
  const navigate            = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // clipboard blocked — silently fail
    }
  };

  return (
    <div
      role="main"
      aria-label="Desktop required"
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── Section 1: Icon + label ── */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: ORANGE,
            marginBottom: 14,
          }}
        />
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          color: 'var(--ink3)', textTransform: 'uppercase',
          letterSpacing: '0.12em', marginBottom: 28, textAlign: 'center',
        }}>
          Case Study Simulator
        </p>

        {/* ── Section 2: Headline block ── */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: 'var(--ink)',
          lineHeight: 1.25, textAlign: 'center', marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          This investigation runs on desktop.
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--ink2)', lineHeight: 1.75,
          textAlign: 'center', marginBottom: 0, marginTop: 0,
        }}>
          The Swiggy case is built around a split-screen workbench — live data on one side,
          your AI thinking partner on the other. It needs a real keyboard and screen to work properly.
        </p>

        {/* ── Section 3: Divider + copy-link CTA ── */}
        <div style={{
          width: '100%',
          height: 1,
          background: 'rgba(255,255,255,0.07)',
          margin: '28px 0',
        }} />

        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          color: 'var(--ink3)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 10, alignSelf: 'flex-start',
        }}>
          Open on your laptop
        </p>

        {/* URL row */}
        <div style={{
          display: 'flex', gap: 8, width: '100%', marginBottom: 8,
        }}>
          <div style={{
            flex: 1, minWidth: 0,
            background: 'var(--bg-raised, rgba(255,255,255,0.04))',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '10px 14px',
            overflow: 'hidden',
          }}>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink2)',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {window.location.href}
            </p>
          </div>

          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.95 }}
            style={{
              flexShrink: 0,
              background: ORANGE, color: '#fff',
              border: 'none', borderRadius: 6,
              padding: '8px 14px',
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.15s',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy link'}
          </motion.button>
        </div>

        <p style={{
          fontSize: 13, color: 'var(--ink3)',
          alignSelf: 'flex-start', marginTop: 0,
        }}>
          Paste this in your desktop browser to start the investigation.
        </p>

        {/* ── Section 4: Secondary note + back link ── */}
        <p style={{
          fontSize: 12, color: 'var(--ink3)', opacity: 0.55,
          textAlign: 'center', marginTop: 32, lineHeight: 1.6,
        }}>
          Jobs, referrals, and mentors work great on mobile — only the case study needs a desktop.
        </p>

        <motion.span
          onClick={() => navigate('/')}
          whileHover={{ textDecoration: 'underline' }}
          style={{
            fontFamily: 'var(--mono)', fontSize: 11,
            color: ORANGE, textDecoration: 'none',
            display: 'inline-block', marginTop: 16,
            cursor: 'pointer',
          }}
        >
          ← Back to home
        </motion.span>
      </motion.div>
    </div>
  );
}