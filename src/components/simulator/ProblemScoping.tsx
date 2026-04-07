'use client';

import { useEffect, useRef, useState } from 'react';
import type { CaseConfig } from '@/types';

interface Props {
  caseConfig: CaseConfig;
  onComplete: () => void;
}

type Step = 'intro' | 'pillars' | 'definitions' | 'chart' | 'verdict' | 'seasonality';

const MONO = "'Geist Mono', 'SF Mono', monospace";

const WEEKS = [
  { w: 'W1',  bookings: 820, dau: 10.0, ratio: 8.20 },
  { w: 'W2',  bookings: 818, dau: 10.1, ratio: 8.10 },
  { w: 'W3',  bookings: 822, dau: 10.2, ratio: 8.06 },
  { w: 'W4',  bookings: 819, dau: 10.3, ratio: 7.95 },
  { w: 'W5',  bookings: 821, dau: 10.8, ratio: 7.60 },
  { w: 'W6',  bookings: 820, dau: 11.0, ratio: 7.45 },
  { w: 'W7',  bookings: 818, dau: 11.1, ratio: 7.37 },
  { w: 'W8',  bookings: 822, dau: 11.2, ratio: 7.34 },
  { w: 'W9',  bookings: 819, dau: 11.3, ratio: 7.25 },
  { w: 'W10', bookings: 821, dau: 11.4, ratio: 7.20 },
  { w: 'W11', bookings: 820, dau: 11.4, ratio: 7.19 },
  { w: 'W12', bookings: 819, dau: 11.5, ratio: 7.12 },
];

const SEASONAL = [
  { m: 'Jan', y2024: 7.8, y2025: 8.2 },
  { m: 'Feb', y2024: 7.6, y2025: 8.1 },
  { m: 'Mar', y2024: 8.1, y2025: 8.0 },
  { m: 'Apr', y2024: 8.4, y2025: 7.9 },
  { m: 'May', y2024: 8.2, y2025: 7.8 },
  { m: 'Jun', y2024: 7.9, y2025: 7.7 },
  { m: 'Jul', y2024: 7.5, y2025: 7.6 },
  { m: 'Aug', y2024: 7.3, y2025: 7.5 },
  { m: 'Sep', y2024: 7.6, y2025: 7.4 },
  { m: 'Oct', y2024: 7.9, y2025: 7.2 },
  { m: 'Nov', y2024: 8.1, y2025: 7.1 },
  { m: 'Dec', y2024: 8.3, y2025: null },
];

function mapY(val: number, min: number, max: number, h: number) {
  return h - ((val - min) / (max - min)) * h;
}

function polyline(points: { x: number; y: number }[]) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

export function ProblemScoping({ caseConfig, onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [userAnswer, setUserAnswer] = useState('');
  const [seasonAnswer, setSeasonAnswer] = useState('');
  const [verdict, setVerdict] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: typeof WEEKS[0] } | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [shown, setShown] = useState<Set<Step>>(new Set(['intro']));
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 860, H = 300, PL = 55, PR = 45, PT = 20, PB = 40;
  const iW = W - PL - PR, iH = H - PT - PB;
  const n = WEEKS.length;
  const bMin = 815, bMax = 825, dMin = 9.5, dMax = 12, rMin = 6.8, rMax = 8.6;

  const bPts = WEEKS.map((d,i) => ({ x: PL+(i/(n-1))*iW, y: PT+mapY(d.bookings,bMin,bMax,iH) }));
  const dPts = WEEKS.map((d,i) => ({ x: PL+(i/(n-1))*iW, y: PT+mapY(d.dau,dMin,dMax,iH) }));
  const rPts = WEEKS.map((d,i) => ({ x: PL+(i/(n-1))*iW, y: PT+mapY(d.ratio,rMin,rMax,iH) }));

  const SW=800, SH=220, SPL=50, SPR=20, SPT=20, SPB=40;
  const sIW=SW-SPL-SPR, sIH=SH-SPT-SPB, sMin=6.5, sMax=9.0, sN=SEASONAL.length;
  const s24 = SEASONAL.map((d,i) => ({ x: SPL+(i/(sN-1))*sIW, y: SPT+mapY(d.y2024,sMin,sMax,sIH) }));
  const s25 = SEASONAL.filter(d=>d.y2025!==null).map((d,i) => ({ x: SPL+(i/(sN-1))*sIW, y: SPT+mapY(d.y2025 as number,sMin,sMax,sIH) }));

  function reveal(next: Step) {
    setStep(next);
    setShown(prev => new Set([...prev, next]));
    setTimeout(() => {
      document.getElementById(`s-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  function sStyle(s: Step): React.CSSProperties {
    return {
      opacity: shown.has(s) ? 1 : 0,
      transform: shown.has(s) ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
      marginBottom: '80px',
    };
  }

  function handleMouse(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(n-1, Math.round(((sx-PL)/iW)*(n-1))));
    setHoveredWeek(idx);
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, data: WEEKS[idx] });
  }

  async function evaluate() {
    if (!userAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `You are Arjun, Staff Product Analyst at MakeMyTrip, mentoring an analyst.

Chart shown: 12 weeks. Bookings FLAT at ~820K/week. DAU grew 10M→11.5M (+15%). Bookings/DAU ratio dropped 8.2%→7.1% gradually.

You asked: "Is this a pipeline bug or real behavioral shift? How can you tell from the absolute values?"

Analyst answered: "${userAnswer}"

Respond in 2-3 sentences as Arjun. Be specific and Socratic.
- If they identified stable absolutes + gradual decay = real shift: affirm and explain why this matters for the investigation.
- If they missed it: correct kindly — a bug leaves jagged spikes in absolutes; gradual smooth decay is behavioral.
End with: "Now one final check before we begin..."
No preamble. Speak directly as Arjun.`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? "Good instinct. The absolute bookings are stable at 820K — a pipeline bug would cause sudden jagged drops. This gradual decay over 12 weeks is a real behavioral shift. Now one final check before we begin...";
      setVerdict(text);
    } catch {
      setVerdict("The key signal is stability in the absolutes. Bookings held flat at 820K throughout — a data pipeline failure would have caused sudden unexplained drops or spikes. This smooth, gradual ratio decay is a real behavioral shift in how users are converting. Now one final check before we begin...");
    } finally {
      setIsEvaluating(false);
      reveal('verdict');
    }
  }

  const glass: React.CSSProperties = {
    background: 'rgba(18,18,28,0.85)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  };
  const btn: React.CSSProperties = {
    width: '100%', padding: '18px 32px',
    background: '#F8FAFC', color: '#020203',
    fontWeight: 800, fontSize: '10px',
    letterSpacing: '0.2em', textTransform: 'uppercase',
    border: 'none', borderRadius: '14px', cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Geist', sans-serif",
  };
  const btnSec: React.CSSProperties = {
    width: '100%', padding: '16px 32px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#F8FAFC', fontWeight: 700, fontSize: '10px',
    letterSpacing: '0.2em', textTransform: 'uppercase',
    borderRadius: '14px', cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Geist', sans-serif",
  };
  const lbl: React.CSSProperties = {
    fontSize: '9px', fontWeight: 800,
    letterSpacing: '0.25em', textTransform: 'uppercase',
    fontFamily: MONO,
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#020203', color: '#F8FAFC',
      fontFamily: "'Geist', -apple-system, sans-serif",
      backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(76,127,255,0.04) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(62,207,142,0.04) 0%, transparent 40%)',
      paddingBottom: '160px',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse2 { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        @keyframes fsu { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        .s1{animation:fsu 0.6s 0.1s both;} .s2{animation:fsu 0.6s 0.2s both;} .s3{animation:fsu 0.6s 0.3s both;}
        .pbtn:hover{transform:translateY(-2px);box-shadow:0 20px 50px rgba(255,255,255,0.15)!important;}
        .sbtn:hover{background:rgba(255,255,255,0.07)!important;border-color:rgba(255,255,255,0.15)!important;}
        .hbtn:hover{background:rgba(255,255,255,0.05)!important;color:#94A3B8!important;}
        .pc:hover{background:rgba(255,255,255,0.04)!important;transform:translateY(-2px);}
        textarea:focus{border-color:rgba(76,127,255,0.4)!important;box-shadow:0 0 0 3px rgba(76,127,255,0.1)!important;outline:none;}
      `}</style>

      {/* NAV */}
      <nav style={{
        position:'fixed',top:0,width:'100%',zIndex:50,
        background:'rgba(2,2,3,0.92)',backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
        padding:'14px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
          <div style={{
            width:'40px',height:'40px',borderRadius:'12px',
            background:'linear-gradient(135deg,#1e293b,#0f172a)',
            border:'1.5px solid rgba(255,255,255,0.1)',
            display:'flex',alignItems:'center',justifyContent:'center',position:'relative',
          }}>
            <span style={{fontSize:'14px',fontWeight:900,color:'#fff'}}>A</span>
            <div style={{position:'absolute',bottom:'-2px',right:'-2px',width:'9px',height:'9px',borderRadius:'50%',background:'#3ECF8E',border:'2px solid #020203',animation:'pulse2 2s infinite'}} />
          </div>
          <div>
            <p style={{fontSize:'11px',fontWeight:800,letterSpacing:'0.12em',textTransform:'uppercase',color:'#fff'}}>Problem Scoping</p>
            <p style={{fontSize:'9px',fontWeight:700,color:'#475569',fontFamily:MONO}}>Mentor: Arjun · {caseConfig.company}</p>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'5px 12px',background:'rgba(62,207,142,0.08)',border:'1px solid rgba(62,207,142,0.15)',borderRadius:'20px'}}>
            <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#3ECF8E',animation:'pulse2 2s infinite'}} />
            <span style={{...lbl,color:'#3ECF8E',fontSize:'8px'}}>Milestone 1 of 7</span>
          </div>
          <span style={{...lbl,color:'#475569',fontSize:'8px'}}>{caseConfig.company}</span>
        </div>
      </nav>

      <main style={{maxWidth:'840px',margin:'0 auto',padding:'110px 40px 0'}}>

        {/* STEP 1 — INTRO */}
        <section id="s-intro" style={sStyle('intro')}>
          <div style={{display:'flex',gap:'36px',alignItems:'flex-start'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'20px',flexShrink:0,background:'linear-gradient(135deg,#1e293b,#0f172a)',border:'1.5px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 20px 40px rgba(0,0,0,0.4)'}}>
              <span style={{fontSize:'22px',fontWeight:900,color:'#fff'}}>A</span>
            </div>
            <div style={{flex:1}}>
              <h2 style={{fontSize:'34px',fontWeight:900,letterSpacing:'-0.03em',fontStyle:'italic',color:'#fff',marginBottom:'24px',textDecoration:'underline',textDecorationColor:'#4C7FFF',textUnderlineOffset:'8px',textDecorationThickness:'3px'}}>
                &ldquo;Before we touch the data.&rdquo;
              </h2>
              <div style={{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'28px'}}>
                <p style={{fontSize:'17px',color:'#94A3B8',lineHeight:1.7,fontWeight:300}}>
                  I have investigated dozens of metric drops at MakeMyTrip. The analysts who waste two weeks chasing the wrong cause all make the same mistake.
                </p>
                <div style={{...glass,borderLeft:'4px solid #4C7FFF',borderRadius:'0 16px 16px 0',padding:'24px 28px'}}>
                  <p style={{fontSize:'16px',color:'#EFF6FF',lineHeight:1.8,fontStyle:'italic'}}>
                    &ldquo;They dive into solutions before clarifying the problem. Every senior analyst I respect asks three questions first: <strong style={{color:'#fff',fontStyle:'normal'}}>What exactly are we measuring? Is the data real? Is this seasonal?</strong> These three questions eliminate 80% of wrong hypotheses before you run a single query.&rdquo;
                  </p>
                </div>
                <p style={{fontSize:'15px',color:'#94A3B8',lineHeight:1.7,fontWeight:300}}>
                  This is the <strong style={{color:'#fff',fontWeight:600}}>Truth Protocol</strong> — the scoping framework we use before every investigation. You answer. I push back.
                </p>
              </div>
              <button className="pbtn" onClick={() => reveal('pillars')} style={btn}>Initialize Briefing →</button>
            </div>
          </div>
        </section>

        {/* STEP 2 — PILLARS */}
        {shown.has('pillars') && (
          <section id="s-pillars" style={sStyle('pillars')}>
            <div style={{textAlign:'center',marginBottom:'40px'}}>
              <p style={{...lbl,color:'#475569',marginBottom:'10px'}}>Strategic Framework</p>
              <h3 style={{fontSize:'48px',fontWeight:900,letterSpacing:'-0.04em',fontStyle:'italic',color:'#fff'}}>Truth Protocol</h3>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px',marginBottom:'32px'}}>
              {[
                {n:'01',label:'Definitions',sub:'What exactly are we measuring?',color:'#FF7A2F',on:true},
                {n:'02',label:'Absolutes vs Ratios',sub:'Is the drop real or a denominator effect?',color:'#8B5CF6',on:true},
                {n:'03',label:'Seasonality',sub:'Is this a regular yearly pattern?',color:'#3ECF8E',on:false},
              ].map((p,i) => (
                <div key={i} className={`pc s${i+1}`} style={{...glass,padding:'28px',display:'flex',flexDirection:'column',gap:'14px',opacity:p.on?1:0.3,transition:'all 0.3s ease'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`${p.color}18`,border:`1px solid ${p.color}30`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{...lbl,color:p.color,fontSize:'9px'}}>{p.n}</span>
                  </div>
                  <div>
                    <p style={{fontSize:'13px',fontWeight:700,color:'#fff',marginBottom:'5px'}}>{p.label}</p>
                    <p style={{fontSize:'11px',color:'#475569',lineHeight:1.5}}>{p.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="sbtn" onClick={() => reveal('definitions')} style={btnSec}>Step 1: Metric Definitions →</button>
          </section>
        )}

        {/* STEP 3 — DEFINITIONS */}
        {shown.has('definitions') && (
          <section id="s-definitions" style={sStyle('definitions')}>
            <div style={{...glass,padding:'48px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:'-120px',right:'-120px',width:'400px',height:'400px',background:'rgba(76,127,255,0.06)',filter:'blur(100px)',borderRadius:'50%',pointerEvents:'none'}} />
              <h3 style={{fontSize:'28px',fontWeight:900,fontStyle:'italic',textDecoration:'underline',textDecorationColor:'#4C7FFF',textUnderlineOffset:'8px',textDecorationThickness:'3px',marginBottom:'40px',color:'#fff'}}>
                The Definition Guardrails
              </h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'40px'}}>
                {[
                  {label:'Booking Truth',color:'#FF7A2F',q:'At MMT, a booking can be Gross, Net, or Paid. Which one are we tracking?',a:'We use Gross Completed Payments.',r:'Net bookings fluctuate with cancellations — they measure operations, not demand. Gross isolates Purchase Intent at checkout.',hi:'Purchase Intent'},
                  {label:'DAU Logic',color:'#8B5CF6',q:'DAU can include anonymous visitors, bots, or logged-in users. Who counts?',a:'We count Logged-in Unique Users only.',r:'Anonymous traffic includes bots and users who never intended to book. Logged-in means we measure Qualified Demand — users who showed intent by signing in.',hi:'Qualified Demand'},
                ].map((d,i) => (
                  <div key={i} className={`s${i+1}`} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <h4 style={{...lbl,color:d.color,display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={{width:'7px',height:'7px',borderRadius:'50%',background:d.color,boxShadow:`0 0 8px ${d.color}`,display:'inline-block'}} />
                      {d.label}
                    </h4>
                    <p style={{fontSize:'14px',color:'#94A3B8',lineHeight:1.7}}>{d.q}</p>
                    <div style={{background:'rgba(0,0,0,0.5)',borderRadius:'18px',border:'1px solid rgba(255,255,255,0.05)',padding:'24px',display:'flex',flexDirection:'column',gap:'12px'}}>
                      <p style={{fontSize:'14px',color:'#fff',fontWeight:700,fontStyle:'italic'}}>&ldquo;{d.a}&rdquo;</p>
                      <div style={{height:'1px',background:'rgba(255,255,255,0.05)'}} />
                      <p style={{...lbl,color:'#334155',fontSize:'8px',marginBottom:'4px'}}>Strategic Reasoning</p>
                      <p style={{fontSize:'11px',color:'#64748B',lineHeight:1.7}}>
                        {d.r.split(d.hi).map((part,j,arr) => j<arr.length-1
                          ? <span key={j}>{part}<span style={{color:'#fff',textDecoration:'underline',textDecorationStyle:'dotted',textUnderlineOffset:'3px'}}>{d.hi}</span></span>
                          : <span key={j}>{part}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginTop:'20px'}}>
              <button className="pbtn" onClick={() => reveal('chart')} style={btn}>Step 2: Initialize Trend Audit →</button>
            </div>
          </section>
        )}

        {/* STEP 4 — CHART */}
        {shown.has('chart') && (
          <section id="s-chart" style={sStyle('chart')}>
            <div style={{textAlign:'center',marginBottom:'40px'}}>
              <p style={{...lbl,color:'#475569',marginBottom:'10px',fontFamily:MONO}}>Protocol_02 // Trend Audit</p>
              <h3 style={{fontSize:'40px',fontWeight:900,letterSpacing:'-0.03em',fontStyle:'italic',color:'#fff',marginBottom:'10px'}}>12-Week Performance Scan</h3>
              <p style={{fontSize:'15px',color:'#94A3B8',fontStyle:'italic'}}>&ldquo;Is this a pipeline bug or a real behavioral shift?&rdquo;</p>
            </div>

            <div style={{...glass,padding:'36px',marginBottom:'28px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'28px'}}>
                <div>
                  <p style={{...lbl,color:'#334155',fontFamily:MONO,marginBottom:'4px'}}>MakeMyTrip · W1–W12</p>
                  <h5 style={{fontSize:'18px',fontWeight:700,fontStyle:'italic',color:'#fff'}}>Traffic Surge vs Efficiency Decay</h5>
                </div>
                <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
                  {[
                    {color:'#4C7FFF',label:'Bookings',dash:false},
                    {color:'#8B5CF6',label:'DAU',dash:true},
                    {color:'#FF7A2F',label:'Ratio',dash:false,thick:true},
                  ].map(l => (
                    <div key={l.label} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                      <svg width="20" height="10">
                        <line x1="0" y1="5" x2="20" y2="5" stroke={l.color} strokeWidth={l.thick?3.5:2} strokeDasharray={l.dash?'5,3':'none'} opacity={l.dash?0.7:1} />
                      </svg>
                      <span style={{...lbl,color:'#475569',fontSize:'8px'}}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{position:'relative',height:`${H}px`}}>
                <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible',cursor:'crosshair'}}
                  onMouseMove={handleMouse} onMouseLeave={() => {setTooltip(null);setHoveredWeek(null);}}>

                  {[0,0.25,0.5,0.75,1].map((t,i) => <line key={i} x1={PL} y1={PT+t*iH} x2={PL+iW} y2={PT+t*iH} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}

                  <rect x={bPts[4].x} y={PT} width={bPts[11].x-bPts[4].x} height={iH} fill="rgba(255,122,47,0.025)" />
                  <line x1={bPts[4].x} y1={PT} x2={bPts[4].x} y2={PT+iH} stroke="rgba(255,122,47,0.2)" strokeWidth="1.5" strokeDasharray="5,4" />
                  <text x={bPts[4].x+6} y={PT+13} fill="rgba(255,122,47,0.6)" fontSize="8" fontWeight="700" fontFamily={MONO}>Anomaly onset</text>

                  <line x1={PL} y1={PT} x2={PL} y2={PT+iH} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                  <line x1={PL} y1={PT+iH} x2={PL+iW} y2={PT+iH} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

                  {[820,818,815].map((v,i) => <text key={i} x={PL-6} y={PT+mapY(v,bMin,bMax,iH)} textAnchor="end" dominantBaseline="middle" fill="#334155" fontSize="8" fontFamily={MONO}>{v}K</text>)}
                  {[8.2,7.5,7.1].map((v,i) => <text key={i} x={PL+iW+6} y={PT+mapY(v,rMin,rMax,iH)} textAnchor="start" dominantBaseline="middle" fill="rgba(255,122,47,0.55)" fontSize="8" fontFamily={MONO}>{v}%</text>)}

                  {hoveredWeek!==null && <line x1={bPts[hoveredWeek].x} y1={PT} x2={bPts[hoveredWeek].x} y2={PT+iH} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4,4" />}

                  <path d={polyline(dPts)} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="5,4" opacity="0.6" strokeLinecap="round" />
                  <path d={polyline(bPts)} fill="none" stroke="#4C7FFF" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={polyline(rPts)} fill="none" stroke="#FF7A2F" strokeWidth="4" strokeLinecap="round" style={{filter:'drop-shadow(0 0 8px rgba(255,122,47,0.45))'}} />

                  {rPts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r={hoveredWeek===i?7:4} fill={hoveredWeek===i?'#fff':'#020203'} stroke="#FF7A2F" strokeWidth="2.5" style={{transition:'all 0.15s ease'}} />)}
                  {bPts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r={hoveredWeek===i?5:3} fill={hoveredWeek===i?'#fff':'#020203'} stroke="#4C7FFF" strokeWidth="2" style={{transition:'all 0.15s ease'}} />)}

                  {WEEKS.map((d,i) => i%2===0 && <text key={i} x={bPts[i].x} y={PT+iH+22} textAnchor="middle" fill={i>=4?'rgba(255,122,47,0.55)':'#334155'} fontSize="8" fontFamily={MONO}>{d.w}</text>)}

                  <text x={rPts[0].x+6} y={rPts[0].y-12} fill="#FF7A2F" fontSize="10" fontWeight="800" fontFamily={MONO}>8.2%</text>
                  <text x={rPts[11].x-6} y={rPts[11].y-12} textAnchor="end" fill="#FF7A2F" fontSize="10" fontWeight="800" fontFamily={MONO}>7.1%</text>

                  <rect x={PL} y={PT} width={iW} height={iH} fill="transparent" />
                </svg>

                {tooltip && (
                  <div style={{position:'absolute',left:Math.min(tooltip.x+16,W-160),top:Math.max(tooltip.y-60,0),background:'rgba(6,6,12,0.98)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'12px 16px',pointerEvents:'none',boxShadow:'0 20px 50px rgba(0,0,0,0.8)',zIndex:10}}>
                    <p style={{...lbl,color:'#475569',fontSize:'8px',fontFamily:MONO,marginBottom:'8px'}}>{tooltip.data.w}</p>
                    {[{l:'Bookings',v:`${tooltip.data.bookings}K`,c:'#4C7FFF'},{l:'DAU',v:`${tooltip.data.dau}M`,c:'#8B5CF6'},{l:'Ratio',v:`${tooltip.data.ratio}%`,c:'#FF7A2F'}].map(item => (
                      <div key={item.l} style={{display:'flex',justifyContent:'space-between',gap:'16px',marginBottom:'3px'}}>
                        <span style={{fontSize:'10px',color:item.c,fontWeight:700}}>{item.l}</span>
                        <span style={{fontSize:'10px',color:'#fff',fontFamily:MONO,fontWeight:700}}>{item.v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
                {[
                  {label:'Bookings trend',value:'Flat',sub:'~820K/week, stable',color:'#4C7FFF'},
                  {label:'DAU growth',value:'+15%',sub:'10M → 11.5M',color:'#8B5CF6'},
                  {label:'Ratio decay',value:'-13.4%',sub:'8.2% → 7.1%',color:'#FF7A2F'},
                ].map(s => (
                  <div key={s.label} style={{background:'rgba(0,0,0,0.4)',border:'1px solid rgba(255,255,255,0.04)',borderTop:`2px solid ${s.color}`,borderRadius:'12px',padding:'14px'}}>
                    <p style={{...lbl,color:'#334155',fontSize:'8px',fontFamily:MONO,marginBottom:'5px'}}>{s.label}</p>
                    <p style={{fontSize:'20px',fontWeight:800,color:s.color,fontFamily:MONO,letterSpacing:'-0.02em',marginBottom:'2px'}}>{s.value}</p>
                    <p style={{fontSize:'10px',color:'#475569'}}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{...glass,padding:'40px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'24px'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'14px',flexShrink:0,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:900,color:'#020203'}}>A</div>
                <h5 style={{fontSize:'19px',fontWeight:900,fontStyle:'italic',color:'#fff',lineHeight:1.3}}>&ldquo;Look at the absolute values. Is this a pipeline bug or a real behavioral shift?&rdquo;</h5>
              </div>

              <div style={{marginBottom:'20px'}}>
                <button className="hbtn" onClick={() => setHintVisible(!hintVisible)} style={{padding:'8px 16px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',color:'#334155',fontSize:'9px',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',borderRadius:'10px',cursor:'pointer',fontFamily:MONO,transition:'all 0.2s',marginBottom:hintVisible?'12px':'0'}}>
                  {hintVisible?'Hide hint':'Consult Arjun for a hint'}
                </button>
                {hintVisible && <p style={{fontSize:'14px',color:'#94A3B8',fontStyle:'italic',lineHeight:1.7,padding:'14px 18px',background:'rgba(76,127,255,0.05)',border:'1px solid rgba(76,127,255,0.1)',borderRadius:'12px'}}>&ldquo;Look at the absolute bookings line. Is it smooth or jagged? A pipeline bug leaves a signature — sudden unexplained drops. What do you see in the raw numbers?&rdquo;</p>}
              </div>

              <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                placeholder="State your analysis. What do the absolute values tell you?"
                rows={3} style={{width:'100%',padding:'18px 22px',background:'rgba(0,0,0,0.5)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',color:'#F8FAFC',fontSize:'15px',lineHeight:1.6,fontFamily:"'Geist',sans-serif",resize:'vertical',marginBottom:'14px',transition:'border-color 0.2s,box-shadow 0.2s',boxSizing:'border-box'}}
              />
              <button className="pbtn" onClick={evaluate} disabled={!userAnswer.trim()||isEvaluating}
                style={{...btn,opacity:!userAnswer.trim()||isEvaluating?0.4:1,cursor:!userAnswer.trim()||isEvaluating?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                {isEvaluating?<><div style={{width:'12px',height:'12px',border:'2px solid rgba(0,0,0,0.15)',borderTop:'2px solid #020203',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />Arjun is reading...</>:'Submit Verification →'}
              </button>
            </div>
          </section>
        )}

        {/* STEP 5 — VERDICT */}
        {shown.has('verdict') && verdict && (
          <section id="s-verdict" style={sStyle('verdict')}>
            <div style={{...glass,borderLeft:'4px solid #3ECF8E',borderRadius:'0 24px 24px 0',padding:'36px 44px',marginBottom:'24px'}}>
              <p style={{...lbl,color:'#3ECF8E',fontFamily:MONO,marginBottom:'14px'}}>Strategic Review // Arjun&apos;s Assessment</p>
              <div style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'12px',flexShrink:0,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:900,color:'#020203'}}>A</div>
                <p style={{fontSize:'16px',color:'#E2E8F0',lineHeight:1.8,fontStyle:'italic'}}>{verdict}</p>
              </div>
            </div>

            <div style={{...glass,padding:'40px'}}>
              <div style={{display:'flex',gap:'14px',alignItems:'flex-start',marginBottom:'20px'}}>
                <span style={{fontSize:'36px'}}>🤔</span>
                <div>
                  <h5 style={{fontSize:'19px',fontWeight:900,fontStyle:'italic',color:'#fff',marginBottom:'8px'}}>&ldquo;Final check: how do we rule out seasonality?&rdquo;</h5>
                  <p style={{fontSize:'13px',color:'#94A3B8',lineHeight:1.7}}>Travel demand naturally cycles with holidays and seasons. How do we confirm this drop is not just a regular yearly pattern?</p>
                </div>
              </div>
              <textarea value={seasonAnswer} onChange={e => setSeasonAnswer(e.target.value)}
                placeholder="How would you check for seasonality? What data would you compare?"
                rows={2} style={{width:'100%',padding:'16px 20px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',color:'#F8FAFC',fontSize:'14px',fontFamily:"'Geist',sans-serif",resize:'vertical',marginBottom:'14px',transition:'border-color 0.2s,box-shadow 0.2s',boxSizing:'border-box'}}
              />
              <button className="pbtn" onClick={() => reveal('seasonality')} disabled={!seasonAnswer.trim()}
                style={{...btn,opacity:!seasonAnswer.trim()?0.4:1,cursor:!seasonAnswer.trim()?'default':'pointer'}}>
                Initialize Seasonality Audit →
              </button>
            </div>
          </section>
        )}

        {/* STEP 6 — SEASONALITY */}
        {shown.has('seasonality') && (
          <section id="s-seasonality" style={sStyle('seasonality')}>
            <div style={{display:'flex',gap:'16px',alignItems:'center',marginBottom:'28px'}}>
              <div style={{width:'56px',height:'56px',borderRadius:'18px',flexShrink:0,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:900,color:'#020203'}}>A</div>
              <div>
                <h4 style={{fontSize:'24px',fontWeight:900,letterSpacing:'-0.02em',fontStyle:'italic',color:'#fff'}}>Temporal Proof Verified</h4>
                <p style={{...lbl,color:'#3ECF8E',fontFamily:MONO,marginTop:'4px',letterSpacing:'0.25em'}}>Protocol // Seasonality Ruled Out</p>
              </div>
            </div>

            <div style={{...glass,padding:'36px',marginBottom:'20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px'}}>
                <div>
                  <p style={{...lbl,color:'#334155',fontFamily:MONO,marginBottom:'4px'}}>YoY Comparison</p>
                  <h5 style={{fontSize:'16px',fontWeight:700,fontStyle:'italic',color:'#fff',textDecoration:'underline',textDecorationColor:'#4C7FFF',textUnderlineOffset:'5px'}}>Bookings/DAU: 2024 vs 2025</h5>
                </div>
                <div style={{display:'flex',gap:'16px'}}>
                  {[{c:'rgba(255,255,255,0.2)',l:'Prior Year 2024',d:true},{c:'#4C7FFF',l:'Current Year 2025',d:false}].map(l => (
                    <div key={l.l} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                      <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke={l.c} strokeWidth="2.5" strokeDasharray={l.d?'5,3':'none'} /></svg>
                      <span style={{...lbl,color:'#475569',fontSize:'8px'}}>{l.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <svg viewBox={`0 0 ${SW} ${SH}`} style={{width:'100%',overflow:'visible'}}>
                {[0,0.33,0.66,1].map((t,i) => <line key={i} x1={SPL} y1={SPT+t*sIH} x2={SPL+sIW} y2={SPT+t*sIH} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
                <line x1={SPL} y1={SPT+sIH} x2={SPL+sIW} y2={SPT+sIH} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

                <path d={polyline(s24)} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeDasharray="7,5" strokeLinecap="round" />
                <path d={`${polyline(s25)} L${s25[s25.length-1].x},${SPT+sIH} L${s25[0].x},${SPT+sIH} Z`} fill="rgba(76,127,255,0.05)" />
                <path d={polyline(s25)} fill="none" stroke="#4C7FFF" strokeWidth="4" strokeLinecap="round" style={{filter:'drop-shadow(0 0 6px rgba(76,127,255,0.35))'}} />

                <line x1={s25[s25.length-1].x} y1={SPT} x2={s25[s25.length-1].x} y2={SPT+sIH} stroke="rgba(255,122,47,0.25)" strokeWidth="1" strokeDasharray="4,4" />
                <text x={s25[s25.length-1].x-6} y={SPT+14} textAnchor="end" fill="rgba(255,122,47,0.7)" fontSize="9" fontWeight="800" fontFamily={MONO}>NO RECOVERY</text>

                {SEASONAL.map((d,i) => <text key={i} x={SPL+(i/(sN-1))*sIW} y={SPT+sIH+22} textAnchor="middle" fill="#334155" fontSize="9" fontFamily={MONO}>{d.m}</text>)}
                {[8.5,7.5,6.5].map((v,i) => <text key={i} x={SPL-6} y={SPT+mapY(v,sMin,sMax,sIH)} textAnchor="end" dominantBaseline="middle" fill="#334155" fontSize="9" fontFamily={MONO}>{v}%</text>)}
              </svg>

              <div style={{marginTop:'24px',padding:'20px 24px',background:'rgba(76,127,255,0.04)',border:'1px solid rgba(76,127,255,0.1)',borderRadius:'14px'}}>
                <p style={{fontSize:'14px',color:'#BFDBFE',fontStyle:'italic',lineHeight:1.8}}>&ldquo;In 2024, an October dip recovered by December — normal seasonality. In 2025, the ratio has <strong style={{color:'#fff',fontStyle:'normal'}}>stayed flat at the bottom for 60 days</strong> despite growing traffic. Confirmed: this is real, structural, and non-seasonal. Now we investigate.&rdquo;</p>
              </div>
            </div>

            <button onClick={onComplete} style={{width:'100%',padding:'20px',background:'#3ECF8E',color:'#061410',fontWeight:900,fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',border:'none',borderRadius:'16px',cursor:'pointer',boxShadow:'0 20px 60px rgba(62,207,142,0.3)',transition:'all 0.3s ease',fontFamily:"'Geist',sans-serif"}}
              onMouseEnter={e => {e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 30px 80px rgba(62,207,142,0.4)';}}
              onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 20px 60px rgba(62,207,142,0.3)';}}>
              Scoping Complete — Begin Investigation →
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
