"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
// Remove the direct import of getDictionary
// import { getDictionary } from "@/lib/dictionaries"
import ProjectGallery from "@/components/project-gallery"
import PageHeader from "@/components/page-header"

// Define a type for your dictionary structure if you have one
// For simplicity, using 'any' here, but a specific type is recommended
type Dictionary = any;

export default function GalleryPage() {
  const params = useParams<{ lang: string }>()
  const lang = params.lang;

  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lang) return;

    const fetchDictionary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/dictionaries/${lang}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch dictionary: ${response.statusText}`);
        }
        const dictionaryData = await response.json();
        setDict(dictionaryData);
      } catch (err) {
        console.error("Failed to load dictionary:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, [lang]);

  if (!lang) {
    return <div>Loading language...</div>;
  }

  if (loading) {
    return <div>Loading dictionary...</div>; 
  }

  if (error) {
    return <div>Error loading dictionary: {error}</div>; 
  }

  if (!dict) {
    return <div>Dictionary not available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title={dict.gallery.title} description={dict.gallery.description} />
      <ProjectGallery dict={dict} lang={lang} />
    </div>
  )
}
