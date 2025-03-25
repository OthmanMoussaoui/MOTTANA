"use client"

import Image from 'next/image';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { HiX, HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import type { Dictionary } from '@/lib/types';

// Projects data
const projects = [
  {
    id: 1,
    title: 'Unity in Diversity: South Meets North',
    titleAr: 'وحدة التنوع: التقاء الجنوب بالشمال',
    description: 'Cultural and architectural interaction between Marrakech and Chefchaouen, two cities representing North and South Morocco.',
    descriptionAr: 'تعكس هذه الصورة التفاعل الثقافي والمعماري بين مراكش وشفشاون، وهما مدينتان تمثلان شمال وجنوب المغرب.',
    image: '/images/South_Morocco_meets_the_North_Morocco.png',
    categories: ['ai', 'architecture', 'culture'],
  },
  // ... rest of the projects array ...
];

interface GalleryClientProps {
  dictionary: Dictionary;
  locale: string;
  isArabic: boolean;
}

export default function GalleryClient({ dictionary, locale, isArabic }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? projects.length - 1 : selectedImage - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === projects.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <Layout dictionary={dictionary} locale={locale}>
      <div className="relative bg-white py-8 sm:py-12">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-zellige-pattern opacity-5"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {dictionary.gallery.title}
              </h1>
              <div className="mt-2 h-1 bg-gradient-to-r from-morocco-red-500 via-morocco-blue-500 to-morocco-green-500 rounded"></div>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              {isArabic 
                ? 'مجموعة من المشاريع التي تجمع بين الذكاء الاصطناعي والثقافة المغربية' 
                : 'A collection of AI-generated projects reflecting Moroccan cultural heritage'}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={project.image}
                    alt={isArabic ? project.titleAr : project.title}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {isArabic ? project.titleAr : project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            onClick={handleCloseModal}
          >
            <HiX className="h-6 w-6" />
          </button>
          
          <button 
            className="absolute left-4 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            onClick={handlePrevImage}
          >
            <HiArrowLeft className="h-6 w-6" />
          </button>
          
          <button 
            className="absolute right-4 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            onClick={handleNextImage}
          >
            <HiArrowRight className="h-6 w-6" />
          </button>
          
          <div className="max-w-6xl w-full mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-2/3">
              <Image
                src={projects[selectedImage].image}
                alt={isArabic ? projects[selectedImage].titleAr : projects[selectedImage].title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain max-h-[80vh]"
              />
            </div>
            
            <div className="w-full md:w-1/3 text-white">
              <h2 className="text-2xl font-bold mb-4">
                {isArabic ? projects[selectedImage].titleAr : projects[selectedImage].title}
              </h2>
              <p className="mb-4 text-gray-300">
                {isArabic ? projects[selectedImage].descriptionAr : projects[selectedImage].description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {projects[selectedImage].categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center rounded-full bg-morocco-blue-800 bg-opacity-50 px-3 py-1 text-sm font-medium text-white"
                  >
                    {category === 'ai' && dictionary.gallery.filters.ai}
                    {category === 'culture' && dictionary.gallery.filters.culture}
                    {category === 'design' && dictionary.gallery.filters.design}
                    {category === 'architecture' && (isArabic ? 'عمارة' : 'Architecture')}
                    {category === 'crafts' && (isArabic ? 'حرف يدوية' : 'Crafts')}
                    {category === 'social' && (isArabic ? 'اجتماعي' : 'Social')}
                    {category === 'traditions' && (isArabic ? 'تقاليد' : 'Traditions')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 