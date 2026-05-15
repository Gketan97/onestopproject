import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TruthStatement from '../components/TruthStatement'
import DiagnosticCTA from '../components/DiagnosticCTA'
import AboutKetan from '../components/AboutKetan'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

// Landing page arc:
// Feel the threat → understand why → challenge yourself → trust who built this
// Transformation + CohortDetails only on /evaluation — after user feels their gaps

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
