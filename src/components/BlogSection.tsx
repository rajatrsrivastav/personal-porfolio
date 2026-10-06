'use client';

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import usePosts from '../hooks/usePosts'
import ComingSoon from './ComingSoon'
function DispatchCard({ dispatch, compact = false }) {
  return (
    <Link
      href={`/blog/${dispatch.slug}`}
      className={`dispatch-card ${compact ? 'dispatch-card-compact' : 'dispatch-card-featured'}`}
      aria-label={`Read ${dispatch.title}`}
    >
      <div className="dispatch-card-topline">
        <span className="dispatch-topic font-mono">{dispatch.topic}</span>
        <ArrowUpRight className="dispatch-arrow" aria-hidden="true" />
      </div>
      <div className="dispatch-card-copy">
        <h3 className="font-serif">{dispatch.title}</h3>
        <p className="dispatch-description">{dispatch.description}</p>
      </div>
      <div className="dispatch-tags" aria-label="Topics">
        {dispatch.tags.map((tag) => (
          <span key={tag} className="dispatch-tag font-mono">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default function BlogSection() {
  const { posts: dispatches, loading, error } = usePosts()
  return (
    <section id="blog" aria-labelledby="blog-title" className="dispatches-section scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28">
      <div className="dispatches-container">
        <div className="dispatches-heading-row">
          <div className="dispatches-heading">
            <h2 id="blog-title" className="font-serif">
              Blog
            </h2>
          </div>
          <Link className="dispatches-archive-link" href="/blog">
            <span>All posts</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {loading ? <p role="status">Loading notes…</p> : error ? <p role="status">{error}</p> : !dispatches.length ? <ComingSoon /> : <div className="dispatches-grid">
          <DispatchCard dispatch={dispatches[0]} />
          <div className="dispatches-stack">
            {dispatches.slice(1).map((dispatch) => (
              <DispatchCard key={dispatch.slug} dispatch={dispatch} compact />
            ))}
          </div>
        </div>}
      </div>
    </section>
  )
}
