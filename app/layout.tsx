import type { Metadata } from 'next';
import SmoothScroll from './SmoothScroll';
import './globals.css';

const siteUrl = process.env.SITE_URL || 'https://rajatsrivastav.dev';
const description = 'Cloud-native systems, scalable microservices, and full-stack architecture.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Rajat Srivastav — Full-Stack Engineer & Systems Builder',
  description,
  keywords: ['Rajat Srivastav', 'Full Stack Engineer', 'Cloud Native', 'Kubernetes', 'Go', 'TypeScript', 'Distributed Systems'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', url: siteUrl, siteName: 'Rajat Srivastav', title: 'Rajat Srivastav — Full-Stack Engineer & Systems Builder', description, images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image', title: 'Rajat Srivastav — Full-Stack Engineer & Systems Builder', description, images: ['/og-image.png'] },
  icons: { icon: '/favicon.ico' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Rajat Srivastav', url: `${siteUrl}/`, jobTitle: 'Full-Stack Engineer & Systems Builder', sameAs: ['https://github.com/rajatrsrivastav', 'https://www.linkedin.com/in/rajatrsrivastav/'] },
    { '@type': 'WebSite', url: `${siteUrl}/`, name: 'Rajat Srivastav', author: { '@id': `${siteUrl}/#person` } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet" /><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/devicon.min.css" /></head><body><SmoothScroll>{children}</SmoothScroll><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
