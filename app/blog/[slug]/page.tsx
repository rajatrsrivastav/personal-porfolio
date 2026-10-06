import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostPage from '../../../src/site-pages/BlogPostPage';
import { isPublic, readPosts } from '../../../lib/posts.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = (await readPosts()).find(item => item.slug === slug && isPublic(item));
  if (!post) return { title: 'Post not found — Field Notes' };
  return {
    title: `${post.title} — Rajat Srivastav`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await readPosts()).some(post => post.slug === slug && isPublic(post))) notFound();
  return <BlogPostPage slug={slug} />;
}
