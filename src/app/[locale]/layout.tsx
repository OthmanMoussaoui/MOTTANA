import type { Metadata } from 'next';
import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { locales, isValidLocale, localeDirection } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Through a Moroccan Lens',
  description: 'Exploring the intersection of AI technology and Moroccan cultural identity',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  // Validate that the incoming locale is supported
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
} 