import { getDictionary } from "@/lib/dictionaries"
import AboutContent from "@/components/about-content"
import PageHeader from "@/components/page-header"

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as "en" | "ar")

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title={dict.about.title} description={dict.about.description} />
      <AboutContent dict={dict} lang={params.lang} />
    </div>
  )
}
