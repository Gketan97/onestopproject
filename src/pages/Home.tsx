import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TruthStatement from '../components/TruthStatement'
import DiagnosticCTA from '../components/DiagnosticCTA'
import Transformation from '../components/Transformation'
import AboutKetan from '../components/AboutKetan'
import CohortDetails from '../components/CohortDetails'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <TruthStatement />
      <DiagnosticCTA />
      <Transformation />
      <AboutKetan />
      <CohortDetails />
      <FAQ />
      <Footer />
    </main>
  )
}
