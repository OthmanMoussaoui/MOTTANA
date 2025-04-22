import { getDictionary } from "@/lib/dictionaries"
import HeroSection from "@/components/hero-section"
import FeaturedProjects from "@/components/featured-projects"
import NewsletterSection from "@/components/newsletter-section"

export default async function Home({ params: { lang } }: { params: { lang: "en" | "ar" } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen">
      <HeroSection dict={dict} lang={lang} />
      <FeaturedProjects dict={dict} lang={lang} />
      <NewsletterSection dict={dict} lang={lang} />
    </div>
  )
}
