/**
 * Shell component library — barrel export
 * ────────────────────────────────────────────────────────────────────────────
 * Copy the entire `shell/` folder to:
 *   src/components/ui/shell/
 *
 * Then import like:
 *   import { PremiumShell, GlassWorkbench, ArjunAvatar, DataPill } from '@/components/ui/shell';
 *
 * Also import the tokens CSS once in your main entry (e.g. src/main.jsx):
 *   import '@/components/ui/shell/noir-tokens.css';
 */

export { default as PremiumShell, PremiumSection, PremiumCard } from './PremiumShell.jsx';
export { default as GlassWorkbench, GlassPanel }                from './GlassWorkbench.jsx';
export { default as ArjunAvatar }                               from './ArjunAvatar.jsx';
export { default as DataPill, DataPillGroup }                   from './DataPill.jsx';
