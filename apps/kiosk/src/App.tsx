import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Splash from './screens/Splash'
import Home from './screens/Home'
import Setup from './screens/Setup'
import Preflight from './screens/Preflight'
import Positioning from './screens/Positioning'
import Reader from './screens/Reader'
import Guardian from './screens/Guardian'
import Library from './screens/Library'
import ShowcasePreview from './screens/Showcase'
import Settings from './screens/Settings'
import About from './screens/About'

const LiveScan = React.lazy(() => import('./screens/LiveScan'))
const Reveal = React.lazy(() => import('./screens/Reveal'))

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <React.Suspense fallback={<div className="fixed inset-0 bg-ink-950" />}>
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/preflight" element={<Preflight />} />
        <Route path="/positioning" element={<Positioning />} />
        <Route path="/scan" element={<LiveScan />} />
        <Route path="/reveal" element={<Reveal />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/guardian" element={<Guardian />} />
        <Route path="/library" element={<Library />} />
        <Route path="/showcase" element={<ShowcasePreview />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        </Routes>
      </React.Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ink-950 text-text-main overflow-hidden relative">
        <AnimatedRoutes />
      </div>
    </Router>
  )
}
