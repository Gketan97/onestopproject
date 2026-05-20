import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TruthStatement from '../components/TruthStatement'
import DiagnosticCTA from '../components/DiagnosticCTA'
import AboutKetan from '../components/AboutKetan'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

// Section order: Hero → Tension (cards) → CTA → Ketan trust → FAQ → Footer
// Roles table: removed (generic targeting backfires, cards do this better)
// Testimonials: add back once you have 1 real quote

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
