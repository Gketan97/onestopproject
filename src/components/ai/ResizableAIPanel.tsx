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
