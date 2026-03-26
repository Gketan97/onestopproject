// src/services/portfolioService.js
// Handles portfolio persistence with graceful degradation:
//   1. Firestore  — when VITE_FIREBASE_* env vars are set
//   2. localStorage — silent fallback when Firebase is not configured
//
// The app builds and runs without any Firebase config.
// Portfolio links still work — they just resolve from localStorage
// on the same browser instead of being cross-device shareable.

import { getApps } from 'firebase/app';
import { nanoid } from 'nanoid';

// ── Helpers ───────────────────────────────────────────────────────────────────
const generatePortfolioId = () => nanoid(10);

function localSave(portfolioId, data) {
  try { localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(data)); } catch (_) {}
}

function localRead(portfolioId) {
  try {
    const raw = localStorage.getItem(`portfolio_${portfolioId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

// Returns true only when Firebase was successfully initialised in App.jsx
function isFirebaseReady() {
  return getApps().length > 0;
}

// ── Save ─────────────────────────────────────────────────────────────────────
export const savePortfolio = async (data) => {
  // Bug 6 fix: use caller-provided ID if present, otherwise generate one
  const portfolioId = data.portfolioId || generatePortfolioId();

  const document = {
    portfolioId,
    candidateName:  data.candidateName  || null,
    caseStudyId:    data.caseStudyId    || 'swiggy',
    caseStudyTitle: data.caseStudyTitle || 'Swiggy Orders Investigation',
    phase2Queries:  data.phase2Queries  || {},
    phase3Answers:  data.phase3Answers  || {},
    finalWriteUp:   data.finalWriteUp   || '',
    aiEvaluation:   data.aiEvaluation   || '',
    score:          typeof data.score === 'number' ? data.score : null,
    scoreSummary:   data.scoreSummary   || '',
    keyQueries:     data.keyQueries     || [],
    completedAt:    new Date().toISOString(),
    version:        1,
  };

  if (isFirebaseReady()) {
    try {
      const { getFirestore, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const db = getFirestore();
      await setDoc(doc(db, 'portfolios', portfolioId), {
        ...document,
        completedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore save failed — using localStorage:', err.message);
      localSave(portfolioId, document);
    }
  } else {
    localSave(portfolioId, document);
  }

  return portfolioId;
};

// ── Read ─────────────────────────────────────────────────────────────────────
export const getPortfolio = async (portfolioId) => {
  if (isFirebaseReady()) {
    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const db  = getFirestore();
      const snap = await getDoc(doc(db, 'portfolios', portfolioId));
      if (snap.exists()) return snap.data();
    } catch (err) {
      console.warn('Firestore read failed — trying localStorage:', err.message);
    }
  }
  return localRead(portfolioId);
};

export const portfolioUrl = (portfolioId) =>
  `${window.location.origin}/portfolio/${portfolioId}`;
