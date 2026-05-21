import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

const CDN = 'https://cdn.jsdelivr.net/gh/Gketan97/jobscout-date@main/data/jobs.json'

interface Job {
  id: string; title: string; company: string; location: string
  city: string; mode: string; fn: string; seniority: string
  url: string; color: string; posted_at: string; src: string
  tier: number; dept: string; country: string
}

const CATEGORIES: Record<string, string> = {
  data: 'Analytics', analytics: 'Analytics',
  product: 'Product', bizops: 'Business',
  engineering: 'Engineering',
}

function daysAgo(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [job, setJob] = useState<Job | null>(null)
  const [related, setRelated] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(CDN)
      .then(r => r.json())
      .then(d => {
        const jobs: Job[] = d.jobs || []
        const found = jobs.find(j => j.id === id)
        if (!found) { setNotFound(true); setLoading(false); return }
        setJob(found)
        setRelated(jobs.filter(j => j.fn === found.fn && j.id !== found.id).slice(0, 4))
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  const backUrl = '/jobs' + (searchParams.toString() ? '?' + searchParams.toString() : '')
  const days = job ? daysAgo(job.posted_at) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#9ca3af', letterSpacing: '0.1em' }}>LOADING…</span>
    </div>
  )

  if (notFound || !job) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 }}>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, fontWeight: 400, color: '#141414' }}>Job not found</div>
      <button onClick={() => navigate('/jobs')} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#fff', background: '#141414', border: 'none', borderRadius: 100, padding: '12px 28px', cursor: 'pointer' }}>
        Browse all jobs →
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .jd { min-height: 100vh; background: #FAFAF8; font-family: 'DM Sans', sans-serif; color: #141414; }
        .jd-nav { height: 56px; background: #fff; border-bottom: 1px solid #E8E8E4; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; }
        .jd-logo { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; color: #141414; cursor: pointer; letter-spacing: 0.04em; }
        .jd-logo span { color: #A855F7; }
        .jd-back { font-size: 13px; color: #6b6b6b; background: #fff; border: 1.5px solid #E8E8E4; border-radius: 100px; padding: 7px 16px; cursor: pointer; transition: all 150ms; font-family: 'DM Sans', sans-serif; }
        .jd-back:hover { border-color: #A855F7; color: #7c3aed; }
        .jd-body { max-width: 760px; margin: 0 auto; padding: 48px 32px 80px; }

        /* Header */
        .jd-company-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .jd-dot { width: 10px; height: 10px; border-radius: 50%; }
        .jd-co { font-family: 'DM Mono', monospace; font-size: 12px; color: #9ca3af; letter-spacing: 0.06em; }
        .jd-title { font-family: 'Instrument Serif', serif; font-size: clamp(24px, 3vw, 34px); font-weight: 400; color: #141414; line-height: 1.2; margin-bottom: 18px; }
        .jd-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
        .jd-tag { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: #6b6b6b; background: #F5F5F2; border-radius: 6px; padding: 4px 10px; }
        .jd-tag.cat { color: #7c3aed; background: #F5F0FF; }
        .jd-tag.fresh { color: #16a34a; background: #f0fdf4; }
        .jd-tag.remote { color: #16a34a; background: #f0fdf4; }
        .jd-divider { height: 1px; background: #E8E8E4; margin-bottom: 28px; }

        /* Apply */
        .jd-apply-wrap { margin-bottom: 32px; }
        .jd-apply { display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; color: #fff; background: #141414; border: none; border-radius: 100px; padding: 14px 36px; cursor: pointer; text-decoration: none; transition: all 200ms; }
        .jd-apply:hover { background: #A855F7; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,85,247,0.25); }
        .jd-apply-note { font-size: 12px; color: #9ca3af; margin-top: 8px; font-family: 'DM Mono', monospace; }

        /* Info grid */
        .jd-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 32px; }
        .jd-info-card { background: #fff; border: 1.5px solid #E8E8E4; border-radius: 12px; padding: 14px 18px; }
        .jd-info-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: #9ca3af; margin-bottom: 4px; }
        .jd-info-val { font-size: 14px; font-weight: 500; color: #141414; }

        /* Nudge */
        .jd-nudge { background: #F5F0FF; border: 1.5px solid #E8DAFF; border-radius: 14px; padding: 20px 22px; margin-bottom: 32px; }
        .jd-nudge-head { font-size: 14px; font-weight: 600; color: #6b21a8; margin-bottom: 6px; }
        .jd-nudge-body { font-size: 13px; color: #7c3aed; line-height: 1.6; margin-bottom: 14px; }
        .jd-nudge-btn { font-size: 13px; font-weight: 600; color: #fff; background: #7c3aed; border: none; border-radius: 100px; padding: 9px 20px; cursor: pointer; transition: background 150ms; }
        .jd-nudge-btn:hover { background: #6d28d9; }

        /* Related */
        .jd-related-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: #9ca3af; margin-bottom: 12px; }
        .jd-related-card { background: #fff; border: 1.5px solid #E8E8E4; border-radius: 12px; padding: 14px 18px; cursor: pointer; transition: all 150ms; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .jd-related-card:hover { border-color: #A855F7; }
        .jd-related-title { font-size: 14px; font-weight: 500; color: #141414; margin-bottom: 2px; }
        .jd-related-meta { font-size: 12px; color: #9ca3af; }
        .jd-related-arrow { color: #d1d5db; font-size: 16px; flex-shrink: 0; transition: color 150ms; }
        .jd-related-card:hover .jd-related-arrow { color: #A855F7; }

        @media (max-width: 640px) {
          .jd-nav { padding: 0 20px; }
          .jd-body { padding: 28px 20px 60px; }
          .jd-info { grid-template-columns: 1fr; }
          .jd-apply { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="jd">
        <nav className="jd-nav">
          <span className="jd-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
          <button className="jd-back" onClick={() => navigate(backUrl)}>← All jobs</button>
        </nav>

        <div className="jd-body">
          <div className="jd-company-row">
            <div className="jd-dot" style={{ background: job.color || '#A855F7' }} />
            <span className="jd-co">{job.company}</span>
          </div>

          <h1 className="jd-title">{job.title}</h1>

          <div className="jd-tags">
            {job.fn && <span className="jd-tag cat">{CATEGORIES[job.fn] || job.fn}</span>}
            {job.seniority && <span className="jd-tag">{job.seniority}</span>}
            {job.mode === 'remote' && <span className="jd-tag remote">Remote</span>}
            {days <= 7 && <span className="jd-tag fresh">Posted {days === 0 ? 'today' : `${days}d ago`}</span>}
          </div>

          <div className="jd-divider" />

          <div className="jd-apply-wrap">
            <a className="jd-apply" href={job.url} target="_blank" rel="noopener noreferrer">
              Apply at {job.company} →
            </a>
            <p className="jd-apply-note">Opens company application page</p>
          </div>

          <div className="jd-info">
            <div className="jd-info-card">
              <div className="jd-info-label">COMPANY</div>
              <div className="jd-info-val">{job.company}</div>
            </div>
            <div className="jd-info-card">
              <div className="jd-info-label">LOCATION</div>
              <div className="jd-info-val">{job.location || job.city || '—'}</div>
            </div>
            <div className="jd-info-card">
              <div className="jd-info-label">WORK MODE</div>
              <div className="jd-info-val" style={{ textTransform: 'capitalize' }}>{job.mode || '—'}</div>
            </div>
            <div className="jd-info-card">
              <div className="jd-info-label">POSTED</div>
              <div className="jd-info-val">{new Date(job.posted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          <div className="jd-nudge">
            <div className="jd-nudge-head">Before you apply</div>
            <p className="jd-nudge-body">
              {CATEGORIES[job.fn] || 'Analytics'} roles at {job.company} test how you structure ambiguous problems and make decisions with data. Do you know where your thinking stands?
            </p>
            <button className="jd-nudge-btn" onClick={() => navigate('/diagnostic')}>
              Test your thinking free →
            </button>
          </div>

          {related.length > 0 && (
            <div>
              <div className="jd-related-label">MORE {(CATEGORIES[job.fn] || job.fn).toUpperCase()} ROLES</div>
              {related.map(r => (
                <div key={r.id} className="jd-related-card" onClick={() => navigate(`/jobs/${r.id}`)}>
                  <div>
                    <div className="jd-related-title">{r.title}</div>
                    <div className="jd-related-meta">{r.company} · {r.city || r.location}</div>
                  </div>
                  <span className="jd-related-arrow">→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
