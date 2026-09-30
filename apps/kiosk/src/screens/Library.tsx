import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, Book, ScanLine, Search, Tag } from 'lucide-react'

export default function Library() {
  const navigate = useNavigate()
  const [bundles, setBundles] = useState<any[]>([])
  const [nfcScanning, setNfcScanning] = useState(false)
  const [matchedId, setMatchedId] = useState<number | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('http://localhost:8000/bundles')
      .then(r => r.json())
      .then(d => setBundles(d.bundles))
      .catch(console.error)
  }, [])

  const simulateNFC = () => {
    setNfcScanning(true)
    setTimeout(() => {
      setNfcScanning(false)
      setMatchedId(1) // match the first bundle
      
      // Scroll into view logic would go here
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950 overflow-y-auto" ref={containerRef}>
      <header className="flex justify-between items-center mb-12">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <ArrowLeft className="mr-2" /> Home
        </Button>
        <h2 className="text-2xl font-display text-lamp-glow flex items-center">
          <Book className="mr-3" /> Library
        </h2>
        <Button variant="secondary" onClick={simulateNFC} className="relative overflow-hidden">
          {nfcScanning && (
            <motion.div 
              className="absolute inset-0 border-2 border-saffron-500 rounded-full"
              animate={{ scale: [1, 2, 3], opacity: [1, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
          <ScanLine className="mr-2" /> Scan NFC
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {bundles.map((b, i) => {
          const isMatched = matchedId === b.id
          return (
            <motion.div 
              key={b.id}
              layoutId={`bundle-${b.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all h-full ${
                  isMatched ? 'ring-4 ring-ok shadow-[0_0_30px_rgba(61,190,122,0.3)] bg-ink-800' : 'hover:bg-ink-900 border-ink-800'
                }`}
                onClick={() => navigate('/setup')} // in a real flow, go to bundle detail
              >
                {/* Concentric ripple feedback on match */}
                {isMatched && (
                  <motion.div 
                    className="absolute inset-0 bg-ok/20 pointer-events-none rounded-[24px]"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                )}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-ink-950 rounded-lg text-text-muted">
                    <Book size={24} />
                  </div>
                  {b.scans > 0 ? (
                    <span className="text-xs bg-saffron-500/20 text-saffron-500 px-2 py-1 rounded-full font-bold">
                      {b.scans} Scans
                    </span>
                  ) : (
                    <span className="text-xs bg-ink-800 text-text-muted px-2 py-1 rounded-full">
                      Empty
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-display text-text-main relative z-10">{b.title}</h3>
                
                <div className="mt-6 pt-4 border-t border-ink-800/50 flex justify-between text-sm text-text-muted relative z-10">
                  <span className="flex items-center"><Tag size={14} className="mr-1"/> {b.material}</span>
                  <span className="font-mono text-xs">{b.nfc_uid}</span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
