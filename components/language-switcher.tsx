"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = () => {
    const newLang = currentLang === "en" ? "ar" : "en"
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPathname)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <Button
        onClick={switchLanguage}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/95 transition-all"
      >
        <Globe size={16} className="text-moroccan-blue" />
        <span className={`text-sm ${currentLang === "ar" ? "text-gradient-primary" : "text-gradient-secondary"}`}>
          {currentLang === "en" ? "العربية" : "English"}
        </span>
      </Button>
    </motion.div>
  )
}
