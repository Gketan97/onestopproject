#!/usr/bin/env bash
# ARCHITECTURE REBUILD — Inline Arjun + Bounded AI + 2-panel shell
# Removes: ResizableAIPanel, aiPanelStore, usePanelResize
# Adds: ArjunModal, useArjun hook, bounded system prompt

set -euo pipefail

echo "📋 Architecture Rebuild — Inline Arjun"
echo "────────────────────────────────────────"

for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ $contract missing"; exit 1; }
done

mkdir -p src/hooks src/components/ai src/store

# ── 1. Remove old AI panel store — replace with simple modal store ─────────────
cat > src/store/arjunStore.ts << 'EOF'
import { create } from 'zustand'

export interface ArjunMessage {
  role:    'user' | 'arjun'
  content: string
  id:      string
}

interface ArjunState {
  isOpen:       boolean
  isLoading:    boolean
  messages:     ArjunMessage[]
  phaseContext: string
  openModal:    (phaseContext: string) => void
  closeModal:   () => void
  addMessage:   (msg: ArjunMessage) => void
  setLoading:   (v: boolean) => void
  clearMessages: () => void
}

export const useArjunStore = create<ArjunState>()((set) => ({
  isOpen:       false,
  isLoading:    false,
  messages:     [],
  phaseContext: '',

  openModal:    (phaseContext) => set({ isOpen: true, phaseContext }),
  closeModal:   () => set({ isOpen: false }),
  addMessage:   (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading:   (v) => set({ isLoading: v }),
  clearMessages: () => set({ messages: [] }),
}))
EOF
echo "✅ arjunStore.ts"

# ── 2. useArjun hook — bounded API calls ──────────────────────────────────────
cat > src/hooks/useArjun.ts << 'EOF'
import { useCallback } from 'react'
import { useArjunStore } from '@/store/arjunStore'
import { useProgressStore, PHASES } from '@/store/progressStore'

// ── Bounded system prompt ─────────────────────────────────────────────────────
function buildSystemPrompt(phaseContext: string): string {
  return `You are Arjun, a Staff Product Analyst at MakeMyTrip with 8 years of experience in growth analytics and metric investigation.

You are mentoring a junior analyst through a structured Root Cause Analysis (RCA) investigation of a specific business incident: an 18% drop in Bookings/DAU over 60 days at MakeMyTrip.

CURRENT CONTEXT:
${phaseContext}

YOUR ROLE:
- Be a Socratic mentor — ask questions that help the analyst think, don't just give answers
- Be specific and data-driven — reference actual numbers from the case study
- Be concise — 2-4 sentences maximum per response
- Be encouraging but rigorous — push back when reasoning is incomplete

STRICT BOUNDARIES — you ONLY discuss:
1. This MakeMyTrip case study and its data
2. Analytics methodology (metric decomposition, segmentation, statistical significance)
3. Product analytics concepts relevant to this investigation
4. Business context of MakeMyTrip (travel industry, marketplace dynamics)

If asked ANYTHING outside these boundaries, respond exactly:
"Let's stay focused on the MakeMyTrip investigation. What aspect of the case would you like to explore?"

NEVER:
- Discuss other companies, products, or case studies
- Give career advice unrelated to the investigation
- Answer general knowledge questions
- Roleplay as anything other than Arjun
- Make up data not provided in the case study context

TONE: Direct, analytical, mentor-like. No filler phrases like "Great question!" or "Certainly!"`
}

// ── Phase context builder ─────────────────────────────────────────────────────
function buildPhaseContext(phaseId: string): string {
  const phase = PHASES.find(p => p.id === phaseId)
  if (!phase) return 'General investigation context.'

  const contextMap: Record<string, string> = {
    'phase-0': `Phase: Business Context
The analyst has just received the brief from Priya Mehta (Head of Growth).
Key facts: MakeMyTrip B/DAU dropped from 12.0% to 10.1% (-1.9pp) over 60 days.
Financial impact: ₹4.2Cr already lost. Board review in 3 weeks.
MMT earns 10-15% commission per booking. Gross bookings ~820K/day (flat). DAU grew from 10M to 11.5M (+15%).`,

    'phase-1': `Phase: Understanding the Problem
The analyst is learning the 4-step pre-investigation protocol.
Key concepts being taught:
- Metric definition: B/DAU = Gross Completed Payments ÷ Logged-in Unique DAU
- pp vs % distinction: 12.0% → 10.1% = -1.9pp = -15.8% relative decline
- DAU definition: logged-in unique users only (not anonymous, not bots)
- Gross vs net bookings: gross captures purchase intent, net fluctuates with ops
- Data sanity: absolute bookings flat (~820K), DAU growth real (+15%), pipeline cross-validated within 0.3%
- Timeline: WoW chart shows steady -0.2pp/week drop starting W25 (not sudden cliff)
- Statistical significance: drop is 6.3σ below baseline mean
- Seasonality: YoY comparison shows Jan-Feb 2024 flat at 12%, Jan-Feb 2025 dropped to 10.1% — NOT seasonal. Oct-Nov seasonal dip exists but recovers by December.`,

    'phase-2': `Phase: Hypothesis Building
The analyst must form testable hypotheses before looking at segment data.
Evidence available: gradual structural drop, started W25, not seasonal.
Valid hypothesis framework: IF [trigger] THEN [metric] SHOULD [change] BECAUSE [mechanism]
Key hypotheses to explore: iOS regression, supply quality change, checkout UX degradation, pricing shift.
Red herrings to eliminate: marketing spend (no change), competitor pricing (no evidence), seasonal pattern (ruled out).`,

    'phase-3': `Phase: Segmentation
The analyst is breaking down the overall drop by segments to find WHERE it's concentrated.
Platform data: Android CVR 16.2% (stable), iOS v8.2 CVR 15.8% (stable), iOS v8.3 CVR 6.1% (massive drop).
iOS v8.3 adoption: grew from 0% to 78% over 60 days — adoption curve matches drop timeline perfectly.
User impact: iOS v8.3 users (42K) lost 9.7pp CVR. Other users (64K) stable.`,

    'phase-4': `Phase: Metric Decomposition
Now decomposing WITHIN the iOS v8.3 segment specifically.
B/DAU = (Bookings/Sessions) × (Sessions/DAU) = CVR leg × Engagement leg
iOS v8.3 data: Sessions/DAU stable (engagement unchanged). Bookings/Sessions dropped -9.7pp (CVR broke).
The CVR leg broke. Engagement is fine. Problem is in conversion, not retention.`,

    'phase-5': `Phase: Funnel Breakdown
Finding the exact funnel step that failed on iOS v8.3.
Funnel stages: Search → List → Detail → Checkout → Payment → Booking
iOS v8.3 funnel: Detail→Checkout dropped from 25% to 15% (-10pp). All other stages stable.
Checkout load time on iOS v8.3: 4.2 seconds (vs 1.8s Android, 2.1s iOS v8.2).
Latency regression on iOS v8.3 at checkout is the smoking gun.`,

    'phase-6': `Phase: Root Cause Sizing
Quantifying how much each cause contributed to the total -1.9pp drop.
Checkout latency (iOS v8.3): 35% of total drop = -0.67pp
Review fatigue (too many review screens): 28% = -0.53pp  
HVT package shift (fewer high-value packages): 22% = -0.42pp
Visa uncertainty messaging: 15% = -0.28pp`,

    'phase-7': `Phase: Solutions & Impact
Recommending fixes with quantified recovery estimates.
Fix 1: iOS v8.3 latency fix → +0.7pp CVR recovery (2 weeks, high confidence)
Fix 2: Simplify review flow → +0.5pp (4 weeks, medium confidence)
Fix 3: Optimize package filtering → +0.4pp (3 weeks, medium confidence)
Fix 4: Visa messaging → +0.3pp (1 week, low confidence)
Fastest recovery: latency fix + visa messaging = 1.0pp in 3 weeks.`,
  }

  return contextMap[phaseId] ?? `Phase: ${phase.label}\n${phase.subtitle}`
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useArjun() {
  const {
    isOpen, isLoading, messages,
    openModal, closeModal, addMessage, setLoading, clearMessages,
  } = useArjunStore()

  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)

  const open = useCallback((phaseId?: string) => {
    const id = phaseId ?? currentPhaseId
    openModal(buildPhaseContext(id))
  }, [currentPhaseId, openModal])

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isLoading) return

    const phaseContext  = useArjunStore.getState().phaseContext
    const currentMsgs   = useArjunStore.getState().messages

    const userMsg: ArjunMessage = {
      role:    'user',
      content: userText.trim(),
      id:      `u-${Date.now()}`,
    }
    addMessage(userMsg)
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:     buildSystemPrompt(phaseContext),
          messages:   [
            ...currentMsgs.map(m => ({
              role:    m.role === 'arjun' ? 'assistant' : 'user',
              content: m.content,
            })),
            { role: 'user', content: userText.trim() },
          ],
        }),
      })

      const data   = await response.json()
      const text   = data.content?.[0]?.text ?? "I'm having trouble connecting. Try again."

      addMessage({
        role:    'arjun',
        content: text,
        id:      `a-${Date.now()}`,
      })
    } catch {
      addMessage({
        role:    'arjun',
        content: 'Connection issue. Please try again.',
        id:      `a-err-${Date.now()}`,
      })
    } finally {
      setLoading(false)
    }
  }, [isLoading, addMessage, setLoading])

  return {
    isOpen, isLoading, messages,
    open, closeModal, sendMessage, clearMessages,
    openWithContext: open,
  }
}
EOF
echo "✅ useArjun.ts"

# ── 3. ArjunModal — floating button + bounded modal ───────────────────────────
cat > src/components/ai/ArjunModal.tsx << 'EOF'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence }                   from 'framer-motion'
import { X, Send, Sparkles }                         from 'lucide-react'
import { useArjun }                                  from '@/hooks/useArjun'
import { useProgressStore }                          from '@/store/progressStore'

// ── Suggested questions per phase ─────────────────────────────────────────────
const PHASE_SUGGESTIONS: Record<string, string[]> = {
  'phase-0': [
    'What makes this a P0 incident?',
    'How does MMT make money exactly?',
    'What should I know before starting the investigation?',
  ],
  'phase-1': [
    'Why check definitions before looking at data?',
    'What is the difference between pp and %?',
    'How do I verify if the data is trustworthy?',
    'Why does the shape of the drop matter?',
  ],
  'phase-2': [
    'How do I structure a good hypothesis?',
    'What evidence do I have so far?',
    'What are common red herrings in metric drops?',
  ],
  'phase-3': [
    'How do I decide which segments to check first?',
    'What makes iOS v8.3 suspicious?',
    'How does adoption curve help the investigation?',
  ],
  'phase-4': [
    'How do I decompose B/DAU into legs?',
    'Which leg broke and how do I know?',
    'What does stable Sessions/DAU tell me?',
  ],
  'phase-5': [
    'How do I read a funnel heatmap?',
    'What is the smoking gun here?',
    'Why does checkout latency cause CVR to drop?',
  ],
  'phase-6': [
    'How do I size the impact of each root cause?',
    'What percentage should I attribute to latency?',
  ],
  'phase-7': [
    'Which fix should we prioritize first?',
    'How do I present this to the board?',
    'What is the fastest path to recovery?',
  ],
}

// ── ArjunMessage component ─────────────────────────────────────────────────────
function MessageBubble({ role, content }: { role: 'user' | 'arjun'; content: string }) {
  const isArjun = role === 'arjun'
  return (
    <div className={`flex gap-3 ${isArjun ? '' : 'flex-row-reverse'}`}>
      {isArjun && (
        <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold mt-1"
          style={{
            background:  'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(255,107,53,0.25))',
            border:      '1px solid rgba(129,140,248,0.30)',
            color:       'var(--text-primary)',
            fontFamily:  'var(--font-heading)',
          }}>
          A
        </div>
      )}
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={{
          background: isArjun ? 'var(--bg-surface)' : 'rgba(129,140,248,0.12)',
          border:     isArjun ? '1px solid var(--border-subtle)' : '1px solid rgba(129,140,248,0.25)',
          color:      'var(--text-secondary)',
          borderRadius: isArjun ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        }}
      >
        {isArjun && (
          <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
            Arjun
          </p>
        )}
        {content}
      </div>
    </div>
  )
}

// ── Loading dots ───────────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
        A
      </div>
      <div className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px 16px 16px 16px' }}>
        {[0, 1, 2].map(i => (
          <motion.div key={dotIndex} className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--text-muted)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
    </div>
  )
}

// ── Main modal ─────────────────────────────────────────────────────────────────
export function ArjunModal() {
  const { isOpen, isLoading, messages, open, closeModal, sendMessage, clearMessages } = useArjun()
  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)
  const [input, setInput]     = useState('')
  const messagesEndRef         = useRef<HTMLDivElement>(null)
  const inputRef               = useRef<HTMLTextAreaElement>(null)
  const suggestions            = PHASE_SUGGESTIONS[currentPhaseId] ?? []
  const isFirstOpen            = messages.length === 0

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeModal])

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }, [input, isLoading, sendMessage])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSuggestion(q: string) {
    sendMessage(q)
  }

  function handleOpen() {
    clearMessages()
    open(currentPhaseId)
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.8, y: 20  }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background:  'linear-gradient(135deg, rgba(129,140,248,0.9), rgba(255,107,53,0.8))',
              border:      '1px solid rgba(255,255,255,0.15)',
              color:       '#fff',
              fontFamily:  'var(--font-heading)',
              fontSize:    '13px',
              fontWeight:  600,
              boxShadow:   '0 8px 32px rgba(129,140,248,0.35)',
            }}
            aria-label="Ask Arjun"
          >
            <Sparkles size={15} />
            Ask Arjun
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={closeModal}
            />

            {/* Modal panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 40, scale: 0.95  }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
              style={{
                width:      '420px',
                height:     '560px',
                background: 'var(--bg-elevated)',
                border:     '1px solid var(--border-default)',
                boxShadow:  '0 24px 80px rgba(0,0,0,0.5)',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Ask Arjun"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Arjun
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      Staff Analyst · Case-bounded
                    </p>
                  </div>
                </div>
                <button onClick={closeModal}
                  className="p-1.5 rounded-lg transition-all hover:bg-white/5"
                  aria-label="Close">
                  <X size={15} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Welcome state */}
                {isFirstOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        A
                      </div>
                      <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: '4px 16px 16px 16px' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                          style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun</p>
                        Ask me anything about this investigation. I'm bounded to this case study — I won't answer questions outside it.
                      </div>
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest px-1"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Suggested questions
                        </p>
                        {suggestions.map((q) => (
                          <button key={q} onClick={() => handleSuggestion(q)}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5"
                            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Message history */}
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))}

                {/* Loading */}
                {isLoading && <LoadingDots />}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-3 shrink-0"
                style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the investigation..."
                    rows={2}
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm resize-none"
                    style={{
                      background:  'var(--bg-surface)',
                      border:      '1px solid var(--border-default)',
                      color:       'var(--text-primary)',
                      outline:     'none',
                      fontFamily:  'var(--font-body)',
                      lineHeight:  1.5,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'
                      e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(129,140,248,0.10)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)'
                      e.currentTarget.style.boxShadow  = 'none'
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    style={{ background: 'var(--accent-secondary)', color: '#fff' }}
                    aria-label="Send">
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-center mt-2 text-xs"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  Bounded to MakeMyTrip case study · Press Enter to send
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
EOF
echo "✅ ArjunModal.tsx"

# ── 4. Updated ArjunChip — opens modal instead of panel ──────────────────────
cat > src/components/phases/ArjunChip.tsx << 'EOF'
import { Sparkles }  from 'lucide-react'
import { useArjun }  from '@/hooks/useArjun'
import { useProgressStore } from '@/store/progressStore'

interface ArjunChipProps {
  label:       string
  prefillText?: string  // optional: pre-sends a message when chip is clicked
}

export function ArjunChip({ label, prefillText }: ArjunChipProps) {
  const { open, sendMessage, isOpen } = useArjun()
  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)

  function handleClick() {
    open(currentPhaseId)
    if (prefillText) {
      // Small delay to let modal open first
      setTimeout(() => sendMessage(prefillText), 200)
    }
  }

  return (
    <button
      onClick={handleClick}
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

# ── 5. Rebuilt 2-panel CaseStudy shell — nav bug fixed ───────────────────────
cat > src/pages/CaseStudy/index.tsx << 'EOF'
import { useEffect }                      from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
import { MobileGate }                     from '@/components/ui/MobileGate'
import { ProgressNav }                    from '@/components/layout/ProgressNav'
import { CenterPanel }                    from '@/components/layout/CenterPanel'
import { ArjunModal }                     from '@/components/ai/ArjunModal'
import { useProgressStore }               from '@/store/progressStore'

const DESKTOP_BREAKPOINT = 1024

export default function CaseStudyShell() {
  const { slug, phase } = useParams<{ slug: string; phase?: string }>()
  const navigate         = useNavigate()
  const currentPhaseId   = useProgressStore((s) => s.currentPhaseId)
  const isDesktop        =
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT

  // Only redirect on initial load when no phase in URL
  useEffect(() => {
    if (!phase && slug) {
      navigate(`/case-study/${slug}/${currentPhaseId}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps — only run once on mount

  if (!isDesktop) return <MobileGate />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <ProgressNav />
      <div className="flex-1 min-w-0 overflow-hidden">
        <CenterPanel />
      </div>
      {/* Arjun floating modal — always available */}
      <ArjunModal />
    </div>
  )
}
EOF
echo "✅ CaseStudyShell — 2-panel + ArjunModal"

# ── 6. Fix ProgressNav — use window.location for reliable navigation ──────────
cat > src/components/layout/ProgressNav.tsx << 'EOF'
import { useState, useEffect }      from 'react'
import { useParams, useLocation }   from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import { CheckCircle, Lock, Circle, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'
import { useProgressStore, PHASES, type PhaseId } from '@/store/progressStore'
import { cn } from '@/lib/utils'

const NAV_WIDTH = 256

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function ProgressNav() {
  const { slug }    = useParams<{ slug: string }>()
  const location    = useLocation()
  const { isUnlocked, isCompleted, progressPercent, currentPhaseId, resetProgress } =
    useProgressStore()

  const percent = progressPercent()

  const [expandedPhases, setExpandedPhases] = useState<Set<PhaseId>>(
    new Set([currentPhaseId])
  )

  useEffect(() => {
    setExpandedPhases((prev) => new Set([...prev, currentPhaseId]))
  }, [currentPhaseId])

  function isAccessible(phaseId: PhaseId): boolean {
    return isUnlocked(phaseId) || isCompleted(phaseId)
  }

  function handlePhaseClick(phaseId: PhaseId) {
    if (!isAccessible(phaseId)) return
    // Use window.location for reliable navigation in nested route context
    window.location.href = `/case-study/${slug}/${phaseId}`
  }

  function handleSectionClick(phaseId: PhaseId, sectionId: string) {
    if (!isAccessible(phaseId)) return
    const target = `/case-study/${slug}/${phaseId}`
    if (window.location.pathname === target) {
      scrollToSection(sectionId)
    } else {
      window.location.href = target
      setTimeout(() => scrollToSection(sectionId), 600)
    }
  }

  function handleReset() {
    resetProgress()
    window.location.href = `/case-study/${slug}/phase-0`
  }

  // Track expanded state based on current URL
  useEffect(() => {
    const currentPhase = location.pathname.split('/').pop() as PhaseId
    if (currentPhase) {
      setExpandedPhases((prev) => new Set([...prev, currentPhase]))
    }
  }, [location.pathname])

  return (
    <aside
      className="flex flex-col shrink-0 h-full overflow-y-auto"
      style={{ width: `${NAV_WIDTH}px`, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
      aria-label="Phase navigation"
    >
      {/* Progress bar */}
      <div className="px-4 pt-5 pb-4 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Progress</span>
          <span className="text-xs font-semibold"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}
          role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
            initial={{ width: 0 }} animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 16px' }} />

      {/* Phase list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {PHASES.map((phase) => {
          const accessible  = isAccessible(phase.id)
          const completed   = isCompleted(phase.id)
          const isCurrentUrl = location.pathname.includes(phase.id)
          const isCurrent   = isCurrentUrl
          const isExpanded  = expandedPhases.has(phase.id)
          const hasSections = phase.sections.length > 0

          return (
            <div key={phase.id}>
              <button
                onClick={() => handlePhaseClick(phase.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                  accessible ? 'cursor-pointer hover:bg-white/5' : 'cursor-not-allowed opacity-35',
                )}
                style={{
                  background: isCurrent ? 'rgba(255,107,53,0.07)' : 'transparent',
                  border:     isCurrent ? '1px solid rgba(255,107,53,0.15)' : '1px solid transparent',
                }}
              >
                <span className="shrink-0">
                  {completed
                    ? <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />
                    : accessible
                    ? <Circle size={14} style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                    : <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{
                    color:      completed ? 'var(--accent-green)' : isCurrent ? 'var(--accent-primary)' : accessible ? 'var(--text-secondary)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)',
                  }}>{phase.label}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                    {String(phase.order).padStart(2, '0')}
                  </span>
                  {hasSections && accessible && (
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
                    </motion.span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {hasSections && isExpanded && accessible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 pl-3 py-1 space-y-0.5"
                      style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                      {phase.sections.map((section) => (
                        <button key={section.id}
                          onClick={() => handleSectionClick(phase.id, section.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all hover:bg-white/5">
                          <ChevronRight size={10} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs truncate"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {section.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Reset */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all hover:bg-white/5"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
          <RotateCcw size={11} />
          Reset progress
        </button>
      </div>
    </aside>
  )
}
EOF
echo "✅ ProgressNav.tsx — window.location navigation"

# ── 7. Update barrel exports ──────────────────────────────────────────────────
cat > src/components/ai/index.ts << 'EOF'
export { ArjunModal } from './ArjunModal'
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
export { WoWChart }        from './WoWChart'
export { YoYChart }        from './YoYChart'
EOF
echo "✅ barrel exports"

# ── 8. Update Phase1 — fix ArjunChip to use prefillText ──────────────────────
# ArjunChip now uses prefillText instead of content object
# Update Phase1 chip calls
python3 << 'PYEOF'
with open('src/pages/CaseStudy/phases/Phase1.tsx', 'r') as f:
    content = f.read()

# Replace old ArjunChip pattern with new prefillText pattern
import re
# Pattern: <ArjunChip label="..." content={{ type: 'insight', title: '...', text: '' }} />
# Replace with: <ArjunChip label="..." prefillText="..." />
content = re.sub(
    r'<ArjunChip\s+label="([^"]+)"\s+content=\{\{[^}]+\}\}\s*/>',
    lambda m: f'<ArjunChip label="{m.group(1)}" prefillText="{m.group(1)}" />',
    content
)

with open('src/pages/CaseStudy/phases/Phase1.tsx', 'w') as f:
    f.write(content)
print("✅ Phase1 ArjunChip updated")
PYEOF

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "❌ Fix above"

echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Architecture rebuild complete:"
echo "  ✓ Right panel REMOVED"
echo "  ✓ ArjunModal — floating button bottom-right"
echo "  ✓ Bounded system prompt — case study only"
echo "  ✓ Phase-aware suggestions in modal"
echo "  ✓ Real Anthropic API calls"
echo "  ✓ Nav uses window.location — navigation bug fixed"
echo "  ✓ Shell useEffect runs once on mount only"
echo "  ✓ 2-panel layout (nav + content)"
echo ""
echo " Test:"
echo "  ✓ Click completed phase → navigates correctly"
echo "  ✓ 'Ask Arjun' button bottom-right"
echo "  ✓ ArjunChips open modal with pre-sent question"
echo "  ✓ Arjun refuses off-topic questions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
