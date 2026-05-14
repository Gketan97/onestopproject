import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TruthStatement from '../components/TruthStatement'
import DiagnosticCTA from '../components/DiagnosticCTA'
import AboutKetan from '../components/AboutKetan'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

// Page arc:
// 1. Hero          — The uncomfortable truth: teams are shrinking, thinking is the differentiator
// 2. TruthStatement — Why this is real, what it looks like at every career stage, what good looks like
// 3. DiagnosticCTA — Find out where you stand. Free. 4 minutes.
// 4. AboutKetan    — The person qualified to evaluate you
// 5. FAQ + Footer
//
// Transformation + CohortDetails intentionally absent from landing page.
// They appear only on /evaluation — after the user has felt their own gaps.

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <TruthStatement />
      <DiagnosticCTA />
      <AboutKetan />
      <FAQ />
      <Footer />
    </main>
  )
}
