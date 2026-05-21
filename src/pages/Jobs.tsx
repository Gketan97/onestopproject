import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'

const CDN = 'https://cdn.jsdelivr.net/gh/Gketan97/jobscout-date@main/data/jobs.json'
const PAGE_SIZE = 20

interface Job {
  id: string; title: string; company: string; location: string
  city: string; mode: string; fn: string; seniority: string
  url: string; color: string; posted_at: string; src: string
  tier: number; dept: string; country: string
}

function daysAgo(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
}
function postedLabel(d: string) {
  const days = daysAgo(d)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days <= 7) return `${days}d ago`
  if (days <= 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}
function postedColor(d: string) {
  const days = daysAgo(d)
  if (days <= 3) return '#16a34a'
  if (days <= 7) return '#d97706'
  return '#9ca3af'
}

export default function Jobs() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [dismissed, setDismissed] = useState(false)

  const q = searchParams.get('q') || ''

  const setQ = useCallback((val: string) => {
    setPage(1)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('q', val)
      else next.delete('q')
      return next
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    fetch(CDN)
      .then(r => r.json())
      .then(d => { setJobs(d.jobs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!q) return jobs
    const ql = q.toLowerCase()
    return jobs.filter(j =>
      j.title.toLowerCase().includes(ql) ||
      j.company.toLowerCase().includes(ql)
    )
  }, [jobs, q])

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  return (
    <>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .jb { min-height: 100vh; background: #FAFAF8; font-family: 'DM Sans', sans-serif; color: #141414; }
        .jb-banner { background: #F5F0FF; border-bottom: 1px solid #E8DAFF; padding: 10px 32px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .jb-banner-text { font-size: 13px; color: #6b21a8; }
        .jb-banner-text strong { font-weight: 600; }
        .jb-banner-right { display: flex; align-items: center; gap: 12px; }
        .jb-banner-btn { font-size: 13px; font-weight: 600; color: #7c3aed; background: none; border: 1px solid #c4b5fd; border-radius: 100px; padding: 5px 14px; cursor: pointer; white-space: nowrap; transition: all 150ms; }
        .jb-banner-btn:hover { background: #ede9fe; }
        .jb-banner-close { background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 18px; line-height: 1; padding: 2px 6px; }
        .jb-header { max-width: 1200px; margin: 0 auto; padding: 40px 32px 28px; }
        .jb-header-top { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .jb-title { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 3vw, 40px); font-weight: 400; color: #141414; line-height: 1.1; }
        .jb-subtitle { font-size: 14px; color: #9ca3af; margin-top: 4px; }
        .jb-count-badge { font-family: 'DM Mono', monospace; font-size: 12px; color: #6b6b6b; background: #F0F0EC; border-radius: 100px; padding: 6px 14px; white-space: nowrap; }
        .jb-search-wrap { position: relative; max-width: 480px; }
        .jb-search { width: 100%; background: #fff; border: 1.5px solid #E8E8E4; border-radius: 10px; padding: 11px 40px 11px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #141414; outline: none; transition: border-color 180ms; }
        .jb-search::placeholder { color: #b0b0a8; }
        .jb-search:focus { border-color: #A855F7; }
        .jb-search-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #b0b0a8; font-size: 15px; pointer-events: none; }
        .jb-search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 16px; padding: 4px; }
        .jb-results-bar { max-width: 1200px; margin: 0 auto; padding: 0 32px 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .jb-results-text { font-family: 'DM Mono', monospace; font-size: 12px; color: #9ca3af; letter-spacing: 0.04em; }
        .jb-clear { font-size: 13px; color: #A855F7; background: none; border: none; cursor: pointer; }
        .jb-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px 80px; }
        .jb-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .jb-card { background: #fff; border: 1.5px solid #E8E8E4; border-radius: 14px; padding: 20px 22px; cursor: pointer; transition: all 180ms cubic-bezier(0.22,1,0.36,1); display: flex; flex-direction: column; gap: 12px; }
        .jb-card:hover { border-color: #A855F7; box-shadow: 0 4px 24px rgba(168,85,247,0.08); transform: translateY(-2px); }
        .jb-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .jb-card-left { flex: 1; min-width: 0; }
        .jb-card-company { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .jb-card-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .jb-card-co-name { font-size: 12px; color: #9ca3af; font-family: 'DM Mono', monospace; letter-spacing: 0.04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .jb-card-title { font-size: 15px; font-weight: 600; color: #141414; line-height: 1.35; }
        .jb-card-posted { font-family: 'DM Mono', monospace; font-size: 11px; white-space: nowrap; flex-shrink: 0; margin-top: 2px; }
        .jb-card-bottom { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .jb-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.04em; color: #6b6b6b; background: #F5F5F2; border-radius: 6px; padding: 3px 8px; white-space: nowrap; }
        .jb-tag.remote { color: #16a34a; background: #f0fdf4; }
        .jb-location { font-size: 12px; color: #b0b0a8; margin-left: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
        .jb-skel { background: #fff; border: 1.5px solid #E8E8E4; border-radius: 14px; padding: 20px 22px; }
        .jb-skel-line { background: #F0F0EC; border-radius: 6px; margin-bottom: 8px; animation: skel-pulse 1.4s ease-in-out infinite; }
        @keyframes skel-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .jb-more { text-align: center; padding: 32px 0 0; }
        .jb-more-btn { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #6b6b6b; background: #fff; border: 1.5px solid #E8E8E4; border-radius: 100px; padding: 11px 32px; cursor: pointer; transition: all 180ms; }
        .jb-more-btn:hover { border-color: #A855F7; color: #7c3aed; }
        .jb-empty { text-align: center; padding: 80px 20px; }
        .jb-empty h3 { font-family: 'Instrument Serif', serif; font-size: 24px; font-weight: 400; color: #141414; margin-bottom: 8px; }
        .jb-empty p { font-size: 14px; color: #9ca3af; }
        @media (max-width: 768px) {
          .jb-header { padding: 28px 20px 20px; }
          .jb-results-bar { padding: 0 20px 12px; }
          .jb-grid-wrap { padding: 0 20px 80px; }
          .jb-grid { grid-template-columns: 1fr; }
          .jb-banner { padding: 10px 20px; }
          .jb-banner-text { font-size: 12px; }
        }
        @media (max-width: 480px) {
          .jb-title { font-size: 26px; }
          .jb-search-wrap { max-width: 100%; }
        }
      \`}</style>

      <div className="jb">
        <Nav />

        {!dismissed && (
          <div className="jb-banner">
            <span className="jb-banner-text">
              <strong>Found a role you like?</strong> Know if your thinking is ready — free 4-min test.
            </span>
            <div className="jb-banner-right">
              <button className="jb-banner-btn" onClick={() => navigate('/diagnostic')}>Test yourself free →</button>
              <button className="jb-banner-close" onClick={() => setDismissed(true)}>×</button>
            </div>
          </div>
        )}

        <div className="jb-header">
          <div className="jb-header-top">
            <div>
              <h1 className="jb-title">{loading ? 'Loading jobs…' : \`\${filtered.length.toLocaleString()} open roles\`}</h1>
              <p className="jb-subtitle">Analytics, Product & Tech roles across India · Updated daily</p>
            </div>
            {!loading && <span className="jb-count-badge">{jobs.filter(j => daysAgo(j.posted_at) <= 7).length} new this week</span>}
          </div>
          <div className="jb-search-wrap">
            <input
              className="jb-search"
              placeholder="Search by title or company…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            {q
              ? <button className="jb-search-clear" onClick={() => setQ('')}>×</button>
              : <span className="jb-search-icon">⌕</span>
            }
          </div>
        </div>

        <div className="jb-results-bar">
          <span className="jb-results-text">
            {loading ? 'LOADING…' : \`\${filtered.length.toLocaleString()} RESULT\${filtered.length !== 1 ? 'S' : ''}\${q ? \` FOR "\${q.toUpperCase()}"\` : ''}\`}
          </span>
          {q && <button className="jb-clear" onClick={() => setQ('')}>Clear</button>}
        </div>

        <div className="jb-grid-wrap">
          {loading && (
            <div className="jb-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="jb-skel">
                  <div className="jb-skel-line" style={{ width: '30%', height: 12 }} />
                  <div className="jb-skel-line" style={{ width: '75%', height: 16 }} />
                  <div className="jb-skel-line" style={{ width: '50%', height: 12 }} />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="jb-empty">
              <h3>No roles found</h3>
              <p>Try a different search term.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="jb-grid">
              {paginated.map(job => (
                <div
                  key={job.id}
                  className="jb-card"
                  onClick={() => navigate(\`/jobs/\${job.id}\${q ? '?q=' + encodeURIComponent(q) : ''}\`)}
                >
                  <div className="jb-card-top">
                    <div className="jb-card-left">
                      <div className="jb-card-company">
                        <div className="jb-card-dot" style={{ background: job.color || '#A855F7' }} />
                        <span className="jb-card-co-name">{job.company}</span>
                      </div>
                      <div className="jb-card-title">{job.title}</div>
                    </div>
                    <span className="jb-card-posted" style={{ color: postedColor(job.posted_at) }}>
                      {postedLabel(job.posted_at)}
                    </span>
                  </div>
                  <div className="jb-card-bottom">
                    {job.mode === 'remote' && <span className="jb-tag remote">Remote</span>}
                    {job.seniority && job.seniority !== 'mid' && <span className="jb-tag">{job.seniority}</span>}
                    {job.city && <span className="jb-location">{job.city}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <div className="jb-more">
              <button className="jb-more-btn" onClick={() => setPage(p => p + 1)}>
                Load more · {filtered.length - paginated.length} remaining
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
