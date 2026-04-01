// src/components/pages/CaseStudiesPage.jsx
// Sprint 6: Added HowItWorks strip above case grid

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Zap, Clock, BarChart2, Target, Brain, MessageSquare, FileText } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';
const YELLOW = '#F9E2AF';

const CASES = [
  { id:'swiggy', company:'Swiggy', slug:'/strategy/swiggy', live:true, tag:'Supply Analytics', tagColor:ORANGE, title:'The SupplyDrop Incident', description:'Orders down 8.3% WoW in North Bangalore. Priya needs answers by EOD. Diagnose a live supply-side collapse across 6 milestones — scope, KPIs, funnel, root cause, impact sizing, and VP memo.', difficulty:'Staff', diffColor:RED, roles:['Product Analyst','Data Scientist','Growth PM'], skills:['Funnel Analysis','Cohort Retention','Impact Sizing','SQL'], time:'45–60 min', mentor:'Arjun · Staff Analyst @ Swiggy', accentColor:ORANGE, industry:'Quick Commerce', badge:'LIVE' },
  { id:'zomato', company:'Zomato', slug:null, live:false, tag:'Growth Analytics', tagColor:RED, title:'The Retention Cliff', description:'D30 retention dropped 12pp after a loyalty program overhaul. Was it the program, or the cohort? Untangle correlation from causation across 50M user records.', difficulty:'Senior', diffColor:ORANGE, roles:['Data Analyst','Product Analyst','Growth PM'], skills:['Cohort Analysis','A/B Testing','Causal Inference'], time:'40–50 min', mentor:'Coming Soon', accentColor:RED, industry:'Food Delivery', badge:'SOON' },
  { id:'meesho', company:'Meesho', slug:null, live:false, tag:'Marketplace Analytics', tagColor:PURPLE, title:'Seller Supply Shock', description:'A pricing policy change caused 18% of top sellers to go inactive overnight. Model the GMV impact and build the recovery playbook before the board meeting.', difficulty:'Staff', diffColor:RED, roles:['Product Analyst','Strategy Analyst','Data Scientist'], skills:['Seller Economics','Impact Modeling','Decision Frameworks'], time:'50–65 min', mentor:'Coming Soon', accentColor:PURPLE, industry:'Social Commerce', badge:'SOON' },
  { id:'phonepe', company:'PhonePe', slug:null, live:false, tag:'Payments Analytics', tagColor:BLUE, title:'The Checkout Bleed', description:'Payment success rate dropped 3.2pp on UPI transactions in Tier 2 cities. Is it infra, UX, or the bank? Triage a payments funnel with ₹40Cr at stake.', difficulty:'Mid', diffColor:BLUE, roles:['Data Analyst','Product Analyst','PM'], skills:['Payments Funnel','RCA','Geo Segmentation'], time:'30–40 min', mentor:'Coming Soon', accentColor:BLUE, industry:'Fintech', badge:'SOON' },
  { id:'razorpay', company:'Razorpay', slug:null, live:false, tag:'B2B Analytics', tagColor:BLUE, title:'The Merchant Churn Signal', description:'Enterprise merchants are quietly downgrading their plans. You have 14 days of behavioral signals. Build a churn prediction framework before the QBR.', difficulty:'Senior', diffColor:ORANGE, roles:['Data Scientist','Product Analyst','RevOps'], skills:['Churn Modeling','Feature Engineering','SQL','Storytelling'], time:'45–55 min', mentor:'Coming Soon', accentColor:BLUE, industry:'B2B Fintech', badge:'SOON' },
  { id:'cred', company:'CRED', slug:null, live:false, tag:'Engagement Analytics', tagColor:YELLOW, title:'The Rewards Paradox', description:"CRED's power users are redeeming more rewards but spending less. The CFO thinks the program is cannibalizing revenue. Prove or disprove the hypothesis.", difficulty:'Staff', diffColor:RED, roles:['Product Analyst','Data Scientist','Strategy PM'], skills:['Engagement Modeling','LTV Analysis','Experiment Design'], time:'55–70 min', mentor:'Coming Soon', accentColor:YELLOW, industry:'Fintech / Rewards', badge:'SOON' },
];

const FILTERS = ['All', 'Mid', 'Senior', 'Staff'];

// ── How it works ──────────────────────────────────────────────────────────────
const HOW_STEPS = [
  { num: '01', color: ORANGE, Icon: Brain,          title: 'Pick a real incident.',      body: 'Every case is based on a real business failure at a real Indian company — with real data and a real causal chain.' },
  { num: '02', color: BLUE,   Icon: MessageSquare,  title: 'Think it through with Arjun.', body: 'Your AI thinking partner challenges you at every step — like a senior colleague who asks the hard questions before you present to the VP.' },
  { num: '03', color: GREEN,  Icon: FileText,        title: 'Leave with proof.',           body: 'A shareable portfolio link at /portfolio/[your-id] showing your full investigation. Send it with every application.' },
];

function HowItWorks() {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16, marginBottom: 20,
      }}>
        {HOW_STEPS.map(({ num, color, Icon, title, body }) => (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: parseInt(num) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: 20, borderRadius: 14,
              border: `1px solid ${color}20`,
              background: `${color}04`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 800,
                color, lineHeight: 1, letterSpacing: '-0.03em',
              }}>{num}</span>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}12`, border: `1px solid ${color}25`,
              }}>
                <Icon size={17} color={color} />
              </div>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{title}</p>
            <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, margin: 0 }}>{body}</p>
          </motion.div>
        ))}
      </div>
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink3)',
        textAlign: 'center', margin: 0,
      }}>
        No sign-up required. You get a shareable link at the end. The Swiggy case takes 45–60 minutes.
      </p>
    </div>
  );
}

function DiffPill({ label, color }) {
  return (
    <span style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:800, color, padding:'3px 8px', borderRadius:5, background:`${color}15`, border:`1px solid ${color}30`, textTransform:'uppercase', letterSpacing:'0.08em' }}>
      {label}
    </span>
  );
}

function SkillChip({ label }) {
  return (
    <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink3)', padding:'3px 7px', borderRadius:4, background:'var(--bg-raised)', border:'1px solid var(--border)' }}>
      {label}
    </span>
  );
}

function LiveCard({ cs, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ borderRadius:18, overflow:'hidden', cursor:'pointer', position:'relative', background:`linear-gradient(135deg, rgba(252,128,25,0.06) 0%, var(--bg) 60%)`, border:`1px solid ${hovered ? `${ORANGE}50` : `${ORANGE}25`}`, boxShadow: hovered ? `0 0 0 1px ${ORANGE}20, 0 20px 60px rgba(252,128,25,0.12)` : `0 4px 24px var(--shadow)`, transition:'all 0.25s ease', gridColumn:'span 2' }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} transition={{ duration:0.3 }} style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent 0%, ${ORANGE} 40%, ${ORANGE} 60%, transparent 100%)` }} />
      <div style={{ padding:'28px 32px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ padding:'5px 12px', borderRadius:8, background:`${ORANGE}15`, border:`1px solid ${ORANGE}30`, fontFamily:'var(--mono)', fontSize:11, fontWeight:800, color:ORANGE, letterSpacing:'0.06em' }}>{cs.company}</div>
            <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink3)', padding:'3px 8px', borderRadius:5, background:'var(--bg-raised)', border:'1px solid var(--border)' }}>{cs.industry}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <motion.div animate={{ scale:[1,1.4,1], opacity:[0.8,0.3,0.8] }} transition={{ duration:1.6, repeat:Infinity }} style={{ width:6, height:6, borderRadius:'50%', background:GREEN }} />
              <span style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:800, color:GREEN, textTransform:'uppercase', letterSpacing:'0.1em' }}>Live Now</span>
            </div>
            <DiffPill label={cs.difficulty} color={cs.diffColor} />
          </div>
        </div>
        <h2 style={{ fontSize:26, fontWeight:800, color:'var(--ink)', letterSpacing:'-0.02em', lineHeight:1.2, marginBottom:10 }}>{cs.title}</h2>
        <p style={{ fontSize:14, color:'var(--ink2)', lineHeight:1.72, marginBottom:24, maxWidth:560 }}>{cs.description}</p>
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}><Clock size={11} color="var(--ink3)" /><span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink3)' }}>{cs.time}</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}><Target size={11} color="var(--ink3)" /><span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink3)' }}>{cs.mentor}</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}><BarChart2 size={11} color="var(--ink3)" /><span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink3)' }}>{cs.tag}</span></div>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:24 }}>{cs.skills.map(s => <SkillChip key={s} label={s} />)}</div>
        <div style={{ display:'flex', gap:6, marginBottom:28, flexWrap:'wrap' }}>
          {cs.roles.map(r => <span key={r} style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:ORANGE, padding:'3px 8px', borderRadius:5, background:`${ORANGE}10`, border:`1px solid ${ORANGE}22` }}>{r}</span>)}
        </div>
        <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration:0.2 }} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:10, background:ORANGE, color:'#fff', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, boxShadow:`0 2px 16px ${ORANGE}45` }}>
          Enter War Room <ArrowRight size={14} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ComingSoonCard({ cs, index }) {
  const [hovered, setHovered] = useState(false);
  const color = cs.accentColor;
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:index*0.07, ease:[0.16,1,0.3,1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius:16, overflow:'hidden', position:'relative', background:'var(--bg-card)', border:`1px solid ${hovered ? `${color}30` : 'var(--border)'}`, boxShadow: hovered ? `0 8px 32px var(--shadow)` : 'none', transition:'all 0.22s ease', backdropFilter:'blur(12px)' }}
    >
      <div style={{ position:'absolute', inset:0, background:'var(--bg-raised)', pointerEvents:'none', zIndex:1, transition:'opacity 0.2s', opacity: hovered ? 0 : 0.5 }} />
      <div style={{ padding:'22px 24px', position:'relative', zIndex:2 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:800, color, padding:'3px 9px', borderRadius:6, background:`${color}12`, border:`1px solid ${color}25` }}>{cs.company}</span>
            <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink3)' }}>{cs.industry}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <DiffPill label={cs.difficulty} color={cs.diffColor} />
            <div style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 7px', borderRadius:4, background:'var(--bg-raised)', border:'1px solid var(--border)' }}>
              <Lock size={9} color="var(--ink3)" />
              <span style={{ fontFamily:'var(--mono)', fontSize:8, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Soon</span>
            </div>
          </div>
        </div>
        <h3 style={{ fontSize:17, fontWeight:700, color:'var(--ink)', letterSpacing:'-0.01em', lineHeight:1.3, marginBottom:8 }}>{cs.title}</h3>
        <p style={{ fontSize:13, color:'var(--ink3)', lineHeight:1.65, marginBottom:16 }}>{cs.description}</p>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>{cs.skills.map(s => <SkillChip key={s} label={s} />)}</div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={10} color="var(--ink3)" /><span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink3)' }}>{cs.time}</span></div>
          <span style={{ fontFamily:'var(--mono)', fontSize:9, color:`${color}80` }}>{cs.tag}</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatsBar() {
  const stats = [
    { value:'6', label:'Case Studies', color:ORANGE },
    { value:'Staff', label:'Hardest Level', color:RED },
    { value:'3', label:'Industries', color:BLUE },
    { value:'Free', label:'No paywall', color:GREEN },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, borderRadius:14, overflow:'hidden', border:'1px solid var(--border)', background:'var(--bg-card)', marginBottom:48 }}>
      {stats.map(({ value, label, color }, i) => (
        <div key={label} style={{ padding:'16px 20px', textAlign:'center', borderRight: i < stats.length-1 ? '1px solid var(--border)' : 'none' }}>
          <p style={{ fontFamily:'var(--mono)', fontSize:20, fontWeight:800, color, marginBottom:4 }}>{value}</p>
          <p style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudiesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const liveCase   = CASES.find(c => c.live);
  const comingSoon = CASES.filter(c => !c.live).filter(c => filter === 'All' || c.difficulty === filter);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:80 }}>
      {/* Hero section */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'64px 24px 0' }}>
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:999, background:`${ORANGE}10`, border:`1px solid ${ORANGE}25` }}>
            <Zap size={11} color={ORANGE} />
            <span style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:ORANGE, textTransform:'uppercase', letterSpacing:'0.1em' }}>Analytics War Room</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.08 }}
          style={{ fontSize:'clamp(32px, 5vw, 52px)', fontWeight:900, letterSpacing:'-0.03em', lineHeight:1.08, color:'var(--ink)', marginBottom:16 }}>
          Real incidents.<br /><span style={{ color:ORANGE }}>Real pressure.</span><br />Real growth.
        </motion.h1>

        <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.16 }}
          style={{ fontSize:16, color:'var(--ink2)', lineHeight:1.7, maxWidth:520, marginBottom:48 }}>
          Step into actual incidents from India's top product companies. Diagnose, analyse, and present — with an AI mentor who never just gives you the answer.
        </motion.p>

        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.22 }}>
          <StatsBar />
        </motion.div>
      </div>

      {/* Cards section */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>

        {/* ── How it works — above the case grid ── */}
        <HowItWorks />

        {/* Live case */}
        {liveCase && (
          <div style={{ marginBottom:48 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, color:GREEN, textTransform:'uppercase', letterSpacing:'0.1em' }}>Available Now</span>
              <div style={{ flex:1, height:1, background:'var(--border)' }} />
            </div>
            <LiveCard cs={liveCase} onClick={() => navigate(liveCase.slug)} />
          </div>
        )}

        {/* Coming soon */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Coming Soon</span>
              <div style={{ height:1, width:80, background:'var(--border)' }} />
            </div>
            <div style={{ display:'flex', gap:2, padding:3, borderRadius:8, background:'var(--bg-card)', border:'1px solid var(--border)' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding:'4px 12px', borderRadius:6, border:'none', fontFamily:'var(--mono)', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', cursor:'pointer', transition:'all 0.15s', background: filter === f ? ORANGE : 'transparent', color: filter === f ? '#fff' : 'var(--ink3)', boxShadow: filter === f ? `0 1px 8px ${ORANGE}40` : 'none' }}>{f}</button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16 }}>
              {comingSoon.map((cs, i) => <ComingSoonCard key={cs.id} cs={cs} index={i} />)}
              {comingSoon.length === 0 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ gridColumn:'1 / -1', textAlign:'center', padding:'40px 0' }}>
                  <p style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--ink3)' }}>No {filter}-level cases coming soon yet.</p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}