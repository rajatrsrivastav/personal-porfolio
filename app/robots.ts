import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL || 'https://rajatsrivastav.dev';
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }], sitemap: `${site}/sitemap.xml` };
}
