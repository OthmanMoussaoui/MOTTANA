"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import Layout from '@/components/Layout';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { HiX, HiArrowLeft, HiArrowRight } from 'react-icons/hi';

// Projects data from the Latex directory
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
  {
    id: 2,
    title: 'Tale from Blue Alleys: Cat in Chefchaouen',
    titleAr: 'احكاية من الأزقة الزرقاء: القط في شفشاون',
    description: 'A cat sitting peacefully on the steps of an ancient blue city, capturing the beauty of traditional Moroccan architecture.',
    descriptionAr: 'تُظهر هذه الصورة قطة جالسة بهدوء على درجات مدينة زرقاء شفشاون. تجسد الصورة جمال الهندسة المعمارية المغربية التقليدية.',
    image: '/images/othmanotana_A_cat_sitting_on_the_steps_of_an_ancient_blue_city.png',
    categories: ['ai', 'culture'],
  },
  {
    id: 3,
    title: 'Mother and Hope: Al Haouz Earthquake Scene',
    titleAr: 'الأم والأمل: مشهد من زلزال الحوز',
    description: 'A powerful image of a Moroccan mother in traditional red dress, holding her child amid earthquake destruction.',
    descriptionAr: 'تُظهر هذه الصورة المؤثرة امرأة مغربية تحمل ابنها بين ذراعيها، في مشهد يعبّر عن الألم والأمل وسط الدمار الذي خلفه زلزال الحوز.',
    image: '/images/othmanotana_mother_in_traditional_Moroccan_red_dress_dusted__du_f2e2555c-8669-4c47-a650-b8f98478ccd0.png',
    categories: ['ai', 'culture', 'social'],
  },
  {
    id: 4,
    title: 'Dreams on Small Feet: The Child and Football',
    titleAr: 'حلم على أقدام صغيرة: الطفل وكرة القدم',
    description: 'A Moroccan child holding a football, symbolizing the cultural importance of sports in Moroccan society.',
    descriptionAr: 'تُظهر هذه الصورة طفلًا مغربيًا يحمل كرة في يده، مع خلفية تعكس أحد المعالم المغربية التقليدية.',
    image: '/images/othmanotana_A_middle-aged_child_holding_a_ball_in_his_hand_next_1f2d3b85-7f41-4334-9e3d-9295339acb47.png',
    categories: ['ai', 'culture', 'social'],
  },
  {
    id: 5,
    title: 'Childhood in the Alleys: Playing with One Bicycle',
    titleAr: 'طفولة بين الأزقة: اللعب بدراجة واحدة',
    description: 'Two Moroccan boys sharing a single bicycle, symbolizing cooperation in traditional communities.',
    descriptionAr: 'في هذه الصورة البسيطة والجميلة، نرى مشهدًا يوميًا من طفولة المغاربة في الأزقة التقليدية.',
    image: '/images/othmanotana_Photo_of_two_Moroccan_boys_playing_with_one_bicycle_17741675-8699-4286-b810-1b6145f6d6c5.png',
    categories: ['ai', 'social'],
  },
  {
    id: 6,
    title: 'Fabric of Handicrafts: Traditional Moroccan Weaver',
    titleAr: 'نسيج الحرف اليدوية: الحائك المغربي التقليدي',
    description: 'A traditional Moroccan woman working at an ancient loom, weaving a carpet with intricate patterns.',
    descriptionAr: 'في هذه الصورة، نرى مشهدًا يعبر عن البساطة والجمال في آن واحد، حيث تعمل امرأة مغربية تقليدية على نول قديم لصنع السجاد.',
    image: '/images/othmanotana_A_traditional_Moroccan_loom_stands_in_the_center_of_2b10046b-3040-4556-bbb4-3d3e98eb2a95.png',
    categories: ['ai', 'culture', 'crafts'],
  },
  {
    id: 7,
    title: 'Clay Heritage: Moroccan Pottery Craftsman',
    titleAr: 'تراث من الطين: الحرفي المغربي وصناعة الفخار',
    description: 'A skilled Moroccan craftsman working on traditional pottery in his workshop, preserving cultural heritage.',
    descriptionAr: 'تُظهر هذه الصورة حرفيًا مغربيًا يعمل بمهارة على صناعة الفخار التقليدي في ورشته.',
    image: '/images/othmanotana_A_traditional_Moroccan_fakhar_craftsman_working_on__73564925-59a7-458a-91e3-8a72619ea8dc.png',
    categories: ['ai', 'culture', 'crafts'],
  },
  {
    id: 8,
    title: 'Time Ornaments: Moroccan Tiles with Historical Colors',
    titleAr: 'زخارف الزمن: بلاط مغربي بألوان التاريخ',
    description: 'Traditional geometric Moroccan tile patterns that adorn homes and mosques, reflecting centuries of craftsmanship.',
    descriptionAr: 'تعرض هذه الصور مجموعة من الأنماط الهندسية التقليدية للبلاط المغربي، التي تزين الجدران والأرضيات في المنازل والمساجد المغربية.',
    image: '/images/othmanotana_Traditional_geometric_Moroccan_tile_patterns_in_v_3c96ff30-f618-4b48-a09e-3f9fdd57672d_0.png',
    categories: ['ai', 'design', 'architecture'],
  },
  {
    id: 9,
    title: 'Moroccan Equestrian Traditions: Tbourida Season',
    titleAr: 'تقاليد الفروسية المغربية: موسم التبوريدة',
    description: 'A stunning moment from the Moroccan Tbourida, where riders showcase strength and horsemanship in a traditional display.',
    descriptionAr: 'تجسد هذه الصورة مشهدًا رائعًا من فن التبوريدة المغربي، حيث يمتطي الفرسان خيولهم التقليدية مرتدين أزياء مغربية أصيلة.',
    image: '/images/othmanotana_moroccan_tborida_show_a_festival_of_moroccans_rid_2e6b6e26-9a49-4959-a52e-81be4d1012ea_3.png',
    categories: ['ai', 'culture', 'traditions'],
  },
  {
    id: 10,
    title: 'Astrology Pattern in Arabian Tiles',
    titleAr: 'نمط فلكي في البلاط العربي',
    description: 'Beautiful medieval Arabian tile patterns showing intricate geometric designs with astrological influences.',
    descriptionAr: 'أنماط بلاط عربية من العصور الوسطى تظهر تصاميم هندسية معقدة ذات تأثيرات فلكية.',
    image: '/images/othmanotana_astrology_pattern_beautiful_midevil_arabian_tile__4828e34d-87a2-407d-991b-87a35a7e8e62_2.png',
    categories: ['ai', 'design', 'architecture'],
  },
];

export default function GalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isArabic, setIsArabic] = useState(locale === 'ar');

  // Load dictionary asynchronously
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

          {/* Simple Gallery Grid */}
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