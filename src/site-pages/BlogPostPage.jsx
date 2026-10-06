'use client';

import { ArrowLeft } from "lucide-react";
import Link from 'next/link';
import usePosts from "../hooks/usePosts";
import Markdown from "../components/Markdown";
export default function BlogPostPage({ slug }) {
  const {posts, loading, error} = usePosts();
  const dispatch = posts.find(post => post.slug === slug);
  if (loading || error) return <main className="blog-page"><p role="status">{error || "Loading article…"}</p></main>;

  if (!dispatch) {
    return (
      <main className="blog-page">
        <div className="blog-shell blog-not-found">
          <span className="blog-kicker font-mono">404</span>
          <h1 className="font-serif">Post not found.</h1>
          <Link className="blog-back" href="/blog"><ArrowLeft size={15} /> Back to all posts</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-page">
      <article className="blog-article">
        <Link className="blog-back" href="/blog"><ArrowLeft size={15} /> All posts</Link>
        <header className="blog-article-header">
          <span className="blog-kicker font-mono">{dispatch.topic}</span>
          <p className="dispatch-meta font-mono">{dispatch.readTime}</p>
          <h1 className="font-serif">{dispatch.title}</h1>
          <p className="blog-deck">{dispatch.description}</p>
          <div className="dispatch-tags">
            {dispatch.tags.map((tag) => <span className="dispatch-tag font-mono" key={tag}>{tag}</span>)}
          </div>
        </header>
        <Markdown content={dispatch.content} />
        <footer className="blog-article-footer">
          <p className="font-serif">More from the blog.</p>
          <Link className="blog-pill-link" href="/blog">View all posts <span aria-hidden="true">→</span></Link>
        </footer>
      </article>
    </main>
  );
}
