import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './lib/i18n';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If there's no locale in the pathname
  if (pathnameIsMissingLocale) {
    // Get the preferred locale from the Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => isValidLocale(lang.substring(0, 2)));

    // Use the preferred locale or default
    const locale = preferredLocale || defaultLocale;

    // Create a new URL with the locale
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}; 