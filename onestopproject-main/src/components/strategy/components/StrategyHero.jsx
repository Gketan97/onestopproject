// src/components/strategy/components/StrategyHero.jsx
// Full-screen SaaS-Noir hero — "The AI will pull the data. Can you make the decision?"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

// Animated word cycle for the sub-headline
const ROLES = ['PMs', 'Strategy Leads', 'BizOps Analysts', 'Product Analysts', 'Decision Makers'];

function useWordCycle(words, interval = 2200) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % words.length), interval);
    return () => clearInterval(iv);
  }, [words.length, interval]);
  return words[idx];
}

// Noise grain overlay via canvas
function GrainOverlay() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const imageData = ctx.createImageData(W, H);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = v;
      imageData.data[i+3] = 8; // very subtle
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);
  return (
    <canvas ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.4 }}
    />
  );
}

export default function StrategyHero({ onStartSimulator }) {
  const role = useWordCycle(ROLES);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.10 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(80px,12vw,140px) 24px clamp(60px,8vw,100px)',
      overflow: 'hidden',
      background: '#050505',
    }}>

      {/* ── Grain overlay ── */}
      <GrainOverlay />

      {/* ── Dotted grid ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      {/* ── Orange orb — top left ── */}
      <motion.div
        style={{
          position: 'absolute', top: -180, left: -180,
          width: 640, height: 640, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252,128,25,0.22) 0%, transparent 68%)',
          filter: 'blur(100px)', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Blue orb — bottom right ── */}
      <motion.div
        style={{
          position: 'absolute', bottom: -180, right: -180,
          width: 640, height: 640, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,79,204,0.28) 0%, transparent 68%)',
          filter: 'blur(100px)', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.10, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* ── Mid accent orb ── */}
      <motion.div
        style={{
          position: 'absolute', top: '40%', left: '55%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,128,255,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 860 }}
      >

        {/* Role cycling eyebrow */}
        <motion.div variants={item} style={{ marginBottom: 28 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999,
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            background: 'rgba(79,128,255,0.10)',
            border: '1px solid rgba(79,128,255,0.28)',
            color: '#4F80FF',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F80FF', display: 'inline-block', animation: 'hero-pulse 2s ease-in-out infinite' }} />
            Built for{' '}
            <motion.span
              key={role}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ color: '#FC8019' }}
            >
              {role}
            </motion.span>
            {' '}at Uber, Swiggy & Meta
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={item}
          style={{
            fontSize: 'clamp(2.2rem, 6.5vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            marginBottom: 28,
          }}
        >
          The AI will pull the data.{' '}
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #FC8019 0%, #FF9E50 50%, #4F80FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Can you make the decision?
          </span>
        </motion.h1>

        {/* Sub-header */}
        <motion.p
          variants={item}
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.68,
            color: 'var(--ink2)',
            maxWidth: 600,
            margin: '0 auto 44px',
          }}
        >
          In 2026, syntax is free. Strategy is expensive.{' '}
          Master the problem-solving frameworks used by PMs and Strategy leads.{' '}
          From raw ambiguity to a{' '}
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>$2M recommendation</strong>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}
        >
          {/* Primary */}
          <motion.button
            onClick={onStartSimulator}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '15px 32px', borderRadius: 12,
              background: 'var(--phase1)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              letterSpacing: '-0.01em', border: 'none', cursor: 'pointer',
              boxShadow: '0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.18)',
              fontFamily: 'var(--sans)',
            }}
          >
            <Zap size={17} />
            Start the Investigation
            <ArrowRight size={17} />
          </motion.button>

          {/* Secondary */}
          <motion.a
            href="/case-studies"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 26px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'var(--ink2)', fontWeight: 500, fontSize: 15,
              textDecoration: 'none', backdropFilter: 'blur(12px)',
              fontFamily: 'var(--sans)',
            }}
          >
            Browse All Cases
          </motion.a>
        </motion.div>

        {/* Social proof micro-copy */}
        <motion.p
          variants={item}
          style={{
            marginTop: 22,
            fontFamily: 'var(--mono)', fontSize: 10,
            color: 'var(--ink3)', letterSpacing: '0.05em',
          }}
        >
          Free · No account · Portfolio link at end · ~45 minutes
        </motion.p>

        {/* Metric strip */}
        <motion.div
          variants={item}
          style={{
            marginTop: 56,
            display: 'flex', justifyContent: 'center',
            gap: 0, flexWrap: 'wrap',
          }}
        >
          {[
            { val: '3',     label: 'Investigation Phases', color: 'var(--phase1)' },
            { val: '₹2Cr+', label: 'GMV Impact Modelled',  color: 'var(--phase2)' },
            { val: '1',     label: 'Portfolio Memo',        color: 'var(--green)' },
          ].map((m, i) => (
            <div key={i} style={{
              padding: '16px 36px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              textAlign: 'center',
              background: i === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 800,
                color: m.color, letterSpacing: '-0.03em', lineHeight: 1,
              }}>{m.val}</div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5,
              }}>{m.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          zIndex: 1,
        }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Scroll to see the experience gap
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, var(--ink3), transparent)' }}
        />
      </motion.div>

      <style>{`
        @keyframes hero-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.6); }
        }
      `}</style>
    </section>
  );
}
