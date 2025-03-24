import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getDictionary } from '@/lib/getDictionary';
import Layout from '@/components/Layout';
import type { Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'AI Through a Moroccan Lens',
  description: 'Exploring AI through the lens of Moroccan culture and heritage',
};

// Featured projects from our gallery
const featuredProjects = [
  {
    id: 1,
    title: 'Unity in Diversity: South Meets North',
    titleAr: 'وحدة التنوع: التقاء الجنوب بالشمال',
    description: 'Cultural and architectural interaction between Marrakech and Chefchaouen.',
    descriptionAr: 'التفاعل الثقافي والمعماري بين مراكش وشفشاون.',
    image: '/images/South_Morocco_meets_the_North_Morocco.png',
  },
  {
    id: 9,
    title: 'Moroccan Equestrian Traditions: Tbourida Season',
    titleAr: 'تقاليد الفروسية المغربية: موسم التبوريدة',
    description: 'A stunning moment from the traditional Moroccan Tbourida performance.',
    descriptionAr: 'مشهد رائع من عرض التبوريدة المغربي التقليدي.',
    image: '/images/othmanotana_moroccan_tborida_show_a_festival_of_moroccans_rid_2e6b6e26-9a49-4959-a52e-81be4d1012ea_3.png',
  },
  {
    id: 8,
    title: 'Time Ornaments: Moroccan Tiles',
    titleAr: 'زخارف الزمن: بلاط مغربي',
    description: 'Traditional geometric Moroccan tile patterns reflecting centuries of craftsmanship.',
    descriptionAr: 'أنماط البلاط المغربي الهندسية التقليدية التي تعكس قرونًا من الحرفية.',
    image: '/images/othmanotana_Traditional_geometric_Moroccan_tile_patterns_in_v_3c96ff30-f618-4b48-a09e-3f9fdd57672d_0.png',
  },
];

export default async function Home({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  
  const dictionary = await getDictionary(locale as Locale);
  const isArabic = locale === 'ar';

  return (
    <Layout dictionary={dictionary} locale={locale}>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/othmanotana_A_cat_sitting_on_the_steps_of_an_ancient_blue_city.png"
            alt="Hero Background"
            fill
            className="object-cover brightness-50"
            priority
          />
          {/* Moroccan pattern overlay */}
          <div className="absolute inset-0 bg-zellige-pattern opacity-20"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {isArabic ? 'الذكاء الاصطناعي والفن: إبداع يعكس الهوية المغربية' : 'AI and Art: Creativity Reflecting Moroccan Identity'}
            </h1>
            <div className="mx-auto mt-4 h-1 w-32 bg-gradient-to-r from-morocco-red-500 via-morocco-blue-500 to-morocco-green-500 rounded"></div>
            <p className="mx-auto mt-6 max-w-xl text-center text-xl text-gray-300">
              {isArabic
                ? 'فن يجمع بين الإبداع البشري والذكاء الاصطناعي لإبراز جمال وتراث المغرب'
                : 'Art that combines human creativity and artificial intelligence to highlight the beauty and heritage of Morocco'}
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-sm justify-center gap-x-4">
            <Link
              href={`/${locale}/gallery`}
              className="rounded-md bg-morocco-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-morocco-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-morocco-blue-500 focus:ring-offset-2"
            >
              {dictionary.home.explore}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-morocco-blue-600 shadow-sm hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-morocco-blue-500 focus:ring-offset-2"
            >
              {dictionary.home.learnMore}
            </Link>
          </div>
        </div>
      </div>

      {/* Project Overview Section */}
      <div className="relative bg-white py-16 sm:py-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-zellige-pattern opacity-5"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {isArabic ? 'نظرة عامة على المشروع' : 'Project Overview'}
              </h2>
              <div className="mt-2 h-1 bg-gradient-to-r from-morocco-red-500 via-morocco-blue-500 to-morocco-green-500 rounded"></div>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              {isArabic 
                ? 'مشروع يهدف إلى دمج الذكاء الاصطناعي مع الفنون المغربية التقليدية لإنشاء صور فريدة تعكس هويتنا الثقافية'
                : 'A project aiming to merge AI with traditional Moroccan arts to create unique images that reflect our cultural identity'}
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isArabic ? 'منهجيتنا وتحدياتنا' : 'Our Methodology & Challenges'}
                </h3>
                <div className="mt-2 w-24 h-1 bg-morocco-clay-400 rounded"></div>
                <p className="mt-3 text-lg text-gray-500">
                  {isArabic 
                    ? 'استخدمنا أداة الذكاء الاصطناعي MidJourney لإنشاء صور بناءً على مطالبات نصية دقيقة تعكس الثقافة المغربية. واجهنا تحديات في فهم الذكاء الاصطناعي للعناصر الثقافية المغربية، وتغلبنا عليها من خلال صياغة مطالبات مفصلة وإجراء تجارب متعددة.'
                    : 'We used the AI tool MidJourney to generate images based on precise text prompts that reflect Moroccan culture. We faced challenges in the AI\'s understanding of Moroccan cultural elements, which we overcame by crafting detailed prompts and conducting multiple experiments.'}
                </p>
                <p className="mt-3 text-lg text-gray-500">
                  {isArabic 
                    ? 'نسعى إلى إظهار كيف يمكن للتكنولوجيا الحديثة أن تساهم في الحفاظ على الهوية الثقافية وإبرازها بطرق إبداعية جديدة.'
                    : 'We aim to demonstrate how modern technology can contribute to preserving cultural identity and highlighting it in new creative ways.'}
                </p>
              </div>
              <div className="overflow-hidden rounded-moroccan shadow-lg">
                <Image
                  src="/images/othmanotana_A_traditional_Moroccan_loom_stands_in_the_center_of_2b10046b-3040-4556-bbb4-3d3e98eb2a95.png"
                  alt="Traditional Moroccan Loom"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="bg-morocco-sand-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {dictionary.home.featuredProjects}
              </h2>
              <div className="mt-2 h-1 bg-gradient-to-r from-morocco-red-500 via-morocco-blue-500 to-morocco-green-500 rounded"></div>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              {isArabic 
                ? 'بعض أبرز الأعمال الفنية التي تم إنشاؤها باستخدام الذكاء الاصطناعي والمستوحاة من الثقافة المغربية'
                : 'Some of our featured artworks created using AI and inspired by Moroccan culture'}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col overflow-hidden rounded-moroccan shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <div className="flex-shrink-0">
                  <Image
                    className="h-48 w-full object-cover transition-transform hover:scale-110"
                    src={project.image}
                    alt={isArabic ? project.titleAr : project.title}
                    width={400}
                    height={200}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {isArabic ? project.titleAr : project.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      {isArabic ? project.descriptionAr : project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/gallery`}
              className="inline-flex items-center rounded-md border border-transparent bg-morocco-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-morocco-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-morocco-blue-500 focus:ring-offset-2"
            >
              {dictionary.home.viewAll}
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-morocco-blue-800 to-morocco-blue-700 relative overflow-hidden">
        {/* Moroccan pattern overlay */}
        <div className="absolute inset-0 bg-zellige-pattern opacity-10"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="block">
                {isArabic ? 'مهتم بالمشاركة؟' : 'Interested in participating?'}
              </span>
              <span className="block text-xl font-normal mt-2">
                {isArabic ? 'تواصل معنا اليوم وشارك في بناء مستقبل يجمع بين التكنولوجيا والثقافة المغربية' : 'Get in touch today and be part of building a future that combines technology and Moroccan culture'}
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-moroccan shadow">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-moroccan border border-transparent bg-white px-5 py-3 text-base font-medium text-morocco-blue-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  {dictionary.home.contactUs}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 