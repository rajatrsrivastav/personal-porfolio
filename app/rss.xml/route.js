import { isPublic, readPosts, sortPosts } from '../../lib/posts.js';

export const dynamic = 'force-dynamic';
const escape = value => String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
export async function GET() {
  const site = process.env.SITE_URL || 'https://rajatsrivastav.dev';
  const posts = sortPosts((await readPosts()).filter(isPublic));
  const items = posts.map(post => `<item><title>${escape(post.title)}</title><link>${escape(`${site}/blog/${post.slug}`)}</link><guid>${escape(`${site}/blog/${post.slug}`)}</guid><description>${escape(post.excerpt)}</description></item>`).join('');
  return new Response(`<?xml version="1.0"?><rss version="2.0"><channel><title>Rajat's Field Notes</title><link>${escape(`${site}/blog`)}</link><description>Engineering essays and architecture field notes</description>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' } });
}
