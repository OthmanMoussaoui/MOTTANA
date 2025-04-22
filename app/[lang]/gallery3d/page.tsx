"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getDictionary } from "@/lib/dictionaries"
import PageHeader from "@/components/page-header"
import dynamic from "next/dynamic"

// Import the Gallery3D component dynamically to avoid SSR issues with Three.js
const Gallery3DComponent = dynamic(
  () => import("@/components/gallery-3d"),
  { ssr: false }
)

export default function Gallery3DPage() {
  const { lang } = useParams()
  const [dict, setDict] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDictionary() {
      try {
        const dictionary = await getDictionary(lang as "en" | "ar")
        setDict(dictionary)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load dictionary:", err)
        setError("Failed to load gallery content. Please try again later.")
        setLoading(false)
      }
    }
    
    loadDictionary()
  }, [lang])

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading 3D Gallery...</h1>
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4">Please wait while we prepare the immersive Moroccan experience.</p>
      </div>
    )
  }

  if (error || !dict) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
        <p>{error || "Something went wrong. Please try again later."}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={dict.gallery3d.title} 
        description={dict.gallery3d.description} 
      />
      
      <div className="my-8 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-lg p-6 shadow-md">
        <div className="relative w-full border-4 border-amber-600/30 rounded-lg shadow-lg overflow-hidden">
          <Gallery3DComponent dict={dict} lang={lang as string} />
        </div>
        
        <div className="mt-8 max-w-3xl mx-auto bg-white/80 dark:bg-black/50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-amber-700 dark:text-amber-400">{dict.gallery3d.aboutMoroccanGallery || "About This Moroccan Gallery"}</h2>
          <p className="mb-3 text-sm">
            {dict.gallery3d.galleryDescription || 
              "This interactive 3D gallery showcases the rich cultural heritage of Morocco through a collection of artworks and traditional architectural elements. The space is designed to reflect authentic Moroccan aesthetics with elements like zellige tilework, horseshoe arches, and traditional lighting."}
          </p>
          <p className="text-sm mb-4">
            {dict.gallery3d.immersiveExperience || 
              "Immerse yourself in this virtual Moroccan riad and discover the beauty of Moroccan art, craftsmanship, and architectural traditions. Navigate the space in either first-person or orbit view modes for different perspectives."}
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md">
            <h3 className="text-md font-semibold mb-2 text-amber-700 dark:text-amber-400">{dict.gallery3d.artisticElements || "Featured Moroccan Artistic Elements"}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>{dict.gallery3d.zellige || "Zellige - Geometric mosaic tilework"}</li>
              <li>{dict.gallery3d.arches || "Horseshoe arches - Distinctive Moroccan architectural feature"}</li>
              <li>{dict.gallery3d.lanterns || "Moroccan lanterns with traditional filigree patterns"}</li>
              <li>{dict.gallery3d.fountain || "Central fountain - A feature of traditional Moroccan riads"}</li>
              <li>{dict.gallery3d.colors || "Rich color palette featuring blues, terracotta, and gold"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
