import { ArrowLeft } from "lucide-react";
import { getDispatch } from "../data/dispatches";
import "./BlogPages.css";

export default function BlogPostPage({ slug }) {
  const dispatch = getDispatch(slug);

  if (!dispatch) {
    return (
      <main className="blog-page">
        <div className="blog-shell blog-not-found">
          <span className="blog-kicker font-mono">404</span>
          <h1 className="font-serif">Post not found.</h1>
          <a className="blog-back" href="/blog"><ArrowLeft size={15} /> Back to all posts</a>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-page">
      <article className="blog-article">
        <a className="blog-back" href="/blog"><ArrowLeft size={15} /> All posts</a>
        <header className="blog-article-header">
          <span className="blog-kicker font-mono">{dispatch.topic}</span>
          <p className="dispatch-meta font-mono">{dispatch.readTime}</p>
          <h1 className="font-serif">{dispatch.title}</h1>
          <p className="blog-deck">{dispatch.description}</p>
          <div className="dispatch-tags">
            {dispatch.tags.map((tag) => <span className="dispatch-tag font-mono" key={tag}>{tag}</span>)}
          </div>
        </header>
        <div className="blog-prose">
          {dispatch.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
        <footer className="blog-article-footer">
          <p className="font-serif">More from the blog.</p>
          <a className="blog-pill-link" href="/blog">View all posts <span aria-hidden="true">→</span></a>
        </footer>
      </article>
    </main>
  );
}
