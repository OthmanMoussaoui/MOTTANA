import { NextConfig } from 'next';
import { locales, defaultLocale } from './src/lib/i18n';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: `/${defaultLocale}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
