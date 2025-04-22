"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

interface NewsletterSectionProps {
  dict: any
  lang: string
}

export default function NewsletterSection({ dict, lang }: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add newsletter subscription logic here
    setSubmitted(true)
  }

  return (
    <div className="bg-gradient-to-r from-moroccan-blue/10 to-moroccan-terracotta/10">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-3xl mx-auto glass-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {!submitted ? (
            <>
              <h3 className="text-2xl font-bold text-center mb-6 text-gradient-primary">
                {lang === "en" ? "Stay Updated" : "ابق على اطلاع"}
              </h3>
              <p className="text-center text-muted-foreground mb-6">
                {lang === "en"
                  ? "Subscribe to our newsletter to receive the latest updates on AI and Moroccan art projects"
                  : "اشترك في نشرتنا الإخبارية لتلقي آخر التحديثات حول مشاريع الذكاء الاصطناعي والفن المغربي"}
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder={lang === "en" ? "Your email address" : "عنوان بريدك الإلكتروني"}
                  className="flex-grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-moroccan-blue to-moroccan-terracotta text-white group"
                >
                  {lang === "en" ? "Subscribe" : "اشترك"}
                  <Send className="ml-2 h-4 w-4 transition-all group-hover:translate-x-1" />
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle2 className="h-16 w-16 text-moroccan-green mb-4" />
              <h3 className="text-xl font-bold text-center">
                {lang === "en" ? "Thank you for subscribing!" : "شكراً للاشتراك!"}
              </h3>
              <p className="text-center text-muted-foreground mt-2">
                {lang === "en" ? "You'll receive our updates soon." : "ستتلقى تحديثاتنا قريباً."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
