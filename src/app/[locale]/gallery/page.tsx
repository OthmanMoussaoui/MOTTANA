import GalleryClient from './GalleryClient';
import { getDictionary } from '@/lib/getDictionary';
import type { Locale } from '@/lib/i18n';

type Params = Promise<{ locale: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const locale = params.locale;
  const dictionary = await getDictionary(locale as Locale);
  const isArabic = locale === 'ar';

  return (
    <GalleryClient 
      dictionary={dictionary} 
      locale={locale} 
      isArabic={isArabic} 
    />
  );
} 