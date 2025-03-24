import Link from 'next/link';
import { HiMail } from 'react-icons/hi';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import type { Dictionary } from '@/lib/types';

interface FooterProps {
  dictionary: Dictionary;
  locale: string;
}

export default function Footer({ dictionary, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isRtl = locale === 'ar';
  
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 bg-zellige-pattern opacity-5"></div>
      
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-morocco-green-600 via-morocco-blue-600 to-morocco-red-600"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">
              Youth<span className="text-morocco-blue-400">Prize</span>
            </h2>
            <p className="mt-4 text-gray-300">
              {isRtl 
                ? 'استكشاف تقاطع تكنولوجيا الذكاء الاصطناعي والهوية الثقافية المغربية.'
                : 'Exploring the intersection of AI technology and Moroccan cultural identity.'}
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-morocco-blue-400 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-morocco-blue-400 transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-morocco-blue-400 transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-morocco-blue-400 transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white">{isRtl ? 'روابط' : 'Navigation'}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-300 hover:text-morocco-blue-300 transition-colors duration-200">
                  {dictionary.navigation.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/gallery`} className="text-gray-300 hover:text-morocco-blue-300 transition-colors duration-200">
                  {dictionary.navigation.gallery}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-300 hover:text-morocco-blue-300 transition-colors duration-200">
                  {dictionary.navigation.about}
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <p className="flex items-center text-gray-300">
                <HiMail className={`h-6 w-6 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                contact@youthprize.com
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} YouthPrize. {isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-sm text-gray-400 hover:text-morocco-blue-300 transition-colors duration-200">
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-sm text-gray-400 hover:text-morocco-blue-300 transition-colors duration-200">
              {isRtl ? 'شروط الاستخدام' : 'Terms of Use'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 