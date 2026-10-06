import type { MetadataRoute } from 'next';
import { isPublic, readPosts } from '../lib/posts.js';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL || 'https://rajatsrivastav.dev';
  const posts = (await readPosts()).filter(isPublic);
  return [{ url: site }, { url: `${site}/blog` }, ...posts.map(post => ({ url: `${site}/blog/${post.slug}`, lastModified: post.updatedAt || undefined }))];
}
