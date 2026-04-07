import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home           = lazy(() => import('@/pages/Home'))
const CaseStudies    = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell = lazy(() => import('@/pages/CaseStudy'))
const PhaseView      = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"                        element={<Home />} />
        <Route path="/case-studies"            element={<CaseStudies />} />
        <Route path="/case-study/:slug"        element={<CaseStudyShell />} />
        <Route path="/case-study/:slug/:phase" element={<PhaseView />} />
        <Route path="*"                        element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
