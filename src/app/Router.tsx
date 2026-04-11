import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense }          from 'react'

const Home           = lazy(() => import('@/pages/Home'))
const CaseStudies    = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell = lazy(() => import('@/pages/CaseStudy'))
const Phase0         = lazy(() => import('@/pages/CaseStudy/phases/Phase0'))
const Phase1         = lazy(() => import('@/pages/CaseStudy/phases/Phase1'))
const PhaseView      = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}>
      <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-study/:slug" element={<CaseStudyShell />}>
          <Route path="phase-0" element={<Phase0 />} />
          <Route path="phase-1" element={<Phase1 />} />
          <Route path=":phase"  element={<PhaseView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
