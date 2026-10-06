import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { dispatches } from "../data/dispatches";
import "./BlogPages.css";

export default function BlogPage() {
  return (
    <main className="blog-page">
      <div className="blog-shell">
        <a className="blog-back" href="/"><ArrowLeft size={15} /> Back to portfolio</a>
        <header className="blog-archive-header">
          <span className="blog-kicker font-mono">WRITING</span>
          <h1 className="font-serif"><span className="font-serif italic font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent">Blog</span></h1>
          <p>Things I've learned building, debugging, and shipping.</p>
        </header>
        <section className="blog-archive-grid" aria-label="All posts">
          {dispatches.map((dispatch) => (
            <a className="blog-archive-card" href={`/blog/${dispatch.slug}`} key={dispatch.slug}>
              <div className="blog-card-top">
                <span className="dispatch-topic font-mono">{dispatch.topic}</span>
                <ArrowUpRight className="blog-card-arrow" aria-hidden="true" />
              </div>
              <h2 className="font-serif">{dispatch.title}</h2>
              <p>{dispatch.description}</p>
              <div className="dispatch-tags">
                {dispatch.tags.map((tag) => <span className="dispatch-tag font-mono" key={tag}>{tag}</span>)}
              </div>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
