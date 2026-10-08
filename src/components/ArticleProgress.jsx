'use client';

import { useEffect, useRef, useState } from 'react';

export default function ArticleProgress({ articleRef, content }) {
  const [progress, setProgress] = useState(0);
  const markerRef = useRef(null);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    let frame;
    const update = () => {
      const rect = article.getBoundingClientRect();
      const distance = Math.max(0, rect.height - window.innerHeight);
      const next = distance ? Math.min(1, Math.max(0, -rect.top / distance)) : 1;
      if (markerRef.current) markerRef.current.style.top = `${next * 100}%`;
      setProgress(Math.round(next * 10));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [articleRef, content]);

  const navigate = (step) => {
    const article = articleRef.current;
    if (!article) return;
    const top = article.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(0, article.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + distance * step / 10,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  return (
    <nav className="article-progress" aria-label="Article reading progress">
      <div className="article-progress-track">
        {Array.from({ length: 11 }, (_, step) => (
          <button
            key={step}
            type="button"
            className="article-progress-tick"
            aria-label={`Jump to ${step * 10}% of article`}
            aria-current={progress === step ? 'location' : undefined}
            onClick={() => navigate(step)}
          ><span /></button>
        ))}
        <span ref={markerRef} className="article-progress-marker" aria-hidden="true" />
      </div>
    </nav>
  );
}
