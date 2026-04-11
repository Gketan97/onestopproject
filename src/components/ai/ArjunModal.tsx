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
        {[0, 1, 2].map((dotIdx) => (
          <motion.div key={dotIdx} className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--text-muted)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: dotIdx * 0.2 }} />
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
