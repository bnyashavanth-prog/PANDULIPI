import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, ArrowRight, ScanLine } from 'lucide-react'

export default function Positioning() {
  const navigate = useNavigate()
  const [aligned, setAligned] = useState(false)

  useEffect(() => {
    // Simulate auto-detect alignment after a few seconds
    const timer = setTimeout(() => {
      setAligned(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div 
      className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <header className="flex justify-between items-center mb-6 z-10">
        <Button variant="ghost" onClick={() => navigate('/preflight')}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-display text-lamp-glow flex items-center">
          <ScanLine className="mr-3" /> Position Manuscript
        </h2>
        <div className="w-24" />
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col z-10 relative">
        <Card className="flex-1 w-full relative p-0 overflow-hidden bg-black flex items-center justify-center">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 bg-ink-900 opacity-50" />
          
          {/* Perspective Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />

          {/* Scale Bar Ruler */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[300px] h-2 border-x-2 border-b-2 border-saffron-500/50 flex justify-between px-1">
            <span className="text-xs text-saffron-500 mt-2 font-mono">0 mm</span>
            <span className="text-xs text-saffron-500 mt-2 font-mono">150 mm</span>
          </div>

          {/* Corner Brackets */}
          <motion.div 
            className={`absolute inset-16 border-2 border-dashed transition-colors duration-500 rounded-lg pointer-events-none ${aligned ? 'border-ok' : 'border-saffron-500/30'}`}
          />
          
          {/* Simulated Leaf Outline (Marching Ants) */}
          <AnimatePresence>
            {aligned && (
              <motion.svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.rect
                  x="20%" y="30%" width="60%" height="40%" rx="10"
                  fill="none"
                  stroke="var(--color-ok)"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              </motion.svg>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-xl font-medium drop-shadow-md text-white bg-black/40 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
              {aligned ? 'Perfectly aligned.' : 'Lay the leaf gently in the cradle. Do not press or bend it.'}
            </p>
          </div>
        </Card>
      </div>

      <footer className="mt-6 flex justify-end z-10">
        <Button size="lg" disabled={!aligned} onClick={() => navigate('/scan')} className={aligned ? 'bg-ok text-ink-950 shadow-[0_0_20px_rgba(61,190,122,0.4)]' : ''}>
          Lock & Scan <ArrowRight className="ml-2" />
        </Button>
      </footer>
    </motion.div>
  )
}
