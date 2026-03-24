// src/services/portfolioService.js
// Handles all Firestore operations for portfolio persistence.
// Portfolio documents are stored at: portfolios/{portfolioId}

import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';

let db = null;

const getDB = () => {
  if (!db) {
    db = getFirestore();
  }
  return db;
};

/**
 * Generate a short, URL-safe portfolio ID.
 * Uses nanoid for collision resistance without needing a UUID.
 */
const generatePortfolioId = () => nanoid(10);

/**
 * Save a completed case study to Firestore.
 * Returns the portfolio ID (used to construct the shareable URL).
 *
 * @param {Object} data
 * @param {string}   data.candidateName      - Optional display name
 * @param {string}   data.caseStudyId        - e.g. 'swiggy'
 * @param {string}   data.caseStudyTitle     - e.g. 'Swiggy Orders Investigation'
 * @param {Object}   data.phase2Queries      - { questionKey: { query, result, evaluation } }
 * @param {Object}   data.phase3Answers      - { questionKey: { hypothesis, conclusion, answer } }
 * @param {string}   data.finalWriteUp       - The VP/executive message text
 * @param {string}   data.aiEvaluation       - Full debrief text from Arjun
 * @param {number}   data.score              - Numeric 0–100
 * @param {string}   data.scoreSummary       - One-line interpretation of score
 * @param {Object[]} data.keyQueries         - Top 2–3 queries to highlight on portfolio
 *
 * @returns {Promise<string>} portfolioId
 */
export const savePortfolio = async (data) => {
  const portfolioId = generatePortfolioId();
  const db = getDB();

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
    completedAt:    serverTimestamp(),
    version:        1,
  };

  await setDoc(doc(db, 'portfolios', portfolioId), document);
  return portfolioId;
};

/**
 * Fetch a portfolio document by ID.
 * Returns null if not found.
 *
 * @param {string} portfolioId
 * @returns {Promise<Object|null>}
 */
export const getPortfolio = async (portfolioId) => {
  const db = getDB();
  const snap = await getDoc(doc(db, 'portfolios', portfolioId));
  if (!snap.exists()) return null;
  return snap.data();
};

/**
 * Build the shareable portfolio URL for a given portfolio ID.
 */
export const portfolioUrl = (portfolioId) =>
  `${window.location.origin}/portfolio/${portfolioId}`;
