import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import LanguageSwitcher from "@/components/language-switcher"
import Navigation from "@/components/navigation"
import { getDictionary } from "@/lib/dictionaries"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MOTTANA",
  description: "Showcasing AI projects through a Moroccan aesthetic lens",
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: "en" | "ar" }
}) {
  const lang = params.lang;
  const dict = await getDictionary(lang)
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <html lang={lang} dir={dir} className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="relative">
            <div className="absolute top-4 right-4 z-50">
              <LanguageSwitcher currentLang={lang} />
            </div>
            <Navigation dict={dict} lang={lang} />
            <main className="pt-16">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
