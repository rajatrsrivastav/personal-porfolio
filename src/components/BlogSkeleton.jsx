import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function Lines() {
  return <div className="blog-skeleton-lines"><span /><span /><span /></div>;
}

export function BlogArchiveSkeleton() {
  return (
    <div role="status" aria-label="Loading posts">
      <div className="blog-archive-grid" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div className="blog-archive-card blog-skeleton-card" key={index}>
            <span className="blog-skeleton-block blog-skeleton-topic" />
            <div>
              <span className="blog-skeleton-block blog-skeleton-card-title" />
              <Lines />
              <span className="blog-skeleton-block blog-skeleton-tags" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogPostSkeleton() {
  return (
    <main className="blog-page">
      <div className="blog-article">
        <Link className="blog-back" href="/blog"><ArrowLeft size={15} /> All posts</Link>
        <div role="status" aria-label="Loading article">
          <div aria-hidden="true">
            <div className="blog-article-header">
              <span className="blog-skeleton-block blog-skeleton-topic" />
              <span className="blog-skeleton-block blog-skeleton-meta" />
              <div className="blog-skeleton-title"><span /><span /></div>
              <Lines />
              <span className="blog-skeleton-block blog-skeleton-tags" />
            </div>
            <div className="blog-skeleton-body"><Lines /><Lines /><Lines /></div>
          </div>
        </div>
      </div>
    </main>
  );
}
