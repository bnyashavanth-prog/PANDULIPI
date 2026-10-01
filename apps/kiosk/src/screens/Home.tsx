import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { BookOpen, Shield, Globe, Settings, ScanLine, Info } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <motion.div 
      className="min-h-screen relative flex flex-col p-8 noise-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      {/* Background lamplight & motes would go here */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-radial-glow from-lamp-glow/10 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 space-y-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          {/* Animated pulsing ring for start button */}
          <div className="relative group">
            <motion.div 
              className="absolute inset-0 bg-saffron-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <Button size="lg" className="px-16 text-2xl h-20 shadow-xl shadow-saffron-500/20" onClick={() => navigate('/setup')}>
              <ScanLine className="mr-4" size={32} />
              Start a scan
            </Button>
          </div>
          <p className="mt-6 text-text-muted text-lg">Your manuscripts stay on this device unless you choose to share.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
          {[
            { icon: BookOpen, title: 'Library', desc: 'Past scans', to: '/library' },
            { icon: Shield, title: 'Guardian', desc: 'Environment', to: '/guardian' },
            { icon: Globe, title: 'Showcase', desc: 'Exports', to: '/showcase' },
            { icon: Settings, title: 'Settings', desc: 'Config', to: '/settings' },
            { icon: Info, title: 'About', desc: 'Safety & Info', to: '/about' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card 
                className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-ink-800 transition-colors group h-full"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.to)}
              >
                <div className="p-4 bg-ink-800 rounded-full text-saffron-300 mb-4 group-hover:bg-ink-700 transition-colors shadow-lg">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-display text-text-main">{item.title}</h3>
                <p className="text-sm text-text-muted mt-1">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
