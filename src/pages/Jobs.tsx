import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CDN = 'https://cdn.jsdelivr.net/gh/Gketan97/jobscout-date@main/data/jobs.json'
const PAGE_SIZE = 25

interface Job {
  id: string
  title: string
  company: string
  location: string
  city: string
  mode: string
  country: string
  fn: string
  tier: number
  seniority: string
  dept: string
  url: string
  color: string
  posted_at: string
  src: string
}

const FN_LABELS: Record<string, string> = {
  data: 'Data & Analytics',
  analytics: 'Analytics',
  product: 'Product',
  engineering: 'Engineering',
  sales: 'Sales',
  bizops: 'Biz Ops',
  finance: 'Finance',
  cx: 'Customer Success',
  marketing: 'Marketing',
  hr: 'HR',
  design: 'Design',
  other: 'Other',
}

const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  lead: 'Lead',
  director: 'Director',
  vp: 'VP',
}

function daysAgo(dateStr: string): number {
  const d = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - d.getTime()) / 86400000)
}

function postedLabel(dateStr: string): string {
  const d = daysAgo(dateStr)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d <= 7) return `${d}d ago`
  if (d <= 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

function postedColor(dateStr: string): string {
  const d = daysAgo(dateStr)
  if (d <= 3) return '#4ade80'
  if (d <= 7) return '#fbbf24'
  return 'var(--text-tertiary)'
}

export default function Jobs() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Filters from URL params
  const q = searchParams.get('q') || ''
  const fnFilter = searchParams.get('fn') || ''
  const senFilter = searchParams.get('seniority') || ''
  const modeFilter = searchParams.get('mode') || ''
  const daysFilter = parseInt(searchParams.get('days') || '0')

  const setFilter = useCallback((key: string, val: string) => {
    setPage(1)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set(key, val)
      else next.delete(key)
      return next
    }, { replace: true })
  }, [setSearchParams])

  const clearAll = () => {
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  // Load jobs
  useEffect(() => {
    fetch(CDN)
      .then(r => r.json())
      .then(d => { setJobs(d.jobs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Derived filter options from data
  const fnOptions = useMemo(() => {
    const counts: Record<string, number> = {}
    jobs.forEach(j => { counts[j.fn] = (counts[j.fn] || 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([fn, count]) => ({ fn, count, label: FN_LABELS[fn] || fn }))
  }, [jobs])

  const cityOptions = useMemo(() => {
    const counts: Record<string, number> = {}
    jobs.forEach(j => {
      const c = j.city || j.location
      if (c) counts[c] = (counts[c] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [jobs])

  // Filtered + searched jobs
  const filtered = useMemo(() => {
    let result = jobs
    const ql = q.toLowerCase()
    if (ql) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(ql) ||
        j.company.toLowerCase().includes(ql) ||
        j.location.toLowerCase().includes(ql)
      )
    }
    if (fnFilter) result = result.filter(j => j.fn === fnFilter)
    if (senFilter) result = result.filter(j => j.seniority === senFilter)
    if (modeFilter) result = result.filter(j => j.mode === modeFilter)
    if (daysFilter > 0) result = result.filter(j => daysAgo(j.posted_at) <= daysFilter)
    return result
  }, [jobs, q, fnFilter, senFilter, modeFilter, daysFilter])

  const activeFilters = [fnFilter, senFilter, modeFilter, daysFilter > 0 ? `${daysFilter}d` : ''].filter(Boolean).length

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  return (
    <>
      <style>{`
        .jb-page { min-height: 100vh; background: var(--bg-base); }

        /* Topbar */
        .jb-topbar {
          height: 64px; display: flex; align-items: center; padding: 0 32px;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(8,8,12,0.96); backdrop-filter: blur(14px);
          position: sticky; top: 0; z-index: 100;
          justify-content: space-between;
        }
        .jb-logo { font-family: 'DM Mono', monospace; font-size: 14px; letter-spacing: 0.1em; color: #fff; font-weight: 600; cursor: pointer; }
        .jb-logo span { background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .jb-topbar-right { display: flex; align-items: center; gap: 12px; }
        .jb-topbar-link { font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.55); background: none; border: none; cursor: pointer; transition: color 150ms; padding: 0; }
        .jb-topbar-link:hover { color: #fff; }
        .jb-topbar-cta { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 8px 18px; cursor: pointer; white-space: nowrap; }

        /* Branding banner */
        .jb-banner {
          background: rgba(168,85,247,0.06);
          border-bottom: 1px solid rgba(168,85,247,0.15);
          padding: 12px 32px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          flex-wrap: wrap;
        }
        .jb-banner-text { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary); }
        .jb-banner-text strong { color: var(--text-primary); }
        .jb-banner-btn { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--accent); background: none; border: 1px solid rgba(168,85,247,0.3); border-radius: 100px; padding: 7px 16px; cursor: pointer; white-space: nowrap; transition: all 150ms; flex-shrink: 0; }
        .jb-banner-btn:hover { background: rgba(168,85,247,0.1); }

        /* Hero */
        .jb-hero { padding: 40px 32px 32px; border-bottom: 1px solid var(--border-subtle); }
        .jb-hero-inner { max-width: 1100px; margin: 0 auto; }
        .jb-hero-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 10px; }
        .jb-hero-h1 { font-family: 'Instrument Serif', serif; font-size: clamp(24px, 3vw, 40px); font-weight: 400; color: var(--text-primary); margin-bottom: 6px; line-height: 1.2; }
        .jb-hero-sub { font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-secondary); margin-bottom: 24px; }

        /* Search */
        .jb-search-wrap { position: relative; max-width: 560px; }
        .jb-search { width: 100%; box-sizing: border-box; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 12px; padding: 14px 48px 14px 20px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-primary); outline: none; transition: border-color 200ms; }
        .jb-search::placeholder { color: var(--text-tertiary); }
        .jb-search:focus { border-color: rgba(168,85,247,0.5); }
        .jb-search-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-size: 16px; pointer-events: none; }
        .jb-search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 18px; padding: 4px; line-height: 1; }
        .jb-search-clear:hover { color: var(--text-primary); }

        /* Layout */
        .jb-layout { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 240px 1fr; gap: 0; }

        /* Sidebar */
        .jb-sidebar {
          padding: 24px 20px; border-right: 1px solid var(--border-subtle);
          position: sticky; top: 64px; height: calc(100vh - 64px);
          overflow-y: auto; scrollbar-width: thin;
        }
        .jb-sidebar-section { margin-bottom: 28px; }
        .jb-sidebar-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 10px; }
        .jb-filter-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 7px 10px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary);
          transition: all 150ms; text-align: left;
        }
        .jb-filter-btn:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .jb-filter-btn.active { background: rgba(168,85,247,0.1); color: var(--text-primary); font-weight: 500; }
        .jb-filter-count { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); }
        .jb-filter-btn.active .jb-filter-count { color: var(--accent); }
        .jb-clear-btn { width: 100%; background: none; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-tertiary); cursor: pointer; transition: all 150ms; margin-top: 4px; }
        .jb-clear-btn:hover { border-color: var(--border-default); color: var(--text-secondary); }

        /* Main content */
        .jb-main { padding: 20px 28px; }
        .jb-results-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
        }
        .jb-results-count { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-tertiary); letter-spacing: 0.06em; }
        .jb-active-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .jb-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.04em;
          color: var(--accent); background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.2); border-radius: 100px; padding: 4px 10px;
          cursor: pointer; transition: background 150ms;
        }
        .jb-chip:hover { background: rgba(168,85,247,0.15); }
        .jb-chip-x { font-size: 14px; line-height: 1; opacity: 0.7; }

        /* Job cards */
        .jb-cards { display: flex; flex-direction: column; gap: 8px; }
        .jb-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 18px 20px;
          cursor: pointer; transition: all 180ms;
          display: grid; grid-template-columns: 1fr auto;
          gap: 8px 16px; align-items: start;
          text-decoration: none;
        }
        .jb-card:hover { border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.03); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .jb-card-left {}
        .jb-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
        .jb-company-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .jb-company { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: var(--text-tertiary); }
        .jb-title { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; line-height: 1.35; }
        .jb-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .jb-tag {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.06em;
          color: var(--text-tertiary); background: var(--bg-base);
          border: 1px solid var(--border-subtle); border-radius: 6px; padding: 3px 8px;
        }
        .jb-tag.fn { color: rgba(168,85,247,0.8); border-color: rgba(168,85,247,0.15); background: rgba(168,85,247,0.05); }
        .jb-tag.mode-remote { color: #4ade80; border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.05); }
        .jb-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .jb-posted { font-family: 'DM Mono', monospace; font-size: 11px; white-space: nowrap; }
        .jb-apply-arrow { color: var(--text-tertiary); font-size: 16px; transition: transform 150ms, color 150ms; }
        .jb-card:hover .jb-apply-arrow { transform: translateX(3px); color: var(--accent); }

        /* Load more */
        .jb-loadmore { text-align: center; padding: 28px 0; }
        .jb-loadmore-btn { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; color: var(--text-secondary); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 100px; padding: 12px 32px; cursor: pointer; transition: all 180ms; }
        .jb-loadmore-btn:hover { border-color: rgba(168,85,247,0.3); color: var(--text-primary); }

        /* Empty */
        .jb-empty { text-align: center; padding: 80px 20px; }
        .jb-empty-h { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--text-primary); font-weight: 400; margin-bottom: 8px; }
        .jb-empty-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-tertiary); }

        /* Loading skeleton */
        .jb-skeleton { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 18px 20px; margin-bottom: 8px; }
        .jb-skel-line { height: 14px; background: rgba(255,255,255,0.04); border-radius: 6px; margin-bottom: 8px; animation: jb-pulse 1.4s ease-in-out infinite; }
        @keyframes jb-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* Responsive */
        @media (max-width: 768px) {
          .jb-topbar { padding: 0 20px; }
          .jb-hero { padding: 28px 20px 24px; }
          .jb-banner { padding: 12px 20px; }
          .jb-layout { grid-template-columns: 1fr; }
          .jb-sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border-subtle); padding: 16px 20px; }
          .jb-sidebar-filters { display: flex; gap: 8px; flex-wrap: wrap; }
          .jb-sidebar-section { margin-bottom: 12px; }
          .jb-sidebar-label { margin-bottom: 6px; }
          .jb-filter-btn { width: auto; display: inline-flex; }
          .jb-main { padding: 16px 20px; }
          .jb-card { grid-template-columns: 1fr; }
          .jb-card-right { flex-direction: row; align-items: center; justify-content: space-between; }
        }
      `}</style>

      <div className="jb-page">

        {/* Topbar */}
        <div className="jb-topbar">
          <span className="jb-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
          <div className="jb-topbar-right">
            <button className="jb-topbar-link" onClick={() => navigate('/')}>Home</button>
            <button className="jb-topbar-cta" onClick={() => navigate('/diagnostic')}>
              Test Your Thinking →
            </button>
          </div>
        </div>

        {/* Subtle branding banner */}
        <div className="jb-banner">
          <span className="jb-banner-text">
            <strong>Found a role you like?</strong> Know if your thinking is ready for it — free 4-minute test.
          </span>
          <button className="jb-banner-btn" onClick={() => navigate('/diagnostic')}>
            Test Your Decision-Making →
          </button>
        </div>

        {/* Hero + Search */}
        <div className="jb-hero">
          <div className="jb-hero-inner">
            <p className="jb-hero-label">ANALYTICS & PRODUCT JOBS · INDIA</p>
            <h1 className="jb-hero-h1">
              {loading ? 'Loading jobs…' : `${jobs.length.toLocaleString()} open roles`}
            </h1>
            <p className="jb-hero-sub">Updated daily from top Indian tech companies</p>
            <div className="jb-search-wrap">
              <input
                className="jb-search"
                placeholder="Search by title, company, or location…"
                value={q}
                onChange={e => setFilter('q', e.target.value)}
              />
              {q
                ? <button className="jb-search-clear" onClick={() => setFilter('q', '')}>×</button>
                : <span className="jb-search-icon">⌕</span>
              }
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="jb-layout">

          {/* Sidebar filters */}
          <div className="jb-sidebar">

            {activeFilters > 0 && (
              <div className="jb-sidebar-section">
                <button className="jb-clear-btn" onClick={clearAll}>
                  Clear all filters ({activeFilters})
                </button>
              </div>
            )}

            {/* Function */}
            <div className="jb-sidebar-section">
              <div className="jb-sidebar-label">FUNCTION</div>
              <button
                className={`jb-filter-btn${!fnFilter ? ' active' : ''}`}
                onClick={() => setFilter('fn', '')}
              >
                <span>All functions</span>
              </button>
              {fnOptions.map(({ fn, count, label }) => (
                <button
                  key={fn}
                  className={`jb-filter-btn${fnFilter === fn ? ' active' : ''}`}
                  onClick={() => setFilter('fn', fnFilter === fn ? '' : fn)}
                >
                  <span>{label}</span>
                  <span className="jb-filter-count">{count}</span>
                </button>
              ))}
            </div>

            {/* Seniority */}
            <div className="jb-sidebar-section">
              <div className="jb-sidebar-label">SENIORITY</div>
              {['junior', 'mid', 'senior', 'lead'].map(s => (
                <button
                  key={s}
                  className={`jb-filter-btn${senFilter === s ? ' active' : ''}`}
                  onClick={() => setFilter('seniority', senFilter === s ? '' : s)}
                >
                  <span>{SENIORITY_LABELS[s] || s}</span>
                </button>
              ))}
            </div>

            {/* Mode */}
            <div className="jb-sidebar-section">
              <div className="jb-sidebar-label">WORK MODE</div>
              {['remote', 'hybrid', 'onsite'].map(m => (
                <button
                  key={m}
                  className={`jb-filter-btn${modeFilter === m ? ' active' : ''}`}
                  onClick={() => setFilter('mode', modeFilter === m ? '' : m)}
                >
                  <span style={{ textTransform: 'capitalize' }}>{m}</span>
                </button>
              ))}
            </div>

            {/* Posted */}
            <div className="jb-sidebar-section">
              <div className="jb-sidebar-label">DATE POSTED</div>
              {[
                { val: 3, label: 'Last 3 days' },
                { val: 7, label: 'Last 7 days' },
                { val: 14, label: 'Last 2 weeks' },
                { val: 30, label: 'Last month' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  className={`jb-filter-btn${daysFilter === val ? ' active' : ''}`}
                  onClick={() => setFilter('days', daysFilter === val ? '' : String(val))}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Job list */}
          <div className="jb-main">

            {/* Results bar */}
            <div className="jb-results-bar">
              <span className="jb-results-count">
                {loading ? 'Loading…' : `${filtered.length.toLocaleString()} result${filtered.length !== 1 ? 's' : ''}`}
                {q && ` for "${q}"`}
              </span>
              <div className="jb-active-filters">
                {fnFilter && (
                  <span className="jb-chip" onClick={() => setFilter('fn', '')}>
                    {FN_LABELS[fnFilter] || fnFilter} <span className="jb-chip-x">×</span>
                  </span>
                )}
                {senFilter && (
                  <span className="jb-chip" onClick={() => setFilter('seniority', '')}>
                    {SENIORITY_LABELS[senFilter] || senFilter} <span className="jb-chip-x">×</span>
                  </span>
                )}
                {modeFilter && (
                  <span className="jb-chip" onClick={() => setFilter('mode', '')}>
                    {modeFilter} <span className="jb-chip-x">×</span>
                  </span>
                )}
                {daysFilter > 0 && (
                  <span className="jb-chip" onClick={() => setFilter('days', '')}>
                    Last {daysFilter}d <span className="jb-chip-x">×</span>
                  </span>
                )}
              </div>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="jb-skeleton">
                    <div className="jb-skel-line" style={{ width: '40%' }} />
                    <div className="jb-skel-line" style={{ width: '70%' }} />
                    <div className="jb-skel-line" style={{ width: '55%' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="jb-empty">
                <div className="jb-empty-h">No jobs match your filters</div>
                <p className="jb-empty-sub">Try broadening your search or clearing some filters.</p>
                <button className="jb-loadmore-btn" style={{ marginTop: 20 }} onClick={clearAll}>
                  Clear all filters
                </button>
              </div>
            )}

            {/* Cards */}
            {!loading && (
              <div className="jb-cards">
                {paginated.map(job => (
                  <div
                    key={job.id}
                    className="jb-card"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="jb-card-left">
                      <div className="jb-card-top">
                        <div className="jb-company-dot" style={{ background: job.color || 'var(--accent)' }} />
                        <span className="jb-company">{job.company}</span>
                      </div>
                      <div className="jb-title">{job.title}</div>
                      <div className="jb-meta">
                        {job.fn && <span className="jb-tag fn">{FN_LABELS[job.fn] || job.fn}</span>}
                        {job.seniority && <span className="jb-tag">{SENIORITY_LABELS[job.seniority] || job.seniority}</span>}
                        {job.mode && (
                          <span className={`jb-tag${job.mode === 'remote' ? ' mode-remote' : ''}`}>
                            {job.mode}
                          </span>
                        )}
                        {job.location && <span className="jb-tag">{job.location}</span>}
                      </div>
                    </div>
                    <div className="jb-card-right">
                      <span className="jb-posted" style={{ color: postedColor(job.posted_at) }}>
                        {postedLabel(job.posted_at)}
                      </span>
                      <span className="jb-apply-arrow">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && !loading && (
              <div className="jb-loadmore">
                <button className="jb-loadmore-btn" onClick={() => setPage(p => p + 1)}>
                  Show more ({filtered.length - paginated.length} remaining)
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
