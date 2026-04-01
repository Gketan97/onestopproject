// src/components/strategy/components/FounderStrip.jsx
// Sprint 6 — Founder trust layer for StrategyHero
// Renders between Testimonials and final CTA

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

const ORANGE = '#FC8019';

export default function FounderStrip() {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        maxWidth: 760, margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <div style={{
        display: 'flex', gap: 24, alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          {!imgError ? (
            <img
              src="/ketan%20Image.jpeg"
              alt="Ketan, Founder of OneStopCareers"
              onError={() => setImgError(true)}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                border: `2px solid ${ORANGE}`,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(252,128,25,0.12)',
              border: `1.5px solid ${ORANGE}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 800,
              color: ORANGE,
            }}>
              KG
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            color: 'var(--ink3)', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: 10,
          }}>
            From the Founder
          </p>

          <p style={{
            fontSize: 16, fontWeight: 700, color: 'var(--ink)',
            lineHeight: 1.5, marginBottom: 12,
          }}>
            "I spent two years interviewing at Swiggy, Meesho, and Flipkart before I understood
            what senior PMs and analysts actually thought about in the room."
          </p>

          <p style={{
            fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 16,
          }}>
            Most people I know who got the callbacks weren't smarter — they'd just practiced
            the specific skill of thinking through a business problem from first principles and
            presenting it clearly. I built this because I couldn't find a place that taught that
            skill, specifically, the way it works in Indian product companies.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              color: ORANGE,
            }}>
              — Ketan · Founder, OneStopCareers
            </span>
            <a
              href="#"
              aria-label="Ketan on LinkedIn"
              style={{
                display: 'flex', alignItems: 'center',
                color: ORANGE, textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Linkedin size={14} color={ORANGE} />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile: stack vertically, avatar centred */}
      <style>{`
        @media (max-width: 640px) {
          .founder-strip-inner {
            flex-direction: column !important;
            align-items: center !important;
          }
          .founder-strip-inner > div:first-child {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </motion.div>
  );
}