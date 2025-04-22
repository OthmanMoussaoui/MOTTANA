"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroSectionProps {
  dict: {
    home: {
      hero: {
        title: string
        subtitle: string
        cta: string
      }
      intro: {
        title: string
        description: string
      }
    }
  }
  lang: string
}

export default function HeroSection({ dict, lang }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create modern particles animation
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
    }[] = []

    // Generate particles
    const generateParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 10) // Responsive particle count
      const colors = ["#1a5f7a", "#c35831", "#e9b44c", "#4a7c59", "#f2d0a4"]

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    generateParticles()

    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(242, 208, 164, 0.05)")
      gradient.addColorStop(1, "rgba(26, 95, 122, 0.05)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Connect particles that are close to each other
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x
          const dy = particles[j].y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(195, 88, 49, ${0.05 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <div className="relative min-h-screen">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-4/5 -z-10" />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-modern" variants={itemVariants}>
            {dict.home.hero.title}
          </motion.h1>

          <motion.p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed" variants={itemVariants}>
            {dict.home.hero.subtitle}
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link href={`/${lang}/gallery`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-moroccan-blue to-moroccan-terracotta hover:from-moroccan-terracotta hover:to-moroccan-blue text-white transition-all duration-500 shadow-lg hover:shadow-xl group"
              >
                <span>{dict.home.hero.cta}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-24 max-w-4xl mx-auto glass-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="relative">
            <Sparkles className="absolute -top-6 -left-6 text-moroccan-yellow w-12 h-12 animate-pulse" />
            <h2 className="text-3xl font-bold mb-6 text-center text-gradient-primary">{dict.home.intro.title}</h2>
          </div>
          <p className="text-lg leading-relaxed">{dict.home.intro.description}</p>
        </motion.div>
      </div>
    </div>
  )
}
