import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saffron-500/50 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-saffron-500 text-ink-950",
      secondary: "bg-ink-800 text-text-main border border-line",
      ghost: "bg-transparent text-text-main",
      danger: "bg-danger text-white"
    }

    const sizes = {
      sm: "h-12 px-4 text-sm rounded-full",
      md: "h-14 px-8 text-base rounded-full min-w-[120px]",
      lg: "h-16 px-10 text-lg rounded-full min-w-[160px]"
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
