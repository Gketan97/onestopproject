import { useCallback } from 'react'
import { useArjunStore, type ArjunMessage } from '@/store/arjunStore'
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
