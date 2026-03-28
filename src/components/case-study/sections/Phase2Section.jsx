import React, { useState, useCallback, useEffect, useRef } from 'react';
import MissionBrief from '../shared/MissionBrief.jsx';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import ProduceFirst from '../shared/ProduceFirst.jsx';
import SqlWorkbench from '../shared/SqlWorkbench.jsx';
import SchemaPanel from '../shared/SchemaPanel.jsx';
import ArjunMentor from '../ArjunMentor.jsx';
import StrategicWorkbench from '../StrategicWorkbench.jsx';
import { useP2Timer } from '../hooks/useP2Timer.js';
import { useArjun } from '../hooks/useArjun.js';

const P2_STEP_IDS = ['clarify','baseline','decompose','investigate','causation','vp'];
const P2_STEP_LABELS = ['Clarify','Baseline','Decompose','Investigate','Causation','Communicate'];

const STEP_TABLES = {
  clarify: null,
  baseline: {
    tables:['prod.orders'],
    hint:"Filter: delivery_area='north_bangalore', cuisine_type='Biryani'. Compare Monday vs last Monday.",
    cols:{ 'prod.orders':['order_id','restaurant_id','delivery_area','cuisine_type','order_status','order_ts','gmv']}
  },
  decompose:{
    tables:['prod.orders','prod.restaurants','prod.restaurant_reviews'],
    hint:'JOIN orders→restaurants→reviews. Group by restaurant.',
    cols:{
      'prod.orders':['order_id','restaurant_id','delivery_area','cuisine_type','order_ts'],
      'prod.restaurants':['restaurant_id','name','delivery_area','cuisine_type','avg_rating'],
      'prod.restaurant_reviews':['review_id','restaurant_id','rating','has_complaint','review_ts']
    }
  },
  investigate:{
    tables:['prod.external_events','prod.competitor_pricing','prod.weather_events'],
    hint:"Check external events or competitor promos.",
    cols:{
      'prod.external_events':['event_id','platform','event_type','geography','discount_pct','event_date'],
      'prod.competitor_pricing':['id','competitor','cuisine_type','geography','avg_price','promo_active'],
      'prod.weather_events':['date','condition','temp_c','rainfall_mm','city']
    }
  },
  causation:null,
  vp:null
};

function InlineSchema({stepId}) {
  const ctx = STEP_TABLES[stepId];
  if(!ctx) return null;

  return(
    <div className="mb-3 bg-sql-bg border border-sql-border rounded-xl overflow-hidden">
      <div className="px-3.5 py-2 bg-sql-surface border-b border-sql-border">
        <span className="font-mono text-[9px] text-sql-comment tracking-widest uppercase">
          Available tables · prod.swiggy · BigQuery
        </span>
      </div>

      <div className="px-3.5 py-3 space-y-3">
        {Object.entries(ctx.cols).map(([table,cols])=>(
          <div key={table}>
            <p className="font-mono text-[11px] text-sql-str font-semibold mb-1">{table}</p>
            <p className="font-mono text-[10px] text-sql-comment leading-relaxed">
              {cols.join(' · ')}
            </p>
          </div>
        ))}
      </div>

      <div className="px-3.5 py-2 bg-sql-surface border-t border-sql-border">
        <p className="font-mono text-[10px] text-sql-num">💡 {ctx.hint}</p>
      </div>
    </div>
  )
}

function AskArjunBar({onAsk}) {
  const [q,setQ] = useState('');
  const [response,setResponse] = useState('');
  const [loading,setLoading] = useState(false);
  const {callArjun} = useArjun();
  const mounted = useRef(true);

  useEffect(()=>()=>{ mounted.current=false },[])

  const ask = async ()=>{
    if(!q.trim() || loading) return;

    setLoading(true);
    setResponse('');

    try{
      const fb = await callArjun(
        `Socratic question about Swiggy North Bangalore Biryani investigation: ${q}`,
        'clarify'
      );

      if(mounted.current){
        setResponse(fb);
        setLoading(false);
        setQ('');
        onAsk?.();
      }
    }catch{
      if(mounted.current) setLoading(false);
    }
  };

  return(
    <div className="sticky bottom-0 border-t border-border bg-surface -mx-6 px-6 py-3 z-40 mt-4">
      <div className="flex gap-2 items-center max-w-3xl mx-auto">
        <div className="w-7 h-7 rounded-lg bg-phase1-bg border border-phase1-border flex items-center justify-center font-mono text-[9px] font-bold text-phase1">AJ</div>

        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') ask() }}
          placeholder="Stuck? Ask Arjun — he'll answer Socratically..."
          className="flex-1 rounded-lg px-3 py-2 text-[13px] outline-none font-sans"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--ink)',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(79,128,255,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />

        <button
          disabled={loading}
          onClick={ask}
          className="px-3 py-2 text-white text-xs rounded-lg disabled:opacity-50 transition-opacity hover:opacity-80"
          style={{ background: 'var(--phase2)' }}
        >
          Ask →
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 mt-2 max-w-3xl mx-auto pl-9">
          {[0,1,2].map(i=>(
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink3 animate-bounce"
              style={{animationDelay:`${i*0.15}s`}}
            />
          ))}
          <span className="text-[12px] text-ink3">Arjun is thinking...</span>
        </div>
      )}

      {response && (
        <div className="mt-2 max-w-3xl mx-auto pl-9">
          <ArjunVoice label="Arjun (Socratic)" phase={2}>
            {response}
          </ArjunVoice>
        </div>
      )}
    </div>
  )
}

function StepProgress({currentIdx}) {
  return(
    <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1">
      {P2_STEP_IDS.map((id,i)=>(
        <React.Fragment key={id}>
          <div className={`flex flex-col items-center gap-1 ${i>currentIdx?'opacity-30':''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold
              ${i<currentIdx?'bg-phase2 border-phase2 text-white':
                i===currentIdx?'bg-phase2-bg border-phase2 text-phase2':
                'bg-surface border-border text-ink3'}
            `}>
              {i<currentIdx?'✓':i+1}
            </div>

            <span className={`font-mono text-[9px] ${i===currentIdx?'text-phase2 font-bold':'text-ink3'}`}>
              {P2_STEP_LABELS[i]}
            </span>
          </div>

          {i<P2_STEP_IDS.length-1 && (
            <div className={`flex-1 h-px mx-1 min-w-[16px] ${i<currentIdx?'bg-phase2':'bg-border'}`}/>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function Step({stepId,onDone,onBehaviour,onQueryCount}) {
  const [showNext,setShowNext] = useState(false);
  const stepRef = useRef(null);
  const timeoutRef = useRef();

  useEffect(()=>{
    requestAnimationFrame(()=>{
      stepRef.current?.scrollIntoView({behavior:'smooth',block:'start'});
    });

    return ()=> clearTimeout(timeoutRef.current);
  },[]);

  const handleSqlRun = ()=>{
    onQueryCount?.();
    timeoutRef.current = setTimeout(()=>setShowNext(true),900);
  };

  const handlePFSubmit = useCallback(()=>{
    setShowNext(true);
  },[]);

  if(stepId==='clarify'){
    return(
      <div ref={stepRef} className="mb-6">
        <ArjunVoice label="Your turn — apply Phase 1 before any data" phase={2}>
          Before querying anything — what clarification do you ask Priya?
        </ArjunVoice>

        <ProduceFirst
          id="p2-clarify"
          prompt="What clarification do you ask Priya?"
          minWords={8}
          mockKey="clarify"
          onSubmit={handlePFSubmit}
        />

        {showNext && (
          <button onClick={onDone}
            className="w-full py-3 bg-phase2 text-white text-sm rounded-xl mt-3">
            Step 2: Establish the baseline →
          </button>
        )}
      </div>
    )
  }

  if(stepId==='baseline'){
    return(
      <div ref={stepRef} className="mb-6">
        <ArjunVoice label="Step 2 — Your turn in BigQuery" phase={2}>
          Confirm the baseline first. Verify the drop yourself.
        </ArjunVoice>

        <InlineSchema stepId={stepId}/>

        <SqlWorkbench
          id="wb-baseline"
          title="baseline_nb_biryani.sql"
          dataKey="p2_baseline"
          onRun={handleSqlRun}
        />

        {showNext && (
          <button onClick={onDone}
            className="w-full py-3 bg-phase2 text-white text-sm rounded-xl mt-2">
            Step 3 →
          </button>
        )}
      </div>
    )
  }

  return null
}

export default function Phase2Section({
  startTime,
  priya1Sent,
  priya2Sent,
  onPriyaMessage,
  onDone,
  onBehaviour,
  onQueryCount,
  queryCount
}) {

  const [stepIdx,setStepIdx] = useState(0);
  const {fmtElapsed} = useP2Timer({startTime,onPriyaMessage,priya1Sent,priya2Sent});
  const [priyaMessages,setPriyaMessages] = useState([]);
  const [showAskBar,setShowAskBar] = useState(false);

  useEffect(()=>{
    if(stepIdx>=3) setShowAskBar(true)
  },[stepIdx])

  const handlePriyaMessage = useCallback((n,msg)=>{
    setPriyaMessages(prev=>[...prev,msg])
    onPriyaMessage?.(n,msg)
  },[onPriyaMessage])

  const advance = (val)=>{
    if(stepIdx === P2_STEP_IDS.length-1){
      onDone?.(val)
    }else{
      setStepIdx(i=>Math.min(i+1,P2_STEP_IDS.length-1))
    }
  }

  return(
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── War-room incident banner ── */}
      <div className="incident-banner px-6 py-5 mb-6">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {/* Live incident badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,90,101,0.12)', border: '1px solid rgba(255,90,101,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A65] alert-pulse" />
              <span className="font-mono text-[10px] font-bold text-[#FF5A65] uppercase tracking-widest">
                Incident · Active
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>
              Opened Mon 4:47 PM · Severity: High · Assigned to you
            </span>
            <div className="ml-auto flex items-center gap-5">
              <div className="text-right">
                <span className="font-mono text-[9px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--ink3)' }}>elapsed</span>
                <span className="font-mono text-[16px] font-bold tabular-nums"
                  style={{ color: parseInt(fmtElapsed) >= 20 ? '#FF5A65' : 'var(--ink)' }}>
                  {fmtElapsed}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] uppercase tracking-widest block mb-0.5" style={{ color: 'var(--ink3)' }}>queries</span>
                <span className="font-mono text-[16px] font-bold tabular-nums" style={{ color: 'var(--ink)' }}>
                  {queryCount}
                </span>
              </div>
            </div>
          </div>

          {/* Metric headline */}
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--ink)' }}>
              North Bangalore · Biryani orders
            </h2>
            <span className="font-mono text-2xl font-bold text-[#FF5A65]">−34% WoW</span>
          </div>

          <p className="text-sm" style={{ color: 'var(--ink3)' }}>
            Leadership review in 2 days. Priya needs root cause by EOD.
            Find the cause. Write the VP message.
          </p>

        </div>
      </div>

      <div className="px-6 pb-10 max-w-3xl mx-auto">

        <StepProgress currentIdx={stepIdx}/>
        <MissionBrief priyaMessages={priyaMessages}/>
        <SchemaPanel compact={true} />

        {P2_STEP_IDS.slice(0,stepIdx+1).map((id,i)=>(
          <Step
            key={id}
            stepId={id}
            onDone={i===stepIdx?advance:undefined}
            onBehaviour={onBehaviour}
            onQueryCount={onQueryCount}
          />
        ))}

        {showAskBar && <AskArjunBar onAsk={onQueryCount} />}

        {/* ArjunMentor thread — from step 2 */}
        {stepIdx >= 1 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                Arjun · Available for questions
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <ArjunMentor
              milestone="synthesis"
              dirtyDataEnabled={true}
              onDirtyDataTrigger={onBehaviour ? () => onBehaviour("sanity", "Skipped data sanity check", "Needs improvement") : undefined}
              initialMessages={[{
                from: "arjun",
                text: "You've seen the baseline. What's your working hypothesis right now — before you look at any more data?",
                time: "10:15",
              }]}
            />
          </div>
        )}

        {/* Strategic Workbench — from investigate step */}
        {stepIdx >= 3 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                Strategic Workbench · NL data requests
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <StrategicWorkbench phase={2} dirtyDataTriggered={stepIdx >= 4} />
          </div>
        )}

      </div>
    </div>
  )
}