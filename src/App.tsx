import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diagnostic from './pages/Diagnostic'
import Evaluation from './pages/Evaluation'
import CaseStudy from './pages/CaseStudy'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/case-study" element={<CaseStudy />} />
      </Routes>
    </BrowserRouter>
  )
}
