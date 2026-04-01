// src/contexts/WorkbenchContext.js
// Provides typewriter speed preference to all workbench components.
// Consumed by ArjunSocraticChat, ExecutiveMemo, DirtyDataTrap via useContext.

import React from 'react';

export const WorkbenchContext = React.createContext({
  typewriterSpeed: 10,
});