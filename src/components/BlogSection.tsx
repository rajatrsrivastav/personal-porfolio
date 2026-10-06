import { ArrowUpRight } from 'lucide-react'
import { dispatches } from '../data/dispatches'
import './BlogSection.css'

function DispatchCard({ dispatch, compact = false }) {
  return (
    <a
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
    </a>
  )
}

export default function BlogSection() {
  return (
    <section id="blog" aria-labelledby="blog-title" className="dispatches-section">
      <div className="dispatches-container">
        <div className="dispatches-heading-row">
          <div className="dispatches-heading">
            <h2 id="blog-title" className="font-serif">
              Field{" "}
              <span className="font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">
                Notes
              </span>
            </h2>
          </div>
          <a className="dispatches-archive-link" href="/blog">
            <span>All posts</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="dispatches-grid">
          <DispatchCard dispatch={dispatches[0]} />
          <div className="dispatches-stack">
            {dispatches.slice(1).map((dispatch) => (
              <DispatchCard key={dispatch.slug} dispatch={dispatch} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
