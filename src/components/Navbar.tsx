"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX, HiGlobe } from 'react-icons/hi';
import { locales } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';

interface NavbarProps {
  dictionary: Dictionary;
  locale: string;
}

export default function Navbar({ dictionary, locale }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Get the path without the locale prefix
  const path = pathname.replace(`/${locale}`, '') || '/';
  
  // Create path for alternative locale
  const getAlternateLocale = () => {
    return locales.find(l => l !== locale) || locales[0];
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: dictionary.navigation.home, href: `/${locale}` },
    { name: dictionary.navigation.gallery, href: `/${locale}/gallery` },
    { name: dictionary.navigation.about, href: `/${locale}/about` },
  ];

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 dark:text-white relative">
      {/* Decorative zellige-inspired border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-morocco-red-600 via-morocco-blue-600 to-morocco-green-600"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href={`/${locale}`} className="text-xl font-bold">
                Youth<span className="text-morocco-blue-600">Prize</span>
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'bg-morocco-blue-600 text-white'
                    : 'text-gray-700 hover:bg-morocco-blue-50 hover:text-morocco-blue-700 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={`/${getAlternateLocale()}${path}`}
              className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-morocco-sand-100 hover:text-morocco-sand-800 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <HiGlobe className="h-5 w-5 mr-1" />
              {getAlternateLocale() === 'ar' ? 'العربية' : 'English'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-morocco-blue-50 hover:text-morocco-blue-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-morocco-blue-600 text-white'
                    : 'text-gray-700 hover:bg-morocco-blue-50 hover:text-morocco-blue-700 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={`/${getAlternateLocale()}${path}`}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-morocco-sand-100 hover:text-morocco-sand-800 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              <HiGlobe className="h-5 w-5 mr-1" />
              {getAlternateLocale() === 'ar' ? 'العربية' : 'English'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 