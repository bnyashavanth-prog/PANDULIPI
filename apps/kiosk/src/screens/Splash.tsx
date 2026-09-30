import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()
  const [skipped, setSkipped] = useState(false)

  const handleSkip = () => {
    if (!skipped) {
      setSkipped(true)
      navigate('/home')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSkip()
    }, 3200)
    return () => clearTimeout(timer)
  }, [skipped])

  return (
    <motion.div 
      className="fixed inset-0 bg-ink-950 flex flex-col items-center justify-center cursor-pointer z-50 noise-bg"
      onClick={handleSkip}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      {/* Background Breathing Lamp Glow */}
      <motion.div 
        className="absolute inset-0 bg-radial-glow opacity-30 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--color-lamp-glow) 0%, transparent 60%)"
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3.2, ease: "easeInOut" }}
      />
      
      {/* Mandala SVG Drawing itself */}
      <motion.svg width="200" height="200" viewBox="0 0 100 100" className="absolute opacity-20">
        <motion.circle 
          cx="50" cy="50" r="40" 
          stroke="var(--color-saffron-500)" 
          strokeWidth="1" 
          fill="none" 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path 
          d="M 50 10 L 50 90 M 10 50 L 90 50 M 21.7 21.7 L 78.3 78.3 M 21.7 78.3 L 78.3 21.7"
          stroke="var(--color-saffron-500)" 
          strokeWidth="0.5" 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
        />
      </motion.svg>

      {/* Word Incision Reveal */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1 
          className="text-6xl font-display tracking-widest text-lamp-glow"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        >
          PANDULIPI
        </motion.h1>
        
        {/* Tagline Fade */}
        <motion.p 
          className="text-lg text-saffron-300 mt-4 tracking-wide font-body"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Read the past before it turns to dust.
        </motion.p>
      </div>
    </motion.div>
  )
}
