/**
 * ArjunMentor.jsx
 * Arjun — Staff Analyst AI partner. Slack-style thread.
 * Socratic, skeptical, high-standards. Dirty data intervention.
 * Uses v1 useArjun hook (routes through /.netlify/functions/evaluate)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArjun } from './hooks/useArjun.js';

const ARJUN_PERSONA = {
  name: 'Arjun Menon',
  title: 'Staff Analyst · ex-Swiggy, ex-Uber',
  initials: 'AJ',
  avatar: { bg: 'rgba(252,128,25,0.12)', border: 'rgba(252,128,25,0.3)', color: '#FC8019' },
};

const MSG = { ARJUN: 'arjun', USER: 'user', SYSTEM: 'system', DATA_ALERT: 'data_alert' };

const SOCRATIC_RESPONSES = {
  shallow: [
    "You've described what you see. I'm asking what it means. What's the underlying mechanism here?",
    "That's an observation. I need a hypothesis. What's your causal explanation?",
    "Every junior analyst says that. A staff analyst would ask: what would falsify this hypothesis?",
  ],
  skip_sanity: [
    "Before we go further — have you checked the data pipeline? What's your confidence level on these numbers?",
    "Hold on. You're building on this data without questioning it. What if the pipeline is lagged?",
    "I've seen analysts lose two hours chasing a ghost metric. How do you know this data is clean?",
  ],
  strong: [
    "Good. Now quantify it. What's the impact in rupees?",
    "Right direction. Now: who owns the fix, and what's the timeline? Your VP will ask.",
    "Correct. Now tell me: what would change this conclusion? What evidence would make you wrong?",
  ],
  root_cause: [
    "You found it. Now the harder question: is this 'cause' actually fixable? Who owns it?",
    "Good. But there's a second cause you haven't named. What else could explain the residual 30%?",
  ],
};

function getRandomSocratic(type) {
  const arr = SOCRATIC_RESPONSES[type] || SOCRATIC_RESPONSES.shallow;
  return arr[Math.floor(Math.random() * arr.length)];
}

function Avatar({ initials, config, size = 32, pulse = false }) {
  return (
    <div className="relative flex-shrink-0">
      <motion.div
        className="rounded-xl flex items-center justify-center font-mono font-bold"
        style={{ width: size, height: size, background: config.bg, border: `1px solid ${config.border}`, color: config.color, fontSize: size * 0.3 }}
        animate={pulse ? { boxShadow: ['0 0 0px transparent', `0 0 16px ${config.border}`, '0 0 0px transparent'] } : {}}
        transition={{ duration: 2, repeat: pulse ? Infinity : 0 }}
      >
        {initials}
      </motion.div>
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
          style={{ background: '#FC8019', borderColor: '#050505' }} />
      )}
    </div>
  );
}

function ThreadMessage({ msg }) {
  const isArjun  = msg.from === MSG.ARJUN;
  const isSystem = msg.from === MSG.SYSTEM;
  const isAlert  = msg.from === MSG.DATA_ALERT;

  if (isSystem) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span className="font-mono text-[10px] px-3" style={{ color: 'rgba(255,255,255,0.2)' }}>{msg.text}</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </motion.div>
    );
  }

  if (isAlert) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl px-4 py-3 border-l-2"
        style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.2)', borderLeft: '2px solid #F5A623' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ color: '#F5A623', fontSize: 12 }}>⚠</motion.span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#F5A623' }}>Data Alert</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{msg.text}</p>
      </motion.div>
    );
  }

  const avatarConfig = isArjun
    ? ARJUN_PERSONA.avatar
    : { bg: 'rgba(30,79,204,0.12)', border: 'rgba(30,79,204,0.3)', color: '#4F80FF' };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex gap-3">
      <Avatar initials={isArjun ? 'AJ' : 'YOU'} config={avatarConfig} size={30} pulse={isArjun && msg.isTyping} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold" style={{ color: isArjun ? '#FC8019' : '#4F80FF' }}>
            {isArjun ? ARJUN_PERSONA.name : 'You'}
          </span>
          {isArjun && <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{ARJUN_PERSONA.title}</span>}
          <span className="font-mono text-[9px] ml-auto" style={{ color: 'rgba(255,255,255,0.2)' }}>{msg.time}</span>
        </div>
        <div className="rounded-xl px-4 py-3 leading-relaxed"
          style={{
            background: isArjun ? (msg.isChallenge ? 'rgba(252,128,25,0.08)' : 'rgba(255,255,255,0.03)') : 'rgba(30,79,204,0.08)',
            border: `1px solid ${isArjun ? (msg.isChallenge ? 'rgba(252,128,25,0.2)' : 'rgba(255,255,255,0.07)') : 'rgba(30,79,204,0.2)'}`,
          }}>
          {msg.isTyping ? (
            <div className="flex items-center gap-1.5 py-0.5">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#FC8019' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: isArjun ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)', fontSize: 13, fontStyle: isArjun ? 'italic' : 'normal' }}>
              {msg.text}
            </p>
          )}
        </div>
        {msg.reactions && (
          <div className="flex gap-1.5 mt-1.5">
            {msg.reactions.map((r, i) => (
              <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const STRATEGIC_PROMPTS = [
  { label: 'Challenge my hypothesis', icon: '⚡', type: 'challenge' },
  { label: 'What am I missing?',      icon: '◉', type: 'gap' },
  { label: 'Verify data sanity',      icon: '⚠', type: 'sanity' },
  { label: 'How do I size the impact?', icon: '△', type: 'sizing' },
];

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function ArjunMentor({
  milestone = 'metric',
  dirtyDataEnabled = true,
  initialMessages = [],
  onDirtyDataTrigger,
  className = '',
}) {
  const [messages, setMessages] = useState([
    {
      from: MSG.ARJUN,
      text: "You're looking at a ₹28L/month drop in orders. Before you touch a single query — what's the first question you need answered?",
      time: timestamp(),
      reactions: ['🤔 12', '✓ 4'],
    },
    ...initialMessages,
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sanityChecked, setSanityChecked] = useState(false);
  const [dirtyTriggered, setDirtyTriggered] = useState(false);
  const messagesEndRef = useRef(null);
  const messageCount   = useRef(messages.length);
  const { callArjun }  = useArjun();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messageCount.current = messages.length;
  }, [messages]);

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, { ...msg, time: timestamp() }]);
  }, []);

  const sendMessage = useCallback(async (text, promptType) => {
    const userText = text || input;
    if (!userText.trim()) return;
    setInput('');
    addMessage({ from: MSG.USER, text: userText });

    const skipsSanity = dirtyDataEnabled && !sanityChecked && messageCount.current > 3
      && !userText.toLowerCase().includes('sanit') && !userText.toLowerCase().includes('clean')
      && !userText.toLowerCase().includes('pipeline') && !userText.toLowerCase().includes('lag');

    if (skipsSanity && !dirtyTriggered && promptType !== 'sanity') {
      setDirtyTriggered(true);
      onDirtyDataTrigger?.();
      setTimeout(() => addMessage({ from: MSG.SYSTEM, text: '— Arjun triggered Data Sanity intervention —' }), 600);
      setTimeout(() => {
        setLoading(true);
        addMessage({ from: MSG.ARJUN, isTyping: true, text: '', time: timestamp() });
        setTimeout(() => {
          setMessages(prev => {
            const updated = [...prev];
            const idx = updated.findLastIndex(m => m.isTyping);
            if (idx !== -1) updated[idx] = { from: MSG.ARJUN, text: getRandomSocratic('skip_sanity'), time: timestamp(), isChallenge: true };
            return updated;
          });
          setLoading(false);
        }, 1800);
      }, 1200);
      return;
    }

    if (promptType === 'sanity') setSanityChecked(true);

    setLoading(true);
    addMessage({ from: MSG.ARJUN, isTyping: true, text: '', time: timestamp() });

    const responseType = promptType === 'challenge' || promptType === 'gap' ? 'shallow'
      : promptType === 'sanity' ? (sanityChecked ? 'strong' : 'skip_sanity')
      : promptType === 'sizing' ? 'root_cause'
      : userText.length > 80 ? 'strong' : 'shallow';

    // Use v1's Netlify proxy via callArjun
    let responseText;
    try {
      responseText = await callArjun(
        `You are Arjun, a Staff Analyst. Be Socratic. Context: Swiggy incident war room. Phase: ${milestone}. User: "${userText}" (type: ${promptType || 'free'}). Respond in 1–3 sentences. Be direct and challenging.`,
        'clarify'
      );
    } catch {
      responseText = getRandomSocratic(responseType);
    }
    if (!responseText) responseText = getRandomSocratic(responseType);

    setMessages(prev => {
      const updated = [...prev];
      const idx = updated.findLastIndex(m => m.isTyping);
      if (idx !== -1) updated[idx] = { from: MSG.ARJUN, text: responseText, time: timestamp(), isChallenge: promptType === 'challenge' };
      return updated;
    });
    setLoading(false);
  }, [input, addMessage, callArjun, milestone, sanityChecked, dirtyTriggered, dirtyDataEnabled, onDirtyDataTrigger]);

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', maxHeight: '70vh' }}>
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center gap-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <Avatar initials="AJ" config={ARJUN_PERSONA.avatar} size={32} pulse />
        <div className="flex-1">
          <p className="font-mono text-[12px] font-bold" style={{ color: '#FC8019' }}>{ARJUN_PERSONA.name}</p>
          <p className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{ARJUN_PERSONA.title}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,90,101,0.08)', border: '1px solid rgba(255,90,101,0.2)' }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF5A65' }} />
          <span className="font-mono text-[10px]" style={{ color: '#FF5A65' }}>Incident · LIVE</span>
        </div>
      </div>

      {/* Channel */}
      <div className="px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
        <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          # war-room · swiggy-orders-incident · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => <ThreadMessage key={i} msg={msg} />)}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2.5 border-t flex gap-2 overflow-x-auto custom-scrollbar flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {STRATEGIC_PROMPTS.map(p => (
          <motion.button key={p.label} onClick={() => sendMessage(p.label, p.type)} disabled={loading}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] whitespace-nowrap"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', opacity: loading ? 0.4 : 1 }}
            whileHover={!loading ? { borderColor: 'rgba(252,128,25,0.35)', color: 'rgba(255,255,255,0.8)' } : {}}>
            <span>{p.icon}</span>{p.label}
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && sendMessage()}
            placeholder="Reply to Arjun..." disabled={loading}
            className="flex-1 rounded-xl px-4 py-2.5 outline-none font-mono text-sm"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 12, opacity: loading ? 0.6 : 1 }}
            onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          <motion.button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl font-mono text-sm font-bold"
            style={{ background: input.trim() && !loading ? '#FC8019' : 'rgba(255,255,255,0.04)', color: input.trim() && !loading ? 'white' : 'rgba(255,255,255,0.2)', border: '1px solid transparent' }}
            whileHover={input.trim() && !loading ? { scale: 1.05 } : {}} whileTap={input.trim() && !loading ? { scale: 0.95 } : {}}>
            ↵
          </motion.button>
        </div>
      </div>
    </div>
  );
}
