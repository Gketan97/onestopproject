// src/components/pages/CaseStudyPage.jsx
// Route wrapper for /case-study/:caseId
// Renders the appropriate React case study component.
// Currently only 'swiggy' exists; new cases can be added to CASE_MAP.

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SwiggyCase from '../case-study/SwiggyCase.jsx';

const CASE_MAP = {
  swiggy: SwiggyCase,
};

export default function CaseStudyPage() {
  const { caseId } = useParams();
  const CaseComponent = CASE_MAP[caseId];
  if (!CaseComponent) return <Navigate to="/" replace />;
  return <CaseComponent />;
}
