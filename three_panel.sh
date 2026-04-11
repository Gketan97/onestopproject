#!/usr/bin/env bash
# 3-PANEL RESIZABLE LAYOUT — Cursor-style AI Panel
# Left nav fixed | Center constant | Right AI draggable + overlay
# Contracts enforced: UI_CONTRACT | BUG_AUDIT | CODE_QUALITY | DEBT_REGISTER

set -euo pipefail

echo "📋 3-Panel Resizable Layout"
echo "────────────────────────────────────"

# ── Gate 0 ────────────────────────────────────────────────────────────────────
echo "📋 Gate 0: Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ Missing: $contract"; MISSING=1; }
done
[ "$MISSING" = "1" ] && { echo "❌ Run: bash generate_contracts.sh first"; exit 1; }

mkdir -p src/store src/hooks src/components/ai src/components/layout

# ── 1. aiPanelStore — width + state persistence ───────────────────────────────
cat > src/store/aiPanelStore.ts << 'EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AIPanelContent =
  | { type: 'welcome' }
  | { type: 'insight'; title: string; text: string }
  | { type: 'chart';   title: string; chartId: string }

// ── Constants ─────────────────────────────────────────────────────────────────
export const AI_PANEL_COLLAPSED_W = 52
export const AI_PANEL_DEFAULT_W   = 320
export const AI_PANEL_OVERLAY_W   = 520   // threshold above which center dims
export const AI_PANEL_MAX_W       = typeof window !== 'undefined' ? Math.round(window.innerWidth * 0.75) : 960
export const AI_PANEL_MIN_W       = AI_PANEL_COLLAPSED_W

interface AIPanelState {
  width:        number
  isCollapsed:  boolean
  content:      AIPanelContent
  // Actions
  setWidth:     (w: number) => void
  collapse:     () => void
  expand:       () => void
  toggleCollapse: () => void
  setContent:   (c: AIPanelContent) => void
  openWithContent: (c: AIPanelContent) => void
}

export const useAIPanelStore = create<AIPanelState>()(
  persist(
    (set, get) => ({
      width:       AI_PANEL_DEFAULT_W,
      isCollapsed: false,
      content:     { type: 'welcome' },

      setWidth: (w) => set({ width: Math.max(AI_PANEL_MIN_W, Math.min(w, AI_PANEL_MAX_W)) }),

      collapse: () => set({ isCollapsed: true, width: AI_PANEL_COLLAPSED_W }),

      expand: () =>
        set((s) => ({
          isCollapsed: false,
          width: s.width <= AI_PANEL_COLLAPSED_W ? AI_PANEL_DEFAULT_W : s.width,
        })),

      toggleCollapse: () => {
        const { isCollapsed } = get()
        isCollapsed ? get().expand() : get().collapse()
      },

      setContent:      (content) => set({ content }),
      openWithContent: (content) => {
        const { isCollapsed } = get()
        set({
          content,
          isCollapsed: false,
          width: isCollapsed ? AI_PANEL_DEFAULT_W : get().width,
        })
      },
    }),
    {
      name:    'osc-ai-panel',
      partialize: (s) => ({ width: s.width, isCollapsed: s.isCollapsed }),
    },
  ),
)
EOF
echo "✅ aiPanelStore.ts"

# ── 2. usePanelResize hook ────────────────────────────────────────────────────
cat > src/hooks/usePanelResize.ts << 'EOF'
import { useCallback, useEffect, useRef } from 'react'
import {
  useAIPanelStore,
  AI_PANEL_COLLAPSED_W,
  AI_PANEL_DEFAULT_W,
  AI_PANEL_MIN_W,
} from '@/store/aiPanelStore'

interface UsePanelResizeReturn {
  handleRef:      React.RefObject<HTMLDivElement>
  onDoubleClick:  () => void
}

export function usePanelResize(): UsePanelResizeReturn {
  const handleRef    = useRef<HTMLDivElement>(null)
  const { setWidth, collapse, expand, width, isCollapsed } = useAIPanelStore()
  const isDragging   = useRef(false)
  const startX       = useRef(0)
  const startWidth   = useRef(0)

  const onDoubleClick = useCallback(() => {
    if (isCollapsed) {
      expand()
    } else if (width === AI_PANEL_DEFAULT_W) {
      collapse()
    } else {
      setWidth(AI_PANEL_DEFAULT_W)
    }
  }, [isCollapsed, width, expand, collapse, setWidth])

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    function onMouseDown(e: MouseEvent) {
      e.preventDefault()
      isDragging.current  = true
      startX.current      = e.clientX
      startWidth.current  = useAIPanelStore.getState().width
      document.body.style.cursor      = 'col-resize'
      document.body.style.userSelect  = 'none'
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return
      // Dragging left = panel grows (subtract because panel is on right)
      const delta    = startX.current - e.clientX
      const newWidth = startWidth.current + delta
      if (newWidth < AI_PANEL_MIN_W + 20) {
        collapse()
      } else {
        expand()
        setWidth(newWidth)
      }
    }

    function onMouseUp() {
      if (!isDragging.current) return
      isDragging.current           = false
      document.body.style.cursor   = ''
      document.body.style.userSelect = ''
    }

    handle.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    return () => {
      handle.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [collapse, expand, setWidth])

  return { handleRef, onDoubleClick }
}
EOF
echo "✅ usePanelResize.ts"

# ── 3. ResizableAIPanel ───────────────────────────────────────────────────────
cat > src/components/ai/ResizableAIPanel.tsx << 'EOF'
import { useEffect, useRef }       from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronRight, MessageSquare } from 'lucide-react'
import {
  useAIPanelStore,
  AI_PANEL_COLLAPSED_W,
  AI_PANEL_OVERLAY_W,
  type AIPanelContent,
} from '@/store/aiPanelStore'
import { usePanelResize } from '@/hooks/usePanelResize'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ArjunChipDef {
  id:      string
  label:   string
  content: AIPanelContent
}

// ── Arjun response registry ────────────────────────────────────────────────────
const ARJUN_RESPONSES: Record<string, string> = {
  'whyRatio':        'A ratio metric lets you compare across different user base sizes. Absolute bookings alone would hide a real conversion problem as DAU grows. The ratio exposes efficiency — are we getting better or worse at converting users?',
  'ppTrap':          'In your first VP presentation, say "CVR dropped 1.9%" instead of "1.9pp". They\'ll assume a small relative change. Then someone corrects you in the room. That\'s not a mistake you make twice.',
  'whyGross':        'Net bookings are an ops metric. Cancellation rates swing with policy changes, not demand. If you tie your investigation to net bookings, you\'ll chase a ghost every time ops tightens the refund window.',
  'whyLoggedIn':     'In one quarter, MMT\'s anonymous traffic spiked 40% from an SEO push. Total sessions as DAU would have made B/DAU look crashed. Logged-in users are the only reliable demand signal.',
  'absBookingsFlat': 'Flat bookings with growing DAU is actually more dangerous than crashing bookings. The product is attracting more users but losing its ability to convert them. The funnel is leaking, not collapsing.',
  'crossValidate':   'In 2019, an analyst spent 3 weeks on a CVR drop that was a Mixpanel SDK bug. Payment gateway showed stable transactions the whole time. Always cross-check analytics events against ground truth before assuming the drop is real.',
  'whyShape':        'A sudden cliff means look for a single event — deploy, outage, bad A/B test. A gradual slope means look for something systemic — supply change, UI degradation, competitive offer. The shape is your first hypothesis filter.',
  'yoyMethod':       'YoY controls for calendar effects automatically. If Oct-Nov always dips post-monsoon, 2024 shows it. If 2025 Jan-Feb drops but 2024 Jan-Feb was flat, the drop is structural — the calendar didn\'t cause it.',
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function WelcomeState() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <AvatarA />
        <div className="flex-1 rounded-2xl rounded-tl-sm px-4 py-4 space-y-2"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
            Arjun · Staff Analyst
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            I'm your thinking partner. Click any{' '}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
              style={{ background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--accent-secondary)' }}>
              <Sparkles size={9} /> Ask Arjun
            </span>
            {' '}chip in the content to get my take.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest px-1"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Suggested questions
        </p>
        {[
          { id: 'whyRatio',   label: 'Why use a ratio instead of absolute bookings?' },
          { id: 'whyShape',   label: 'How does the shape of a drop guide investigation?' },
          { id: 'yoyMethod',  label: 'Why is YoY the right seasonality check?' },
        ].map(({ id, label }) => (
          <SuggestedChip key={id} chipId={id} label={label} />
        ))}
      </div>
    </div>
  )
}

function SuggestedChip({ chipId, label }: { chipId: string; label: string }) {
  const openWithContent = useAIPanelStore((s) => s.openWithContent)
  return (
    <button
      onClick={() => openWithContent({ type: 'insight', title: label, text: ARJUN_RESPONSES[chipId] ?? '' })}
      className="w-full flex items-start gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:bg-white/5"
      style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
    >
      <MessageSquare size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-secondary)' }} />
      <span className="text-xs leading-relaxed">{label}</span>
    </button>
  )
}

function InsightState({ content }: { content: AIPanelContent & { type: 'insight' } }) {
  return (
    <div className="flex gap-3">
      <AvatarA />
      <div className="flex-1 rounded-2xl rounded-tl-sm px-4 py-4 space-y-2"
        style={{ background: 'var(--bg-surface)', border: '1px solid rgba(129,140,248,0.20)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
          Arjun · Staff Analyst
        </p>
        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {content.title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {ARJUN_RESPONSES[content.title] ?? content.text}
        </p>
      </div>
    </div>
  )
}

function ChartState({ content }: { content: AIPanelContent & { type: 'chart' } }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <AvatarA />
        <div className="rounded-2xl rounded-tl-sm px-4 py-3"
          style={{ background: 'var(--bg-surface)', border: '1px solid rgba(129,140,248,0.20)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
            Arjun · Staff Analyst
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Here's the data for <strong style={{ color: 'var(--text-primary)' }}>{content.title}</strong>.
          </p>
        </div>
      </div>
      <div className="rounded-2xl flex items-center justify-center h-48"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {content.chartId} — renders in P13
        </p>
      </div>
    </div>
  )
}

function AvatarA() {
  return (
    <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
      style={{
        background:  'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(255,107,53,0.25))',
        border:      '1px solid rgba(129,140,248,0.30)',
        color:       'var(--text-primary)',
        fontFamily:  'var(--font-heading)',
      }}>
      A
    </div>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────────
export function ResizableAIPanel() {
  const {
    width, isCollapsed, content,
    collapse, toggleCollapse,
  } = useAIPanelStore()

  const { handleRef, onDoubleClick } = usePanelResize()
  const isOverlay = !isCollapsed && width > AI_PANEL_OVERLAY_W

  const panelWidth = isCollapsed ? AI_PANEL_COLLAPSED_W : width

  return (
    <>
      {/* ── Dim overlay on center content ── */}
      <AnimatePresence>
        {isOverlay && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 pointer-events-auto"
            style={{ background: 'rgba(0,0,0,0.35)' }}
            onClick={collapse}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Panel ── */}
      <div
        className="relative shrink-0 flex h-full z-30"
        style={{
          width:      `${panelWidth}px`,
          transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1)',
          minWidth:   `${AI_PANEL_COLLAPSED_W}px`,
        }}
      >
        {/* ── Drag handle ── */}
        <div
          ref={handleRef}
          onDoubleClick={onDoubleClick}
          className="absolute left-0 top-0 h-full flex items-center justify-center group"
          style={{
            width:   '8px',
            cursor:  'col-resize',
            zIndex:  10,
          }}
          aria-label="Drag to resize AI panel"
          role="separator"
          aria-orientation="vertical"
        >
          {/* Visible handle bar */}
          <motion.div
            className="h-12 rounded-full transition-all duration-150"
            style={{
              width:      '3px',
              background: 'var(--border-subtle)',
            }}
            whileHover={{ background: 'var(--accent-secondary)', width: '4px', height: '48px' }}
          />
        </div>

        {/* ── Collapsed strip ── */}
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center gap-3 cursor-pointer"
              style={{
                background:  'var(--bg-elevated)',
                borderLeft:  '1px solid var(--border-subtle)',
                paddingLeft: '8px',
              }}
              onClick={toggleCollapse}
              role="button"
              aria-label="Expand AI panel"
              aria-expanded={false}
            >
              <Sparkles size={16} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{
                color:           'var(--text-muted)',
                fontFamily:      'var(--font-mono)',
                fontSize:        '8px',
                writingMode:     'vertical-rl',
                textOrientation: 'mixed',
                transform:       'rotate(180deg)',
                letterSpacing:   '0.15em',
                textTransform:   'uppercase',
              }}>
                Arjun
              </span>
              <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
              style={{
                background: 'var(--bg-elevated)',
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '8px', // offset for drag handle
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 shrink-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)' }}>
                    <Sparkles size={13} style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Arjun
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      AI Thinking Partner
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Width indicator */}
                  {width > AI_PANEL_OVERLAY_W && (
                    <span className="text-xs px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(255,107,53,0.10)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '9px', border: '1px solid rgba(255,107,53,0.20)' }}>
                      overlay
                    </span>
                  )}
                  <button onClick={collapse}
                    className="p-1.5 rounded-lg transition-all hover:bg-white/5"
                    aria-label="Collapse AI panel">
                    <X size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {content.type === 'welcome'  && <WelcomeState />}
                {content.type === 'insight'  && <InsightState  content={content as AIPanelContent & { type: 'insight' }} />}
                {content.type === 'chart'    && <ChartState    content={content as AIPanelContent & { type: 'chart'   }} />}

                {/* Reset to welcome */}
                {content.type !== 'welcome' && (
                  <button
                    onClick={() => useAIPanelStore.getState().setContent({ type: 'welcome' })}
                    className="text-xs transition-all hover:opacity-70"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                  >
                    ← Back to suggestions
                  </button>
                )}
              </div>

              {/* Resize hint footer */}
              <div className="px-4 py-3 shrink-0"
                style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs text-center"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  Drag left edge · Double-click to reset
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
EOF
echo "✅ ResizableAIPanel.tsx"

# ── 4. ArjunChip — triggers panel with content ────────────────────────────────
cat > src/components/phases/ArjunChip.tsx << 'EOF'
import { Sparkles } from 'lucide-react'
import { useAIPanelStore, type AIPanelContent } from '@/store/aiPanelStore'

interface ArjunChipProps {
  label:   string
  content: AIPanelContent
}

export function ArjunChip({ label, content }: ArjunChipProps) {
  const openWithContent = useAIPanelStore((s) => s.openWithContent)

  return (
    <button
      onClick={() => openWithContent(content)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background:  'rgba(129,140,248,0.07)',
        border:      '1px solid rgba(129,140,248,0.18)',
        color:       'var(--accent-secondary)',
        fontFamily:  'var(--font-mono)',
      }}
    >
      <Sparkles size={10} />
      {label}
    </button>
  )
}
EOF
echo "✅ ArjunChip.tsx"

# ── 5. Updated CaseStudy Shell — 3-panel with resizable right ─────────────────
cat > src/pages/CaseStudy/index.tsx << 'EOF'
import { useEffect }                       from 'react'
import { useParams, useNavigate, Outlet }  from 'react-router-dom'
import { MobileGate }                      from '@/components/ui/MobileGate'
import { ProgressNav }                     from '@/components/layout/ProgressNav'
import { CenterPanel }                     from '@/components/layout/CenterPanel'
import { ResizableAIPanel }                from '@/components/ai/ResizableAIPanel'
import { useProgressStore }                from '@/store/progressStore'

const DESKTOP_BREAKPOINT = 1024

export default function CaseStudyShell() {
  const { slug, phase } = useParams<{ slug: string; phase?: string }>()
  const navigate         = useNavigate()
  const currentPhaseId   = useProgressStore((s) => s.currentPhaseId)
  const isDesktop        =
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT

  useEffect(() => {
    if (!phase && slug) {
      navigate(`/case-study/${slug}/${currentPhaseId}`, { replace: true })
    }
  }, [phase, slug, currentPhaseId, navigate])

  if (!isDesktop) return <MobileGate />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Left — fixed nav */}
      <ProgressNav />

      {/* Center — constant width, never reflows */}
      <div className="flex-1 min-w-0 overflow-hidden relative">
        <CenterPanel />
      </div>

      {/* Right — resizable AI panel, overlays center when wide */}
      <ResizableAIPanel />
    </div>
  )
}
EOF
echo "✅ CaseStudyShell — 3-panel"

# ── 6. Update CenterPanel — remove Outlet (shell handles it) ─────────────────
cat > src/components/layout/CenterPanel.tsx << 'EOF'
import { useEffect, useRef } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { motion }            from 'framer-motion'
import { PHASES }            from '@/store/progressStore'
import { useProgressStore }  from '@/store/progressStore'
import { revealContent }     from '@/lib/motionVariants'

export function CenterPanel() {
  const { phase }   = useParams<{ phase: string }>()
  const scrollRef   = useRef<HTMLDivElement>(null)
  const phaseConfig = PHASES.find((p) => p.id === phase)
  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-2xl mx-auto px-10 py-12">
        {phaseConfig && (
          <motion.header
            key={phase}
            variants={revealContent}
            initial="hidden"
            animate="visible"
            className="mb-10 pb-8"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                Phase {phaseConfig.order} of {PHASES.length - 1}
              </span>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                MakeMyTrip
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {phaseConfig.label}
            </h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {phaseConfig.subtitle}
            </p>
          </motion.header>
        )}

        <motion.div
          key={phase + '-content'}
          variants={revealContent}
          initial="hidden"
          animate="visible"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
EOF
echo "✅ CenterPanel.tsx"

# ── 7. Update Phase1 to use new ArjunChip (panel-based) ──────────────────────
# Replace all InlineArjun references with ArjunChip pointing to panel
# The Phase1.tsx file already imports ArjunChip from phases/
# We just need to update the import source and remove InlineArjun usage

cat > src/pages/CaseStudy/phases/Phase1.tsx << 'PHASE1_EOF'
import { useState, useEffect }      from 'react'
import { useNavigate, useParams }   from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import { useProgressStore }         from '@/store/progressStore'
import { RevealBlock }              from '@/components/phases/RevealBlock'
import { MetricCard }               from '@/components/phases/MetricCard'
import { MiniBarChart }             from '@/components/phases/MiniBarChart'
import { ArjunChip }                from '@/components/phases/ArjunChip'
import { ContinueButton }           from '@/components/phases/ContinueButton'
import { SectionHeader }            from '@/components/phases/SectionHeader'
import { TimeSeriesChart }          from '@/components/phases/TimeSeriesChart'
import { YoYChart }                 from '@/components/phases/YoYChart'

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionKey = 's1' | 's2' | 's3' | 's4'
const SECTION_ORDER: SectionKey[] = ['s1', 's2', 's3', 's4']
interface SectionState { visible: boolean; completed: boolean }
type Sections = Record<SectionKey, SectionState>

const INITIAL_SECTIONS: Sections = {
  s1: { visible: true,  completed: false },
  s2: { visible: false, completed: false },
  s3: { visible: false, completed: false },
  s4: { visible: false, completed: false },
}

type SeasonStep = 'input' | 'hint' | 'chart' | 'done'

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase1() {
  const { slug }       = useParams<{ slug: string }>()
  const navigate        = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const phaseCompleted  = isCompleted('phase-1')

  const [sections, setSections]         = useState<Sections>(INITIAL_SECTIONS)
  const [seasonStep, setSeasonStep]     = useState<SeasonStep>('input')
  const [userApproach, setUserApproach] = useState('')
  const [userInsight, setUserInsight]   = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [arjunFb, setArjunFb]           = useState('')

  useEffect(() => {
    if (phaseCompleted) {
      setSections({ s1: { visible: true, completed: true }, s2: { visible: true, completed: true }, s3: { visible: true, completed: true }, s4: { visible: true, completed: true } })
      setSeasonStep('done')
    }
  }, [phaseCompleted])

  function revealNext(current: SectionKey) {
    const idx  = SECTION_ORDER.indexOf(current)
    const next = SECTION_ORDER[idx + 1] as SectionKey | undefined
    setSections((prev) => ({
      ...prev,
      [current]: { ...prev[current], completed: true },
      ...(next ? { [next]: { ...prev[next], visible: true } } : {}),
    }))
    if (next) {
      setTimeout(() => {
        document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 350)
    }
  }

  function handleApproachSubmit() {
    const lower = userApproach.toLowerCase()
    const hasYoY = lower.includes('year') || lower.includes('yoy') ||
      lower.includes('last year') || lower.includes('2024') ||
      lower.includes('same period') || lower.includes('compare')
    setSeasonStep(hasYoY ? 'chart' : 'hint')
  }

  async function handleInsightSubmit() {
    if (userInsight.trim().length < 15) return
    setIsEvaluating(true)
    await new Promise((r) => setTimeout(r, 900))
    const lower  = userInsight.toLowerCase()
    const isGood = lower.includes('not seasonal') || lower.includes('structural') ||
      lower.includes('jan') || lower.includes('feb') || lower.includes('oct') ||
      lower.includes('nov') || lower.includes('2024') || lower.includes('same period')
    setArjunFb(isGood
      ? 'Exactly. The Oct–Nov dip is real seasonality — it appeared in 2024 and recovered by December. But Jan–Feb 2025 dropped 1.9pp while Jan–Feb 2024 was flat at 12%. Same calendar window, completely different behaviour. Seasonality is ruled out. This drop is structural.'
      : 'Look at the Jan–Feb window specifically. In 2024, was there a dip in Jan–Feb? Compare that to 2025. The gap between the two lines in that window tells you whether the calendar caused this.')
    setIsEvaluating(false)
    setSeasonStep('done')
  }

  function handlePhaseComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <div className="space-y-16 pb-20">

      {/* ══ S1 — Definition Clarity ══ */}
      <AnimatePresence>
        {sections.s1.visible && (
          <motion.section id="section-s1" key="s1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={1} title="Definition Clarity" subtitle="Lock these down before you touch a single number." />

            <RevealBlock>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <MetricCard label="Bookings/DAU — Before" value="12.0%" accent="var(--accent-green)" sub="60-day avg before drop" />
                  <MetricCard label="Bookings/DAU — After"  value="10.1%" direction="down" change="−1.9pp" accent="var(--accent-red)" sub="60-day avg after drop" />
                  <MetricCard label="Relative decline" value="−15.8%" direction="down" accent="var(--accent-red)" sub="The board-level number" />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Bookings/DAU</strong> = total bookings ÷ daily active users. If 1,000 users open the app and 120 complete a booking, B/DAU = 12%. It answers one question: <em style={{ color: 'var(--text-primary)' }}>are users converting?</em>
                </p>
                <div className="px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--accent-red)' }}>Confusion trap: </strong>
                    B/DAU can fall even if absolute bookings are flat — if DAU grows faster. Always check numerator and denominator separately. We'll do this in Section 2.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ArjunChip label="Why a ratio instead of absolute bookings?" content={{ type: 'insight', title: 'whyRatio', text: '' }} />
                </div>
              </div>
            </RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>❌ Wrong</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9%"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manager hears: small rounding error</p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>✓ Correct</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9pp"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manager hears: 15.8% relative decline = ₹4.2Cr</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Percentage points (pp)</strong> = absolute difference between two percentages. 12% → 10.1% is −1.9pp. The relative decline is −15.8%. Confusing these destroys credibility in a board review.
                </p>
                <ArjunChip label="Real story: how this mistake plays out in a VP meeting" content={{ type: 'insight', title: 'ppTrap', text: '' }} />
              </div>
            </RevealBlock>

            <RevealBlock delay={0.08}>
              <div className="space-y-4">
                <MiniBarChart title="Who counts as a DAU at MMT" unit="" maxValue={100}
                  data={[
                    { label: 'Logged-in users (counted)',    value: 65, color: 'var(--accent-green)' },
                    { label: 'Anonymous visitors (excluded)',value: 28, color: 'var(--accent-red)'   },
                    { label: 'Bot traffic (excluded)',        value: 7,  color: 'var(--text-muted)'   },
                  ]} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  DAU = <strong style={{ color: 'var(--text-primary)' }}>logged-in unique users</strong> with intent. Not anonymous, not bots. Logged-in users have accounts and can buy. Including anonymous traffic inflates the denominator and makes CVR look artificially low.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Gross Bookings ✓</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Completed payments. Measures <strong style={{ color: 'var(--text-primary)' }}>purchase intent</strong>. Unaffected by ops changes.</p>
                  </div>
                  <div className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Net Bookings ✗</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>After cancellations. Fluctuates with <strong style={{ color: 'var(--text-primary)' }}>policy changes</strong>, not demand.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ArjunChip label="What if the DAU definition changed mid-period?" content={{ type: 'insight', title: 'whyLoggedIn', text: '' }} />
                  <ArjunChip label="Why gross bookings, not net?" content={{ type: 'insight', title: 'whyGross', text: '' }} />
                </div>
              </div>
            </RevealBlock>

            {!sections.s1.completed && (
              <RevealBlock>
                <ContinueButton label="Definitions locked — show me data sanity" onClick={() => revealNext('s1')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S2 — Data Sanity ══ */}
      <AnimatePresence>
        {sections.s2.visible && (
          <motion.section id="section-s2" key="s2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={2} title="Data Sanity Checks" subtitle="Verify the data before you trust it." />

            <RevealBlock>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Absolute Bookings (avg/day)" value="~820K" direction="flat" change="−0.2%" accent="var(--accent-green)" sub="Flat. Bookings didn't crash — the rate did." />
                  <MetricCard label="Absolute DAU (avg/day)" value="11.5M" direction="up" change="+15%" accent="var(--accent-red)" sub="Real growth verified against session logs." />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Flat bookings + growing DAU = falling ratio. 1.5M more users opened the app daily and almost none of them booked. The funnel is leaking.
                </p>
                <ArjunChip label="What does flat bookings + growing DAU actually mean?" content={{ type: 'insight', title: 'absBookingsFlat', text: '' }} />
              </div>
            </RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>✓ Pipeline cross-validated</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Analytics vs payment gateway: within 0.3% across 90 days. No tracking breakage.</p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>✓ No data incidents</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Zero ETL failures, schema changes, or backfills confirmed by data engineering.</p>
                  </div>
                </div>
                <ArjunChip label="Why compare analytics against the payment gateway?" content={{ type: 'insight', title: 'crossValidate', text: '' }} />
              </div>
            </RevealBlock>

            {!sections.s2.completed && (
              <RevealBlock>
                <ContinueButton label="Data verified — show me the timeline" onClick={() => revealNext('s2')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S3 — Timeline ══ */}
      <AnimatePresence>
        {sections.s3.visible && (
          <motion.section id="section-s3" key="s3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={3} title="Timeline Review" subtitle="The shape of the drop tells you what kind of problem you have." />

            <RevealBlock><TimeSeriesChart /></RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.20)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>This chart — gradual decay</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>−0.2pp/week over 10 weeks. <strong style={{ color: 'var(--text-primary)' }}>Structural.</strong> Search for what changed at day −62.</p>
                  </div>
                  <div className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>If it were sudden</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>−30% overnight. <strong style={{ color: 'var(--text-primary)' }}>Single event.</strong> Search logs, roll back last deploy.</p>
                  </div>
                </div>
                <ArjunChip label="Why does the shape of a drop matter so much?" content={{ type: 'insight', title: 'whyShape', text: '' }} />
              </div>
            </RevealBlock>

            {!sections.s3.completed && (
              <RevealBlock>
                <ContinueButton label="Pattern clear — now rule out seasonality" onClick={() => revealNext('s3')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S4 — Seasonality ══ */}
      <AnimatePresence>
        {sections.s4.visible && (
          <motion.section id="section-s4" key="s4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">
            <SectionHeader number={4} title="Seasonality Check" subtitle="Travel is seasonal. Rule this out before calling it a product problem." />

            <RevealBlock>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Priya's 60-day window overlaps a period that could show natural seasonal dips. Verify this isn't just an annual pattern before investigating product or supply.
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  How would you check whether this drop is seasonal?
                </p>

                {seasonStep === 'input' && (
                  <div className="space-y-3">
                    <textarea value={userApproach} onChange={(e) => setUserApproach(e.target.value)}
                      placeholder="What data would you pull and what would you look for?"
                      rows={2} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                    <button onClick={handleApproachSubmit} disabled={userApproach.trim().length < 8}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      Submit approach →
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {seasonStep === 'hint' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 px-4 py-4 rounded-xl"
                      style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.20)' }}>
                      <span style={{ fontSize: '16px' }}>💡</span>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold" style={{ color: 'var(--accent-amber)' }}>Hint</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          The strongest check: pull <strong style={{ color: 'var(--text-primary)' }}>Bookings/DAU for Jan–Feb 2024 vs Jan–Feb 2025</strong>. Same period, one year apart. If 2024 dipped too — seasonal. If 2024 was flat — structural.
                        </p>
                        <button onClick={() => setSeasonStep('chart')}
                          className="text-sm font-semibold underline underline-offset-2"
                          style={{ color: 'var(--accent-amber)' }}>
                          Show me the YoY data →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealBlock>

            <AnimatePresence>
              {(seasonStep === 'chart' || seasonStep === 'done') && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5">
                  <YoYChart />
                  <ArjunChip label="Why is YoY the right method here?" content={{ type: 'insight', title: 'yoyMethod', text: '' }} />

                  {seasonStep === 'chart' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5 space-y-3"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        Two patterns visible. What do you conclude?
                      </p>
                      <textarea value={userInsight} onChange={(e) => setUserInsight(e.target.value)}
                        placeholder="What's seasonal, what isn't, and how do you know?"
                        rows={2} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                        onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                      <button onClick={handleInsightSubmit}
                        disabled={userInsight.trim().length < 15 || isEvaluating}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                        style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                        {isEvaluating && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {isEvaluating ? 'Reading...' : 'Submit insight →'}
                      </button>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {seasonStep === 'done' && arjunFb && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-5">
                        <div className="flex gap-3 px-4 py-4 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                          <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.25),rgba(255,107,53,0.25))', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>A</div>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{arjunFb}</p>
                        </div>

                        {!phaseCompleted ? (
                          <motion.button onClick={handlePhaseComplete}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 24px rgba(255,107,53,0.18)' }}>
                            Seasonality ruled out — Begin Metric Decomposition →
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                            <span style={{ color: 'var(--accent-green)' }}>✓</span>
                            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Phase 1 complete — revisiting</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
PHASE1_EOF
echo "✅ Phase1.tsx updated"

# ── 8. Barrel updates ─────────────────────────────────────────────────────────
cat > src/components/ai/index.ts << 'EOF'
export { ResizableAIPanel } from './ResizableAIPanel'
EOF

cat > src/components/phases/index.ts << 'EOF'
export { MCQ }             from './MCQ'
export { SectionBadge }    from './SectionBadge'
export { ArjunChip }       from './ArjunChip'
export { ContinueButton }  from './ContinueButton'
export { RevealBlock }     from './RevealBlock'
export { MetricCard }      from './MetricCard'
export { MiniBarChart }    from './MiniBarChart'
export { SectionHeader }   from './SectionHeader'
export { TimeSeriesChart } from './TimeSeriesChart'
export { YoYChart }        from './YoYChart'
EOF
echo "✅ barrel exports"

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix above"

# ── Gate 2: Build ─────────────────────────────────────────────────────────────
echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 3-Panel Resizable Layout complete:"
echo "  ✓ Left nav: fixed 256px"
echo "  ✓ Center: flex-1, never reflows"
echo "  ✓ Right: drag handle on left edge"
echo "  ✓ Drag left → expands (overlays center)"
echo "  ✓ Drag right → shrinks"
echo "  ✓ >520px → center dims with overlay"
echo "  ✓ Double-click handle → toggle default/collapse"
echo "  ✓ Click dim → collapses panel"
echo "  ✓ Width persists in localStorage"
echo "  ✓ ArjunChip → opens panel with response"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
