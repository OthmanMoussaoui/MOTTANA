"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import Layout from '@/components/Layout';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';

// Timeline data
const timelineEvents = [
  {
    year: '2020',
    title: 'Project Inception',
    description: 'The idea to merge AI technology with Moroccan cultural elements was born',
  },
  {
    year: '2021',
    title: 'First Prototype',
    description: 'Development of our first AI model trained on Moroccan patterns',
  },
  {
    year: '2022',
    title: 'Public Launch',
    description: 'Launch of our platform showcasing AI-generated Moroccan-inspired art',
  },
  {
    year: '2023',
    title: 'Cultural Partnerships',
    description: 'Collaboration with Moroccan cultural institutions to preserve heritage',
  },
  {
    year: '2024',
    title: 'International Recognition',
    description: 'Our projects received international attention and awards',
  },
];

// Team members
const teamMembers = [
  {
    name: 'Ahmed Alaoui',
    role: 'Founder & AI Researcher',
    image: '/images/0_0.jpeg',
  },
  {
    name: 'Fatima Zahra',
    role: 'Cultural Heritage Expert',
    image: '/images/0_2.jpeg',
  },
  {
    name: 'Younes Berrada',
    role: 'Lead Developer',
    image: '/images/0_3.jpeg',
  },
];

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isArabic, setIsArabic] = useState(locale === 'ar');

  useEffect(() => {
    async function loadDictionary() {
      const dict = await getDictionary(locale as Locale);
      setDictionary(dict);
      setIsArabic(locale === 'ar');
    }
    loadDictionary();
  }, [locale]);

  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return (
    <Layout dictionary={dictionary} locale={locale}>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 to-indigo-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {dictionary.about.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {dictionary.about.vision.title}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {dictionary.about.vision.content}
              </p>
              <p className="mt-4 text-lg text-gray-500">
                {isArabic
                  ? 'نحن نؤمن بأن التكنولوجيا يمكن أن تساعد في الحفاظ على التراث الثقافي وتعزيزه، وليس استبداله. من خلال دمج الذكاء الاصطناعي مع الفنون المغربية التقليدية، نخلق تجارب رقمية فريدة تحتفل بالهوية المغربية وتجعلها متاحة للجمهور العالمي.'
                  : 'We believe technology can help preserve and enhance cultural heritage, not replace it. By blending AI with traditional Moroccan arts, we create unique digital experiences that celebrate Moroccan identity and make it accessible to a global audience.'}
              </p>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/images/image.png"
                  alt="Our vision"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey/Timeline Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {dictionary.about.timeline?.title || (isArabic ? 'رحلتنا' : 'Our Journey')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              {isArabic
                ? 'نظرة على التطور التاريخي لمشروعنا'
                : 'A look at the historical development of our project'}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-blue-200"></div>
            
            {timelineEvents.map((event, index) => (
              <div key={index} className={`relative mb-12 ${
                index % 2 === 0 ? 'md:ml-auto md:pl-16 md:pr-0' : 'md:mr-auto md:pr-16 md:pl-0'
              } md:w-1/2`}>
                <div className="absolute left-1/2 -ml-3 h-6 w-6 -translate-x-1/2 transform rounded-full bg-blue-600"></div>
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <span className="text-sm font-bold text-blue-600">{event.year}</span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">{event.title}</h3>
                  <p className="mt-2 text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {dictionary.about.team.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              {isArabic 
                ? 'مجموعة من المتخصصين المكرسين لدمج التكنولوجيا بالتراث المغربي' 
                : 'A dedicated group of specialists merging technology with Moroccan heritage'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-48 w-48 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
} 