import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diagnostic from './pages/Diagnostic'
import Evaluation from './pages/Evaluation'
import Lab from './pages/Lab'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
    </BrowserRouter>
  )
}
