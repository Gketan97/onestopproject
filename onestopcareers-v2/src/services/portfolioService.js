// src/services/portfolioService.js
// Handles portfolio persistence with graceful degradation:
//   1. Firestore  — when VITE_FIREBASE_* env vars are set
//   2. localStorage — silent fallback when Firebase is not configured
//
// The app builds and runs without any Firebase config.
// Portfolio links still work — they just resolve from localStorage
// on the same browser instead of being cross-device shareable.

import { getApps } from 'firebase/app';

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
// BUG FIX #6: Accept caller-provided portfolioId instead of generating a new one.
// DebriefSection generates its own ID and sets the portfolio URL from it —
// if we generated a second ID here, Firestore would store a different record
// and the shared link would 404.
export const savePortfolio = async (data) => {
  const portfolioId = data.portfolioId;
  if (!portfolioId) {
    console.error('savePortfolio: portfolioId is required');
    return null;
  }

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
    completedPhases: data.completedPhases || [],
    behaviours:     data.behaviours     || {},
    p2QueryCount:   data.p2QueryCount   || 0,
    hints:          data.hints          || 0,
    completedAt:    new Date().toISOString(),
    version:        2,
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
