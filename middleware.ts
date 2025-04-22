import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// List of supported locales
const locales = ["en", "ar"]
const defaultLocale = "en"

// Get the preferred locale from the request
function getLocale(request: NextRequest) {
  // For simplicity, we're using a basic implementation
  // In a production app, you'd want to use the Negotiator library properly
  const acceptLanguage = request.headers.get("accept-language") || ""

  // Check if the user has a preferred locale in cookies
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Fallback to browser preferences
  try {
    const headers = { "accept-language": acceptLanguage }
    const languages = new Negotiator({ headers }).languages()
    return match(languages, locales, defaultLocale)
  } catch (error) {
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect if there is no locale in the pathname
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  // e.g. incoming request is /gallery
  // The new URL is now /en/gallery or /ar/gallery depending on the locale
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes (api),
    // static files (e.g., images, public files), and favicon
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}
