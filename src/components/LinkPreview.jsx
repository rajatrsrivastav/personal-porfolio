'use client';

import { useEffect, useState } from 'react';
import { loadLinkPreview } from '../utils/linkPreviewCache.js';

export default function LinkPreview({ url, children }) {
  const [result, setResult] = useState(null);
  const [failedImage, setFailedImage] = useState(null);

  useEffect(() => {
    let active = true;
    loadLinkPreview(url).then(metadata => { if (active) setResult({ url, metadata }); });
    return () => { active = false; };
  }, [url]);

  const metadata = result?.url === url ? result.metadata : null;
  if (!metadata) return <p>{children}</p>;
  const image = metadata.image && metadata.image !== failedImage;

  return (
    <a className={`blog-link-card${image ? ' has-image' : ''}`} href={url} rel="noopener noreferrer">
      <span className="blog-link-card-copy">
        <span className="blog-link-card-title">{metadata.title}</span>
        {metadata.description && <span className="blog-link-card-description">{metadata.description}</span>}
        <span className="blog-link-card-domain">{metadata.hostname}</span>
      </span>
      {image && (
        // Metadata images have arbitrary public URLs and dimensions.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="blog-link-card-image" src={metadata.image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailedImage(metadata.image)} />
      )}
    </a>
  );
}
