import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, ArrowRight, Play, Volume2, Globe, Keyboard as KeyboardIcon, Languages } from 'lucide-react'

// Dummy interfaces
interface Word { text: string; conf: number; bbox: string; alts: string[]; status: 'machine' | 'confirmed' }
interface Line { line_id: number; index: number; words: Word[] }

export default function Reader() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([])
  const [activeLine, setActiveLine] = useState(0)
  const [selectedWord, setSelectedWord] = useState<{word: Word, lineIdx: number, wordIdx: number} | null>(null)
  const [script, setScript] = useState<'Original' | 'Devanagari' | 'Kannada' | 'Latin'>('Original')
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => {
    // Fetch mock data
    fetch('http://localhost:8000/scans/1/text')
      .then(res => res.json())
      .then(data => setLines(data.lines))
      .catch(console.error)
  }, [])

  const handleWordTap = (word: Word, lIdx: number, wIdx: number) => {
    if (lines[lIdx].words[0].status === 'confirmed') return // Line confirmed
    setSelectedWord({ word, lineIdx: lIdx, wordIdx: wIdx })
    setActiveLine(lIdx)
  }

  const confirmLine = () => {
    if (selectedWord) setSelectedWord(null)
    const newLines = [...lines]
    newLines[activeLine].words.forEach(w => w.status = 'confirmed')
    setLines(newLines)
    if (activeLine < lines.length - 1) {
      setActiveLine(activeLine + 1)
    }
  }

  const getConfColor = (conf: number, status: string) => {
    if (status === 'confirmed') return 'text-ok drop-shadow-[0_0_10px_rgba(61,190,122,0.8)]'
    if (conf >= 0.7) return 'text-ok'
    if (conf >= 0.4) return 'text-warn drop-shadow-[0_0_8px_rgba(242,179,61,0.5)]'
    return 'text-danger drop-shadow-[0_0_8px_rgba(229,86,74,0.5)]'
  }

  return (
    <div className="h-screen flex flex-col noise-bg bg-ink-950 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4 z-10 border-b border-ink-800 bg-ink-950">
        <Button variant="ghost" onClick={() => navigate('/reveal')}>
          <ArrowLeft className="mr-2" /> Viewer
        </Button>
        <div className="flex space-x-2 bg-ink-900 rounded-full p-1 border border-ink-800">
          {['Original', 'Devanagari', 'Kannada', 'Latin'].map(s => (
            <button 
              key={s} 
              onClick={() => setScript(s as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${script === s ? 'bg-ink-800 text-saffron-500' : 'text-text-muted hover:text-text-main'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={() => navigate('/guardian')}>
          Finish <ArrowRight className="ml-2" />
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Image Strip */}
        <div className="w-1/3 border-r border-ink-800 bg-black overflow-y-auto relative p-6 space-y-6">
          <div className="sticky top-0 bg-black/80 backdrop-blur pb-2 z-10">
            <span className="text-xs text-text-muted uppercase tracking-widest">Image Source</span>
          </div>
          {lines.map((line, i) => (
            <Card 
              key={line.line_id} 
              className={`p-1 relative overflow-hidden transition-all duration-300 cursor-pointer ${activeLine === i ? 'ring-2 ring-saffron-500 shadow-[0_0_20px_rgba(232,137,27,0.2)]' : 'opacity-50'}`}
              onClick={() => setActiveLine(i)}
            >
              {/* Dummy line image crop */}
              <div className="h-16 w-full bg-[url('/assets/leaf_RING.jpg')] bg-cover bg-center brightness-150 contrast-125 sepia" />
              {/* Animated SVG line highlight */}
              {activeLine === i && (
                <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.rect x="5%" y="10%" width="90%" height="80%" fill="none" stroke="var(--color-saffron-500)" strokeWidth="2" strokeDasharray="5 5" animate={{ strokeDashoffset: [0, 20] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                </motion.svg>
              )}
            </Card>
          ))}
        </div>

        {/* Right: Text Reader Panel */}
        <div className="w-2/3 flex flex-col relative bg-ink-950">
          
          <div className="absolute top-4 right-4 z-20 flex space-x-4">
             <div className="bg-warn/10 border border-warn text-warn px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
               DEMO DATA
             </div>
             <Button variant="secondary" className="h-10 px-4 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
               {isPlaying ? <Volume2 className="mr-2 text-saffron-500 animate-pulse" size={16} /> : <Play className="mr-2" size={16} />}
               {isPlaying ? 'Playing...' : 'Listen'}
             </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-12">
            {lines.map((line, i) => {
              const isConfirmed = line.words[0]?.status === 'confirmed'
              return (
                <motion.div 
                  key={line.line_id}
                  className={`relative p-8 rounded-2xl transition-colors ${activeLine === i ? 'bg-ink-900 border border-ink-800' : ''}`}
                  animate={{ opacity: (activeLine === i || isConfirmed) ? 1 : 0.4 }}
                >
                  <div className="absolute top-0 left-0 -mt-3 ml-6 bg-ink-950 px-2 text-xs text-text-muted">Line {i + 1}</div>
                  
                  {/* Waveform if playing & active */}
                  <AnimatePresence>
                    {isPlaying && activeLine === i && (
                      <motion.div className="absolute bottom-4 right-4 flex items-end space-x-1 h-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         {[1,2,3,4,5].map(b => (
                           <motion.div key={b} className="w-1 bg-saffron-500 rounded-t" animate={{ height: [4, 24, 4] }} transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: Math.random() }} />
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-wrap gap-x-4 gap-y-6">
                    {line.words.map((w, j) => (
                      <motion.span 
                        key={j}
                        onClick={() => handleWordTap(w, i, j)}
                        className={`font-display text-4xl lg:text-5xl cursor-pointer transition-colors ${getConfColor(w.conf, w.status)} ${script === 'Devanagari' ? 'font-devanagari-serif' : script === 'Kannada' ? 'font-kannada-serif' : 'font-display'}`}
                        whileHover={!isConfirmed ? { y: -2, scale: 1.05 } : {}}
                        initial={false}
                        animate={{ 
                          opacity: script === 'Original' ? 1 : 0, 
                          filter: script === 'Original' ? 'blur(0px)' : 'blur(4px)' 
                        }}
                      >
                        {script === 'Latin' ? `[${w.text}]` : w.text}
                      </motion.span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {isConfirmed ? <span className="text-ok flex items-center"><ArrowRight size={14} className="mr-1"/> Confirmed</span> : <span className="text-warn">Unverified</span>}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom Sheet for Correction */}
          <AnimatePresence>
            {selectedWord && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-ink-900 border-t border-ink-800 p-6 rounded-t-3xl shadow-[0_-20px_50px_rgba(10,14,34,0.8)] z-50 flex flex-col space-y-6"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm text-text-muted uppercase tracking-widest mb-2">Edit Word</h4>
                    <div className="text-4xl font-display text-lamp-glow">{selectedWord.word.text}</div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedWord(null)}>Cancel</Button>
                </div>
                
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {selectedWord.word.alts.map((alt, idx) => (
                    <Button key={idx} variant="secondary" onClick={() => {
                      // Mock update
                      const newLines = [...lines]
                      newLines[selectedWord.lineIdx].words[selectedWord.wordIdx].text = alt
                      newLines[selectedWord.lineIdx].words[selectedWord.wordIdx].conf = 1.0 // fixed
                      setLines(newLines)
                      setSelectedWord(null)
                    }}>
                      {alt}
                    </Button>
                  ))}
                  <Button variant="secondary"><KeyboardIcon size={18} className="mr-2"/> Type</Button>
                </div>

                <div className="w-full h-px bg-ink-800" />
                
                <Button size="lg" className="w-full bg-ok text-ink-950" onClick={confirmLine}>
                  Confirm entire line
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
