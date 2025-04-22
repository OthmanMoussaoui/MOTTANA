"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageHeader from '@/components/page-header'
import { getDictionary, Locale } from '@/lib/dictionaries'

// Simple loading component
const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// Dynamically import the Gallery3D component to avoid SSR issues with Three.js
const Gallery3DHilbert = dynamic(() => import('@/components/gallery3d-hilbert'), {
  ssr: false,
  loading: () => <Loading />
})

export default function Gallery3DPage() {
  const params = useParams()
  const lang = (params.lang as string) as Locale
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dict, setDict] = useState<any>(null)
  
  // Fetch dictionary data
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getDictionary(lang)
        setDict(dictionary)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load dictionary:', err)
        setError('Failed to load language data. Please try again later.')
        setIsLoading(false)
      }
    }
    
    loadDictionary()
  }, [lang])
  
  if (isLoading) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-[300px]">
          <Loading />
        </div>
      </div>
    )
  }
  
  if (error || !dict) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-red-500">Error</h3>
          <p>{error || 'Something went wrong. Please try again later.'}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <PageHeader 
        title={dict.gallery3d.title || "3D Gallery - Hilbert Maze"}
        description={dict.gallery3d.subtitle || "Explore Moroccan Art through a Hilbert Curve Maze"} 
      />
      
      <div className="mt-8">
        <Gallery3DHilbert dict={dict} lang={lang} />
      </div>
      
      <div className="mt-8 prose prose-amber dark:prose-invert max-w-none">
        <h2>{dict.gallery3d.aboutTitle || "About This Gallery"}</h2>
        <p>
          {dict.gallery3d.aboutDescription || "This 3D gallery features a unique layout based on the Hilbert curve - a continuous fractal space-filling curve. This maze-like structure creates an immersive exploration experience that reveals Moroccan artwork throughout the journey."}
        </p>
        <p>
          {dict.gallery3d.navigationNote || "Use your keyboard (WASD or arrow keys) to navigate and your mouse to look around. Use the V key to toggle between first-person and orbit view modes."}
        </p>
      </div>
    </div>
  )
} 