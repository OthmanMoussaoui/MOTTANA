"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"

interface NavigationProps {
  dict: {
    navigation: {
      home: string
      gallery: string
      gallery3d: string
      gallery3dHilbert: string
      about: string
    }
  }
  lang: string
}

export default function Navigation({ dict, lang }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === `/${lang}${path}`
  }

  const navItems = [
    { href: "", label: dict.navigation.home },
    { href: "/gallery", label: dict.navigation.gallery },
    { href: "/gallery3d", label: dict.navigation.gallery3d },
    { href: "/gallery3d-hilbert", label: dict.navigation.gallery3dHilbert },
    { href: "/about", label: dict.navigation.about },
  ]

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href={`/${lang}`}>
            <motion.div
              className="font-bold text-gradient-primary text-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              MOTTANA
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.div className="hidden md:flex space-x-8" variants={navVariants} initial="hidden" animate="visible">
            {navItems.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={`/${lang}${item.href}`}
                  className={`font-medium transition-colors relative ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-moroccan-terracotta to-moroccan-yellow"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Navigation Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden pt-4 pb-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <Link
                  href={`/${lang}${item.href}`}
                  className={`block py-2 font-medium ${isActive(item.href) ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
