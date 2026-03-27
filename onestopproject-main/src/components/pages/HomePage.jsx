// src/components/pages/HomePage.jsx
// Thin wrapper — renders StrategyHero as the homepage.
// "Start the Investigation" navigates to /strategy/swiggy instead of
// toggling in-page state, so the route stays clean and there's
// zero duplication of hero content.
 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StrategyHero from '../strategy/components/StrategyHero.jsx';
 
export default function HomePage() {
  const navigate = useNavigate();
 
  return (
    <StrategyHero
      onStartSimulator={() => navigate('/strategy/swiggy')}
    />
  );
}