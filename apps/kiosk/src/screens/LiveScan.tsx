import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Lock, Navigation } from 'lucide-react'

// Dummy WS Hook
function useScanStatus() {
  const [state, setState] = useState('capturing')
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('Capture')
  const [posMm, setPosMm] = useState(0)
  const [activeLight, setActiveLight] = useState('N')
  const [activeTile, setActiveTile] = useState(0)
  const [completedTiles, setCompletedTiles] = useState<number[]>([])

  useEffect(() => {
    // We would use an actual WebSocket here, but we fetch to trigger the mock sequence
    fetch('https://pandulipi.onrender.com/scan/start', { method: 'POST' }).catch(console.error)

    // And simulate the incoming WS events instead of dealing with actual WS in mock for UI brevity
    let i = 0
    const sequence = async () => {
      setState('capturing')
      setStage('Capture')
      const lights = ['N', 'E', 'S', 'W', 'RING', 'IR']
      for(let t=0; t<4; t++) {
        setActiveTile(t)
        setPosMm(t * 50)
        for(let l of lights) {
          setActiveLight(l)
          await new Promise(r => setTimeout(r, 200))
        }
        setCompletedTiles(prev => [...prev, t])
        setProgress(((t+1)/4) * 100)
      }

      setState('stitching')
      setStage('Stitch')
      for(let p=0; p<=100; p+=10) { setProgress(p); await new Promise(r => setTimeout(r, 100)) }

      setState('enhancing')
      setStage('Enhance')
      for(let p=0; p<=100; p+=10) { setProgress(p); await new Promise(r => setTimeout(r, 100)) }

      setState('reading')
      setStage('Read')
      for(let p=0; p<=100; p+=10) { setProgress(p); await new Promise(r => setTimeout(r, 100)) }

      setState('review')
    }
    sequence()
  }, [])

  return { state, progress, stage, posMm, activeLight, activeTile, completedTiles, totalTiles: 4 }
}

export default function LiveScan() {
  const navigate = useNavigate()
  const { state, progress, stage, posMm, activeLight, activeTile, completedTiles, totalTiles } = useScanStatus()

  // Stepper UI
  const stages = ['Capture', 'Stitch', 'Enhance', 'Read', 'Review']
  const stageIdx = stages.indexOf(stage)

  // Hold-to-abort logic
  const [abortProgress, setAbortProgress] = useState(0)
  
  useEffect(() => {
    if (state === 'review') {
      const timer = setTimeout(() => navigate('/reveal'), 1500)
      return () => clearTimeout(timer)
    }
  }, [state, navigate])

  return (
    <motion.div 
      className="h-screen flex flex-col p-6 noise-bg bg-ink-950 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top Stepper */}
      <header className="flex justify-between items-center mb-6 z-10 px-4">
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-8 relative w-full max-w-4xl justify-between">
            {/* Morphing progress line behind steps */}
            <div className="absolute left-0 right-0 h-1 bg-ink-800 top-1/2 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute left-0 h-1 bg-saffron-500 top-1/2 -translate-y-1/2 z-0" 
              initial={{ width: 0 }}
              animate={{ width: `${(stageIdx / (stages.length - 1)) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            />

            {stages.map((s, i) => {
              const active = i <= stageIdx
              const current = i === stageIdx
              return (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      active ? 'bg-saffron-500 border-saffron-500 text-ink-950' : 'bg-ink-950 border-ink-800 text-text-muted'
                    }`}
                    animate={{ scale: current ? 1.2 : 1 }}
                  >
                    {i + 1}
                  </motion.div>
                  <span className={`absolute top-10 text-sm font-medium ${active ? 'text-saffron-300' : 'text-text-muted'}`}>
                    {s}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Stage */}
      <div className="flex-1 flex gap-6 z-10 mt-6 relative h-full max-h-[calc(100vh-140px)]">
        {/* LEFT: Camera Viewport (62%) */}
        <Card className="flex-[0.62] relative p-0 overflow-hidden bg-black flex flex-col border-ink-800">
          <div className="absolute inset-0 opacity-50 bg-[url('/assets/leaf_phone.jpg')] bg-cover bg-center" />
          
          {/* Scanline Sweep if capturing */}
          <AnimatePresence>
            {state === 'capturing' && (
              <motion.div 
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-saffron-500/20 to-transparent z-10"
                initial={{ x: "-100%" }}
                animate={{ x: "800%" }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {/* Stitching / Enhancing Overlay */}
          <AnimatePresence>
            {(state === 'stitching' || state === 'enhancing' || state === 'reading') && (
              <motion.div 
                className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="w-48 h-2 bg-ink-800 rounded-full overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-saffron-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </motion.div>
                <p className="mt-4 text-xl font-display text-lamp-glow animate-pulse">
                  {state === 'stitching' ? 'Stitching tiles...' : state === 'enhancing' ? 'Relighting...' : 'Reading text...'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <span className="font-mono text-saffron-500 bg-black/50 px-3 py-1 rounded">TILE {activeTile + 1}/{totalTiles}</span>
            <div className="flex space-x-1">
               <div className="w-4 h-4 border-l-2 border-t-2 border-saffron-500" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
            <div className="flex space-x-1">
               <div className="w-4 h-4 border-l-2 border-b-2 border-saffron-500" />
            </div>
            <div className="flex space-x-1">
               <div className="w-4 h-4 border-r-2 border-b-2 border-saffron-500" />
            </div>
          </div>
        </Card>

        {/* RIGHT: Status Dashboard (38%) */}
        <div className="flex-[0.38] flex flex-col gap-6">
          
          {/* Leaf Map */}
          <Card className="flex-1 flex flex-col p-4 border-ink-800">
            <h3 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider">Map</h3>
            <div className="flex-1 relative flex items-center justify-center bg-ink-950/50 rounded-xl overflow-hidden">
              <svg viewBox="0 0 100 20" className="w-[80%] h-auto opacity-20">
                <rect x="0" y="0" width="100" height="20" rx="10" fill="currentColor" />
              </svg>
              {/* Tile grid */}
              <div className="absolute inset-0 flex items-center justify-center space-x-1 p-8">
                {Array.from({length: totalTiles}).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className={`flex-1 h-12 rounded border ${completedTiles.includes(i) ? 'border-ok bg-ok/20' : activeTile === i ? 'border-saffron-500 bg-saffron-500/20' : 'border-ink-700 bg-transparent'}`}
                    animate={activeTile === i ? { scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Light Compass */}
          <Card className="flex-1 flex flex-col p-4 border-ink-800">
            <h3 className="text-sm font-medium text-text-muted mb-4 uppercase tracking-wider flex justify-between">
              Light Compass <Lock size={16} className="text-danger" />
            </h3>
            <div className="flex-1 relative flex items-center justify-center">
               <div className="w-32 h-32 rounded-full border-2 border-ink-800 flex items-center justify-center relative">
                  {['N', 'E', 'S', 'W'].map((dir, i) => {
                    const angles = {'N': -90, 'E': 0, 'S': 90, 'W': 180}
                    const active = activeLight === dir
                    return (
                      <motion.div 
                        key={dir} 
                        className={`absolute w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full bg-ink-950 transition-colors ${active ? 'text-saffron-500 border border-saffron-500 shadow-[0_0_15px_rgba(232,137,27,0.5)]' : 'text-text-muted border border-ink-700'}`}
                        style={{
                          transform: `rotate(${angles[dir as keyof typeof angles]}deg) translateX(4rem) rotate(${-angles[dir as keyof typeof angles]}deg)`
                        }}
                      >
                        {dir}
                      </motion.div>
                    )
                  })}
                  <div className={`absolute flex flex-col items-center justify-center w-12 h-12 rounded-full ${['RING','IR'].includes(activeLight) ? 'bg-saffron-500 text-ink-950' : 'bg-ink-800 text-text-muted'}`}>
                    <span className="text-[10px] font-bold">{['RING','IR'].includes(activeLight) ? activeLight : 'OFF'}</span>
                  </div>
               </div>
            </div>
          </Card>

          {/* Carriage Track */}
          <Card className="h-24 p-4 border-ink-800 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Carriage (mm)</h3>
            <div className="relative w-full h-2 bg-ink-800 rounded-full mt-2">
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-text-main rounded shadow cursor-pointer"
                animate={{ left: `${(posMm / 200) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-muted font-mono">
              <span>0</span>
              <span>200</span>
            </div>
          </Card>

        </div>
      </div>
    </motion.div>
  )
}
