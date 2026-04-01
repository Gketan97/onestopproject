// src/components/strategy/components/StrategyHero.jsx
// Sprint 6: FounderStrip added between Testimonials and closing tags
// All audit fixes from previous sprint preserved.

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Brain, TrendingUp, FileText } from 'lucide-react';
import FounderStrip from './FounderStrip.jsx';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

const PERSONAS = [
  { pill:'Product Managers', roleA:'Product Manager · Application', archetypeA:'The Feature Shipper', bulletsA:['Wrote feature specs and managed delivery for 3 teams','Coordinated with design and engineering on launches','Tracked daily users and whether they came back — via the data team','Ran weekly standups and kept stakeholders updated'], roleB:'Senior PM · Interview in 2 Days ✓', archetypeB:'The Incident Owner', bulletsB:['Led the response across teams when weekly revenue dropped 8.3%','Listed every possible cause, ranked by likelihood — found the real one in 48h','Wrote a one-page brief for the VP sizing a ₹2Cr+ recovery opportunity','Built an early-warning system adopted across 3 business areas'], footerB:'● Interview scheduled · Thursday 3 PM' },
  { pill:'Business Analysts', roleA:'Business Analyst · Application', archetypeA:'The Report Runner', bulletsA:['Ran data queries whenever marketing or ops teams asked','Built weekly order dashboards in Tableau for leadership','Maintained data processes across three databases','Created Excel models for monthly business reviews'], roleB:'Senior Analyst · Interview in 2 Days ✓', archetypeB:'The Root Cause Detective', bulletsB:['Diagnosed an 8.3% weekly revenue drop by working through the problem step by step','Tracked how new users behaved over time — found ₹1.2Cr at risk in North Bangalore','Wrote an executive brief for the VP of Product with clear impact numbers','Built a system that flags drops before they become problems — used across 3 teams'], footerB:'● Interview scheduled · Thursday 3 PM' },
  { pill:'Strategy & Ops', roleA:'Strategy Associate · Application', archetypeA:'The Deck Builder', bulletsA:['Built weekly ops review decks for the leadership team','Tracked KPIs in spreadsheets and flagged issues to managers','Supported city-level reviews with pre-formatted templates','Pulled data from the analytics team for monthly reports'], roleB:'Strategy Lead · Interview in 2 Days ✓', archetypeB:'The Business Architect', bulletsB:['Led the response across teams when weekly orders dropped 8.3% in North Bangalore','Built a clear diagnostic process that found the root cause in under 48 hours','Presented a ₹2Cr+ recovery plan directly to the VP of Growth — approved first review','Created a reusable incident playbook now standard across 3 city teams'], footerB:'● Interview scheduled · Thursday 3 PM' },
  { pill:'Consulting Associates', roleA:'Consulting Analyst · Application', archetypeA:'The Slide Factory', bulletsA:['Supported case teams with research and data gathering','Built financial models in Excel based on manager inputs','Formatted slide decks and wrote up client interview notes','Tracked milestones and updated weekly status reports'], roleB:'Senior Associate · Interview in 2 Days ✓', archetypeB:'The Problem Solver', bulletsB:['Ran an independent analysis on a live ₹2Cr revenue problem — no one asked me to','Listed every possible cause, ruled them out one by one, found the real issue in 48h','Delivered a recommendation brief clear enough for any senior leader to act on','Designed a monitoring system that spotted issues weeks early — scaled across 3 teams'], footerB:'● Interview scheduled · Thursday 3 PM' },
  { pill:'Growth Managers', roleA:'Growth Manager · Application', archetypeA:'The Campaign Executor', bulletsA:['Managed paid campaigns across Google and Meta','Reported weekly acquisition costs and ad returns to leadership','A/B tested creatives and landing pages using third-party tools','Worked with analytics to pull retention and funnel reports'], roleB:'Growth Lead · Interview in 2 Days ✓', archetypeB:'The Revenue Architect', bulletsB:['Spotted that the 8.3% weekly revenue drop was a supply problem, not a demand problem','Found that new users were dropping off in week 4 — ₹2Cr+ at risk annually','Wrote the growth brief the VP adopted as the official recovery plan','Built a system that flags user drop-off 2 weeks before it shows up in the numbers'], footerB:'● Interview scheduled · Thursday 3 PM' },
  { pill:'BizOps Analysts', roleA:'BizOps Analyst · Application', archetypeA:'The Dashboard Maintainer', bulletsA:['Maintained operational dashboards for 4 city teams','Ran ad-hoc data reports for ops leads and city managers','Updated process documents and tracked compliance metrics','Prepared weekly review packs using pre-built Excel templates'], roleB:'Senior BizOps Analyst · Interview in 2 Days ✓', archetypeB:'The Operations Architect', bulletsB:['Cracked a ₹2Cr revenue drop by spotting that missing data was hiding the real cause','Tracked how new users behaved week by week — found the drop-off and sized the impact','Wrote the incident brief that became the standard for how the BizOps team handles issues','Built a monitoring framework now used across 3 business areas'], footerB:'● Interview scheduled · Thursday 3 PM' },
  { pill:'Product Analysts', roleA:'Product Analyst · Application', archetypeA:'The Metric Tracker', bulletsA:['Tracked product metrics and built dashboards for the product team','Pulled weekly retention and engagement reports via SQL and Metabase','Flagged unusual numbers in Slack and escalated to senior analysts','Kept the event tracking clean and supported data instrumentation checks'], roleB:'Senior Product Analyst · Interview in 2 Days ✓', archetypeB:'The Insight Driver', bulletsB:['Started the investigation into an 8.3% weekly revenue drop — before anyone asked','Spotted that bad data was hiding the real cause — re-ran everything and corrected the VP read','Wrote an impact brief that changed what the team built in Q3','Built a new-user health tracker now embedded in every quarterly product review'], footerB:'● Interview scheduled · Thursday 3 PM' },
];

const FEATURED_TESTIMONIAL = { quote:"I'd been applying for 3 months with no callbacks. Did this on a Sunday. Got a call from a Swiggy hiring manager on Tuesday. The link I sent — showing how I worked through the problem — was what made her stop and read.", name:'Rohan M.', role:'Business Analyst → Senior Analyst', company:'Swiggy', initials:'RM', color:ORANGE, when:'Completed Feb 2025' };

const TESTIMONIALS = [
  { quote:"Three offers in 6 weeks. The write-up I walked away with became the centrepiece of every interview.", name:'Meera T.', role:'Growth Manager → Growth Lead', company:'Zepto', initials:'MT', color:PURPLE },
  { quote:"The AI mentor caught me jumping to conclusions twice before I noticed. That's feedback you only get from a very senior colleague — if you're lucky.", name:'Priya K.', role:'Strategy Associate → BizOps Lead', company:'Razorpay', initials:'PK', color:BLUE },
  { quote:"I'm a PM, not a data person. But the way this teaches you to think through a business problem — before touching any data — is exactly what I was missing in every interview I'd had.", name:'Aditya S.', role:'Product Manager', company:'Razorpay', initials:'AS', color:GREEN },
  { quote:"There was missing data hiding the real answer. I would have 100% missed that in a real interview. Now I check for it every time before I present anything.", name:'Kiran B.', role:'BizOps Analyst → Senior BizOps', company:'PhonePe', initials:'KB', color:ORANGE },
  { quote:"Seeing my old bullets labelled 'The Report Runner' was brutal — in the best way. I rewrote my entire CV that afternoon. First recruiter call came 4 days later.", name:'Divya R.', role:'Product Analyst', company:'Flipkart', initials:'DR', color:BLUE },
];

const STATS = [
  { val:'3',     label:'Steps to work through', explainer:'Spot it → Dig in → Make the call', color:ORANGE },
  { val:'₹2Cr+', label:'Revenue you will size',  explainer:'Real numbers from a real scenario', color:BLUE  },
  { val:'1',     label:'Link you keep forever',   explainer:'Shareable proof of how you think',  color:GREEN },
];

const PHASES = [
  { num:'01', color:ORANGE, icon:Brain,      title:'Understand the problem first', subtitle:'Before looking at a single number', body:'Most people jump straight into data. You will learn to stop, ask the right questions, list every possible cause, and decide what to rule out first. Your AI thinking partner pushes back every time you move too fast.', outcome:'You leave knowing how to think clearly when things are unclear' },
  { num:'02', color:BLUE,   icon:TrendingUp, title:'Find what actually broke',      subtitle:'Let AI do the digging — you make the call', body:'Ask questions in plain English and watch the data respond. You will spot the real revenue drop — and the missing data that was hiding it. The AI surfaces patterns. You decide what they mean.', outcome:'You leave with a clear answer and the evidence to back it up' },
  { num:'03', color:GREEN,  icon:FileText,   title:'Turn your thinking into a career asset', subtitle:'A link you can share with any recruiter', body:'Write up your findings as a recommendation any senior leader can act on. Walk away with a shareable link showing your full thinking — plus a rewrite of your resume bullets that shows how to talk about this kind of work in any interview.', outcome:'You leave with a live link to drop into every application' },
];

function usePersonaCycle(interval = 2800) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const advance = useCallback(() => setIdx(i => (i + 1) % PERSONAS.length), []);
  const selectIdx = useCallback((i) => { setIdx(i); setResetKey(k => k + 1); }, []);
  useEffect(() => {
    if (paused) return;
    const iv = setInterval(advance, interval);
    return () => clearInterval(iv);
  }, [advance, interval, paused, resetKey]);
  return { persona: PERSONAS[idx], idx, selectIdx, setPaused };
}

function useScrollPast(thresholdPx = 600) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const handler = () => setPast(window.scrollY > thresholdPx);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [thresholdPx]);
  return past;
}

const GrainOverlay = memo(function GrainOverlay() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
    const d = ctx.createImageData(W, H);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255;
      d.data[i] = d.data[i+1] = d.data[i+2] = v; d.data[i+3] = 7;
    }
    ctx.putImageData(d, 0, 0);
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', mixBlendMode:'overlay', opacity:0.35 }} />;
});

function StickyCTA({ onStart }) {
  const show = useScrollPast(700);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y:-64, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-64, opacity:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
          style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px', background:'rgba(8,8,16,0.92)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, letterSpacing:'0.08em', color:'var(--ink2)' }}>OneStopCareers · Problem-Solving Simulator</span>
          <motion.button onClick={onStart} whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} aria-label="Start the investigation — free"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 22px', borderRadius:8, background:ORANGE, color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 0 20px rgba(252,128,25,0.35)' }}>
            <Zap size={14} aria-hidden="true" /> Try it free <ArrowRight size={14} aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatStrip() {
  const [tooltip, setTooltip] = useState(null);
  return (
    <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', border:'1px solid var(--border)', borderRadius:16, overflow:'visible', background:'var(--bg-card)', position:'relative' }}>
      {STATS.map((m, i) => (
        <div key={i} onMouseEnter={() => setTooltip(i)} onMouseLeave={() => setTooltip(null)} onFocus={() => setTooltip(i)} onBlur={() => setTooltip(null)}
          tabIndex={0} role="button" aria-label={`${m.val} — ${m.explainer}`}
          style={{ padding:'22px 44px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', textAlign:'center', flex:1, minWidth:120, cursor:'default', position:'relative', outline:'none' }}>
          <div style={{ fontFamily:'var(--mono)', fontSize:30, fontWeight:800, color:m.color, letterSpacing:'-0.03em', lineHeight:1 }}>{m.val}</div>
          <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink2)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:7 }}>{m.label}</div>
          <AnimatePresence>
            {tooltip === i && (
              <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }} transition={{ duration:0.18 }} role="tooltip"
                style={{ position:'absolute', bottom:'calc(100% + 10px)', left:'50%', transform:'translateX(-50%)', background:'rgba(15,16,24,0.97)', border:`1px solid ${m.color}40`, borderRadius:8, padding:'7px 12px', fontFamily:'var(--mono)', fontSize:10, color:m.color, whiteSpace:'nowrap', zIndex:10, boxShadow:'0 4px 20px rgba(0,0,0,0.6)' }}>
                {m.explainer}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function SectionPeek() {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.0 }}
      style={{ position:'absolute', bottom:0, left:0, right:0, height:96, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:16, background:'linear-gradient(to bottom, transparent 0%, rgba(8,8,16,0.7) 60%, rgba(8,8,16,0.97) 100%)', zIndex:2, pointerEvents:'none' }}>
      <motion.p animate={{ y:[4,0,4] }} transition={{ duration:2.4, repeat:Infinity, ease:'easeInOut' }}
        style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink2)', opacity:0.75 }}>
        ↓ See the gap for yourself
      </motion.p>
    </motion.div>
  );
}

function ResumeCards({ persona, personaIdx, selectIdx }) {
  const [shortlisted, setShortlisted] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHasIntersected(true); setTimeout(() => setShortlisted(true), 500); } }, { threshold:0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!hasIntersected) return;
    setShortlisted(false);
    const t = setTimeout(() => setShortlisted(true), 380);
    return () => clearTimeout(t);
  }, [personaIdx, hasIntersected]);

  return (
    <div ref={ref} style={{ padding:'0 24px 88px', maxWidth:980, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <p style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink2)', marginBottom:14 }}>The gap is real</p>
        <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 3rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--ink)', lineHeight:1.1, marginBottom:14 }}>
          Same role. Same tools. <span style={{ color:ORANGE }}>One got the callback.</span>
        </h2>
        <p style={{ fontSize:15, color:'var(--ink2)', maxWidth:520, margin:'0 auto', lineHeight:1.65 }}>
          The difference is not how much you know. It is how you think when something breaks — and whether you can explain what you found to someone who was not in the room.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(290px, 1fr))', gap:28, paddingTop:20, alignItems:'start' }}>
        {/* Card A */}
        <div style={{ position:'relative', borderRadius:20, padding:28, background:'rgba(243,139,168,0.03)', outline:'1px solid rgba(243,139,168,0.14)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ position:'absolute', top:-15, left:'50%', transform:'translateX(-50%)', zIndex:2 }}>
            <span style={{ display:'inline-block', padding:'5px 16px', borderRadius:999, fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(243,139,168,0.12)', color:RED, border:'1px solid rgba(243,139,168,0.3)', whiteSpace:'nowrap' }}>✗ No reply · 14 Days</span>
          </div>
          <div style={{ marginTop:10 }}>
            <AnimatePresence mode="wait">
              <motion.p key={`arcA-${personaIdx}`} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-5 }} transition={{ duration:0.25 }}
                style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:RED, marginBottom:6 }}>{persona.archetypeA}</motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={`roleA-${personaIdx}`} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-5 }} transition={{ duration:0.25, delay:0.04 }}
                style={{ fontSize:13, color:'var(--ink3)', fontWeight:500 }}>{persona.roleA}</motion.p>
            </AnimatePresence>
          </div>
          <div style={{ height:1, background:'rgba(243,139,168,0.1)' }} />
          <AnimatePresence mode="wait">
            <motion.ul key={`bullA-${personaIdx}`} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.28 }}
              style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14 }}>
              {persona.bulletsA.map((pt, i) => (
                <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ flexShrink:0, marginTop:2, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, background:'rgba(243,139,168,0.1)', color:RED, border:'1px solid rgba(243,139,168,0.22)' }}>✗</span>
                  <span style={{ fontSize:13, lineHeight:1.55, color:'var(--ink3)' }}>{pt}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <div style={{ height:1, background:'rgba(243,139,168,0.1)' }} />
          <p style={{ fontFamily:'var(--mono)', fontSize:10, color:RED }}>● No response · Moved to rejected folder</p>
        </div>

        {/* Card B */}
        <motion.div
          animate={shortlisted ? { y:-8, boxShadow:'0 0 48px rgba(252,128,25,0.2), 0 0 0 1px rgba(252,128,25,0.28)' } : { y:0, boxShadow:'0 0 0 0px rgba(252,128,25,0)' }}
          transition={{ duration:0.75, ease:[0.16,1,0.3,1] }}
          style={{ position:'relative', borderRadius:20, padding:28, background: shortlisted ? 'rgba(252,128,25,0.06)' : 'rgba(252,128,25,0.03)', border:`1px solid ${shortlisted ? 'rgba(252,128,25,0.30)' : 'rgba(252,128,25,0.14)'}`, backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', display:'flex', flexDirection:'column', gap:20, transition:'background 0.5s ease, border-color 0.5s ease' }}>
          <div style={{ position:'absolute', top:-15, left:'50%', transform:'translateX(-50%)', zIndex:2 }}>
            <motion.span animate={shortlisted ? { boxShadow:['0 0 18px rgba(252,128,25,0.5)','0 0 40px rgba(252,128,25,0.9)','0 0 18px rgba(252,128,25,0.5)'] } : { boxShadow:'0 0 0 rgba(252,128,25,0)' }} transition={{ duration:2, repeat:Infinity }}
              style={{ display:'inline-block', padding:'5px 16px', borderRadius:999, fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background: shortlisted ? ORANGE : 'rgba(252,128,25,0.1)', color:'#fff', border:'1px solid rgba(252,128,25,0.4)', whiteSpace:'nowrap' }}>
              {shortlisted ? '⚡ Called Back' : '○ Waiting'}
            </motion.span>
          </div>
          <div style={{ marginTop:10 }}>
            <AnimatePresence mode="wait">
              <motion.p key={`arcB-${personaIdx}`} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-5 }} transition={{ duration:0.25 }}
                style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:ORANGE, marginBottom:6 }}>{persona.archetypeB}</motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={`roleB-${personaIdx}`} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-5 }} transition={{ duration:0.25, delay:0.04 }}
                style={{ fontSize:13, color: shortlisted ? 'var(--ink)' : 'var(--ink2)', fontWeight:500 }}>{persona.roleB}</motion.p>
            </AnimatePresence>
          </div>
          <div style={{ height:1, background:'rgba(252,128,25,0.1)' }} />
          <AnimatePresence mode="wait">
            <motion.ul key={`bullB-${personaIdx}`} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.28 }}
              style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14 }}>
              {persona.bulletsB.map((pt, i) => (
                <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ flexShrink:0, marginTop:2, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, background:'rgba(252,128,25,0.12)', color:ORANGE, border:'1px solid rgba(252,128,25,0.25)' }}>✓</span>
                  <span style={{ fontSize:13, lineHeight:1.55, color:'var(--ink2)' }}>{pt}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <div style={{ height:1, background:'rgba(252,128,25,0.1)' }} />
          <p style={{ fontFamily:'var(--mono)', fontSize:10, color: shortlisted ? ORANGE : 'var(--ink2)' }}>
            {shortlisted ? persona.footerB : '○ Awaiting response'}
          </p>
        </motion.div>
      </div>

      <div role="tablist" aria-label="Select role to preview" style={{ display:'flex', justifyContent:'center', gap:7, marginTop:28 }}>
        {PERSONAS.map((p, i) => (
          <div key={i} role="tab" aria-selected={i === personaIdx} aria-label={`Show ${p.pill}`} tabIndex={0}
            onClick={() => selectIdx(i)} onKeyDown={e => e.key === 'Enter' && selectIdx(i)}
            style={{ width: i === personaIdx ? 22 : 6, height:6, borderRadius:999, background: i === personaIdx ? ORANGE : 'rgba(255,255,255,0.15)', transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)', cursor:'pointer' }} />
        ))}
      </div>
      <p style={{ textAlign:'center', marginTop:10, fontFamily:'var(--mono)', fontSize:11, color:'var(--ink2)', letterSpacing:'0.06em' }}>
        Showing: <span style={{ color:ORANGE }}>{persona.pill}</span>
        <span style={{ color:'var(--ink3)', marginLeft:8 }}>· click a dot to switch</span>
      </p>
    </div>
  );
}

function PhaseCards({ onStart }) {
  return (
    <div style={{ padding:'0 24px 88px', maxWidth:980, margin:'0 auto' }}>
      <motion.div initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
        style={{ display:'flex', alignItems:'flex-start', gap:18, marginBottom:56, padding:'20px 24px', borderRadius:16, background:'rgba(79,128,255,0.05)', border:'1px solid rgba(79,128,255,0.15)' }}>
        <div style={{ width:48, height:48, borderRadius:13, flexShrink:0, background:'rgba(79,128,255,0.14)', border:'1px solid rgba(79,128,255,0.28)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontSize:15, fontWeight:800, color:BLUE, boxShadow:'0 0 16px rgba(79,128,255,0.18)' }}>AJ</div>
        <div>
          <p style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BLUE, marginBottom:6 }}>Arjun · Your AI thinking partner</p>
          <p style={{ fontSize:14, color:'var(--ink2)', lineHeight:1.62, maxWidth:640 }}>Arjun is a senior advisor built into the simulation. He does not give you the answer. He asks the questions a good manager would ask — and catches the gaps in your thinking before they become gaps in your interview. Think of him as the colleague who makes you look sharper in the room.</p>
        </div>
      </motion.div>

      <div style={{ textAlign:'center', marginBottom:48 }}>
        <p style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink2)', marginBottom:14 }}>How it works</p>
        <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 3rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--ink)', lineHeight:1.1, marginBottom:14 }}>
          You are the one on call. <span style={{ color:ORANGE }}>Something is broken.</span>
        </h2>
        <p style={{ fontSize:15, color:'var(--ink2)', maxWidth:500, margin:'0 auto', lineHeight:1.65 }}>
          No instructions. No tutorial mode. A real business problem and 45 minutes to figure it out — the way it actually happens inside Swiggy, Uber, and Razorpay.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20 }}>
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div key={i} initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.55, delay:i*0.11, ease:[0.16,1,0.3,1] }}
              style={{ borderRadius:20, padding:28, background:'var(--bg-card)', border:'1px solid var(--border)', backdropFilter:'blur(12px)', display:'flex', flexDirection:'column', gap:16, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${p.color}, transparent)` }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:28, fontWeight:800, color:p.color, letterSpacing:'-0.04em', lineHeight:1 }}>{p.num}</span>
                <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:`${p.color}14`, border:`1px solid ${p.color}28` }}>
                  <Icon size={17} color={p.color} aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize:17, fontWeight:700, letterSpacing:'-0.02em', color:'var(--ink)', marginBottom:5, lineHeight:1.25 }}>{p.title}</h3>
                <p style={{ fontFamily:'var(--mono)', fontSize:10, color:p.color, letterSpacing:'0.06em', textTransform:'uppercase' }}>{p.subtitle}</p>
              </div>
              <p style={{ fontSize:14, lineHeight:1.7, color:'var(--ink)', flex:1 }}>{p.body}</p>
              <div style={{ padding:'10px 14px', borderRadius:10, background:`${p.color}0A`, border:`1px solid ${p.color}1A` }}>
                <p style={{ fontFamily:'var(--mono)', fontSize:10, color:p.color, letterSpacing:'0.04em' }}>→ {p.outcome}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ textAlign:'center', marginTop:52 }}>
        <motion.button onClick={onStart} whileHover={{ scale:1.03, y:-3 }} whileTap={{ scale:0.97 }} transition={{ type:'spring', stiffness:400, damping:20 }} aria-label="Start the investigation — free, no account needed"
          style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 42px', borderRadius:14, background:ORANGE, color:'#fff', fontWeight:800, fontSize:16, letterSpacing:'-0.01em', border:'none', cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.15)' }}>
          Try it free — takes 45 minutes <ArrowRight size={18} aria-hidden="true" />
        </motion.button>
        <p style={{ marginTop:14, fontFamily:'var(--mono)', fontSize:11, color:'var(--ink2)', letterSpacing:'0.04em' }}>No account needed · You get a shareable link at the end</p>
      </div>
    </div>
  );
}

function Testimonials({ onStart }) {
  return (
    <div style={{ padding:'0 24px 96px', maxWidth:980, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <p style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink2)', marginBottom:14 }}>In their own words</p>
        <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 3rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--ink)', lineHeight:1.1, marginBottom:14 }}>
          What they built <span style={{ color:ORANGE }}>in 45 minutes.</span>
        </h2>
        <p style={{ fontSize:15, color:'var(--ink2)', maxWidth:460, margin:'0 auto', lineHeight:1.65 }}>From people who showed up with the same doubts you probably have right now.</p>
      </div>

      <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        style={{ marginBottom:32, padding:'36px 40px', borderRadius:20, background:'rgba(252,128,25,0.05)', border:'1px solid rgba(252,128,25,0.18)', borderLeft:`4px solid ${ORANGE}`, position:'relative' }}>
        <p style={{ fontSize:'clamp(16px, 2.2vw, 20px)', lineHeight:1.65, color:'var(--ink)', fontStyle:'italic', marginBottom:24, maxWidth:820 }}>"{FEATURED_TESTIMONIAL.quote}"</p>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`${ORANGE}20`, border:`2px solid ${ORANGE}50`, fontFamily:'var(--mono)', fontSize:13, fontWeight:800, color:ORANGE }}>{FEATURED_TESTIMONIAL.initials}</div>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--ink)', marginBottom:2 }}>{FEATURED_TESTIMONIAL.name}<span style={{ marginLeft:10, fontSize:11, fontWeight:500, color:ORANGE, fontFamily:'var(--mono)', letterSpacing:'0.06em' }}>{FEATURED_TESTIMONIAL.company}</span></p>
            <p style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink2)', letterSpacing:'0.04em' }}>{FEATURED_TESTIMONIAL.role}<span style={{ marginLeft:12, color:'var(--ink3)' }}>· {FEATURED_TESTIMONIAL.when}</span></p>
          </div>
        </div>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16 }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-20px' }} transition={{ duration:0.5, delay:(i%2)*0.08, ease:[0.16,1,0.3,1] }}
            style={{ borderRadius:16, padding:'22px 22px 18px', background:'var(--bg-raised)', border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:14 }}>
            <p style={{ fontSize:14, lineHeight:1.68, color:'var(--ink)', fontStyle:'italic', flex:1 }}>"{t.quote}"</p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`${t.color}18`, border:`1.5px solid ${t.color}40`, fontFamily:'var(--mono)', fontSize:10, fontWeight:800, color:t.color }}>{t.initials}</div>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--ink)', marginBottom:1 }}>{t.name}<span style={{ marginLeft:8, fontSize:11, fontWeight:500, color:t.color, fontFamily:'var(--mono)' }}>{t.company}</span></p>
                <p style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink2)', letterSpacing:'0.04em' }}>{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        style={{ marginTop:64, textAlign:'center', padding:'clamp(40px,6vw,64px) clamp(24px,5vw,56px)', borderRadius:24, background:'rgba(252,128,25,0.04)', border:'1px solid rgba(252,128,25,0.14)', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:500, height:260, background:'radial-gradient(circle, rgba(252,128,25,0.10) 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ position:'relative' }}>
          <p style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:ORANGE, marginBottom:18 }}>⚡ Free · No account · No credit card</p>
          <h2 style={{ fontSize:'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--ink)', lineHeight:1.1, marginBottom:14 }}>
            You did the work. <span style={{ color:ORANGE }}>Here is the link that proves it.</span>
          </h2>
          <p style={{ fontSize:15, color:'var(--ink2)', maxWidth:400, margin:'0 auto 12px', lineHeight:1.7 }}>One afternoon. A shareable link that shows how you think through a real problem. Most people never build this — even after years on the job.</p>
          <p style={{ fontSize:13, color:'var(--ink3)', maxWidth:380, margin:'0 auto 32px', lineHeight:1.6, fontStyle:'italic' }}>No data skills needed. If you've had to explain a business problem to someone senior, you're ready.</p>
          <motion.button onClick={onStart} whileHover={{ scale:1.03, y:-3 }} whileTap={{ scale:0.97 }} transition={{ type:'spring', stiffness:400, damping:20 }} aria-label="Start the investigation — free"
            style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 40px', borderRadius:12, background:ORANGE, color:'#fff', fontWeight:800, fontSize:16, letterSpacing:'-0.01em', border:'none', cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.45), 0 0 80px rgba(252,128,25,0.18)' }}>
            Start the investigation <ArrowRight size={18} aria-hidden="true" />
          </motion.button>
          <p style={{ marginTop:14, fontFamily:'var(--mono)', fontSize:11, color:'var(--ink2)', letterSpacing:'0.04em' }}>Free · ~45 minutes · Shareable link at the end</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function StrategyHero({ onStartSimulator }) {
  const navigate = useNavigate();
  const handleStart = useCallback(() => {
    if (onStartSimulator) { onStartSimulator(); } else { navigate('/strategy/swiggy'); }
  }, [onStartSimulator, navigate]);
  const shouldReduceMotion = useReducedMotion();
  const { persona, idx: personaIdx, selectIdx } = usePersonaCycle(2800);

  const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.09 } } };
  const fadeUp  = { hidden:{ opacity:0, y:28 }, show:{ opacity:1, y:0, transition:{ duration:0.7, ease:[0.16,1,0.3,1] } } };

  const orbAnim  = shouldReduceMotion ? {} : { animate:{ scale:[1,1.09,1], opacity:[0.8,1,0.8] }, transition:{ duration:7, repeat:Infinity, ease:'easeInOut', delay:1.5 } };
  const orbAnim2 = shouldReduceMotion ? {} : { animate:{ scale:[1,1.11,1], opacity:[0.7,1,0.7] }, transition:{ duration:9, repeat:Infinity, ease:'easeInOut', delay:3 } };

  return (
    <div style={{ background:'var(--bg)', fontFamily:'var(--sans)', minHeight:'100vh', overflowX:'hidden' }}>
      <StickyCTA onStart={handleStart} />

      <section style={{ position:'relative', minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(80px,12vw,140px) 24px clamp(140px,16vw,180px)', overflow:'hidden' }}>
        <GrainOverlay />
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize:'20px 20px' }} />
        <motion.div style={{ position:'absolute', top:-200, left:-200, width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(252,128,25,0.20) 0%, transparent 68%)', filter:'blur(100px)', pointerEvents:'none' }} {...orbAnim} />
        <motion.div style={{ position:'absolute', bottom:-200, right:-200, width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(30,79,204,0.26) 0%, transparent 68%)', filter:'blur(100px)', pointerEvents:'none' }} {...orbAnim2} />

        <motion.div variants={stagger} initial="hidden" animate="show" style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:920 }}>
          <motion.div variants={fadeUp} style={{ marginBottom:40 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'12px 28px', borderRadius:999, background:'rgba(79,128,255,0.09)', border:'1px solid rgba(79,128,255,0.26)', boxShadow:'0 0 32px rgba(79,128,255,0.08)', flexWrap:'wrap', justifyContent:'center', maxWidth:'90vw' }}>
              <span style={{ width:9, height:9, borderRadius:'50%', background:BLUE, flexShrink:0, boxShadow:`0 0 10px ${BLUE}`, animation: shouldReduceMotion ? 'none' : 'hero-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:600, letterSpacing:'0.08em', color:'rgba(255,255,255,0.5)' }}>For</span>
              <span aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  <motion.span key={personaIdx} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.22 }}
                    style={{ fontFamily:'var(--mono)', fontSize:14, fontWeight:800, letterSpacing:'0.05em', textTransform:'uppercase', color:ORANGE }}>{persona.pill}</motion.span>
                </AnimatePresence>
              </span>
              <span style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:600, letterSpacing:'0.08em', color:'rgba(255,255,255,0.5)' }}>who work with data</span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{ fontSize:'clamp(2.5rem, 7.5vw, 5.4rem)', fontWeight:800, lineHeight:1.03, letterSpacing:'-0.04em', color:'var(--ink)', marginBottom:28 }}>
            The AI will pull the data.
            <br />
            <span style={{ background:`linear-gradient(135deg, ${ORANGE} 0%, #FF9E50 40%, ${BLUE} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Can you make the decision?
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize:'clamp(15px, 2vw, 18px)', lineHeight:1.72, color:'var(--ink2)', maxWidth:640, margin:'0 auto 44px' }}>
            AI handles the data pulls. The people who get hired — and promoted — are the ones who know{' '}
            <strong style={{ color:'var(--ink)' }}>how to think through a problem clearly.</strong>{' '}
            Work through a real business incident alongside an AI thinking partner and leave with{' '}
            <strong style={{ color:'var(--ink)' }}>proof of how you think — as a link you can share.</strong>
          </motion.p>

          <motion.div variants={fadeUp} style={{ marginBottom:36 }}><StatStrip /></motion.div>

          <motion.div variants={fadeUp} style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <motion.button onClick={handleStart} whileHover={{ scale:1.03, y:-3 }} whileTap={{ scale:0.97 }} transition={{ type:'spring', stiffness:400, damping:20 }} aria-label="Start the investigation — free"
              style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 36px', borderRadius:12, background:ORANGE, color:'#fff', fontWeight:800, fontSize:16, letterSpacing:'-0.01em', border:'none', cursor:'pointer', fontFamily:'var(--sans)', boxShadow:`0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.18)` }}>
              <Zap size={17} aria-hidden="true" /> Try it free <ArrowRight size={17} aria-hidden="true" />
            </motion.button>
            <a href="/case-studies" style={{ fontSize:14, color:'var(--ink2)', textDecoration:'underline', textUnderlineOffset:3, fontFamily:'var(--sans)', transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink2)'}>
              Browse all cases
            </a>
          </motion.div>

          <motion.p variants={fadeUp} style={{ marginTop:18, fontFamily:'var(--mono)', fontSize:11, color:'var(--ink2)', letterSpacing:'0.04em' }}>
            Free · No account needed · You keep the link at the end · ~45 minutes
          </motion.p>
        </motion.div>

        <SectionPeek />
      </section>

      <div style={{ height:1, background:'linear-gradient(90deg, transparent, var(--border-strong), transparent)', margin:'0 24px' }} />
      <div style={{ paddingTop:88 }}><ResumeCards persona={persona} personaIdx={personaIdx} selectIdx={selectIdx} /></div>

      <div style={{ height:1, background:'linear-gradient(90deg, transparent, var(--border-strong), transparent)', margin:'0 24px' }} />
      <div style={{ paddingTop:88 }}><PhaseCards onStart={handleStart} /></div>

      <div style={{ height:1, background:'linear-gradient(90deg, transparent, var(--border-strong), transparent)', margin:'0 24px' }} />
      <div style={{ paddingTop:88 }}><Testimonials onStart={handleStart} /></div>

      {/* ── FounderStrip — between Testimonials and end ── */}
      <div style={{ height:1, background:'linear-gradient(90deg, transparent, var(--border-strong), transparent)', margin:'0 24px' }} />
      <FounderStrip />

      <style>{`
        @keyframes hero-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.6); } }
        @media (max-width: 640px) { section { padding-left:16px !important; padding-right:16px !important; } }
      `}</style>
    </div>
  );
}