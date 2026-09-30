import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, ArrowRight, Lock, BookOpen, Globe2 } from 'lucide-react'

export default function Setup() {
  const navigate = useNavigate()
  const [sharing, setSharing] = useState('private')

  return (
    <motion.div 
      className="min-h-screen flex flex-col p-8 noise-bg bg-ink-950"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <header className="flex justify-between items-center mb-12 z-10">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-display">Bundle Setup</h2>
        <div className="w-24" /> {/* spacer */}
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto space-y-12 z-10">
        <section>
          <h3 className="text-xl mb-6 font-display text-lamp-glow">Scan NFC or Enter ID</h3>
          <Card className="flex items-center justify-between p-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-ink-800 rounded-full flex items-center justify-center relative">
                <motion.div 
                  className="absolute inset-0 border-2 border-saffron-500 rounded-full"
                  animate={{ scale: [1, 1.5, 2], opacity: [1, 0, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <span className="text-saffron-300">RFID</span>
              </div>
              <div>
                <p className="text-lg font-medium">Waiting for bundle tag...</p>
                <p className="text-text-muted">Place tag near the reader</p>
              </div>
            </div>
            <Button variant="secondary">Manual Entry</Button>
          </Card>
        </section>

        <section>
          <h3 className="text-xl mb-6 font-display text-lamp-glow">Who may see this manuscript?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'private', icon: Lock, title: 'Private', desc: 'Stays on device only.' },
              { id: 'research', icon: BookOpen, title: 'Researchers', desc: 'Available to approved scholars.' },
              { id: 'public', icon: Globe2, title: 'Everyone', desc: 'Can be exported to Showcase.' }
            ].map(level => (
              <Card 
                key={level.id}
                onClick={() => setSharing(level.id)}
                className={`cursor-pointer transition-all ${
                  sharing === level.id ? 'border-saffron-500 bg-ink-800 shadow-[0_0_20px_rgba(232,137,27,0.1)]' : 'border-line hover:border-text-muted'
                }`}
              >
                <level.icon className={`mb-4 ${sharing === level.id ? 'text-saffron-500' : 'text-text-muted'}`} size={32} />
                <h4 className="text-lg font-medium text-text-main">{level.title}</h4>
                <p className="text-sm text-text-muted mt-2">{level.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-auto flex justify-end z-10 pt-8">
        <Button size="lg" onClick={() => navigate('/preflight')}>
          Continue <ArrowRight className="ml-2" />
        </Button>
      </footer>
    </motion.div>
  )
}
