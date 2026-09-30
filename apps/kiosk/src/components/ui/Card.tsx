import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from './Button'

interface CardProps extends HTMLMotionProps<"div"> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-ink-900 rounded-[24px] border border-line p-6 relative overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="noise-bg absolute inset-0 pointer-events-none opacity-50" />
        <div className="relative z-10">{props.children as React.ReactNode}</div>
      </motion.div>
    )
  }
)
Card.displayName = "Card"
