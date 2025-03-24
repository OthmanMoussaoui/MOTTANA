import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import type { Dictionary } from '@/lib/types';

interface LayoutProps {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: string;
}

export default function Layout({ children, dictionary, locale }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar dictionary={dictionary} locale={locale} />
      <main className="flex-grow">{children}</main>
      <Footer dictionary={dictionary} locale={locale} />
    </div>
  );
} 