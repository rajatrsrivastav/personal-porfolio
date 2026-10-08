'use client';

import { cloneElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkStandaloneLinks from '../utils/remarkStandaloneLinks.js';
import remarkEditorialLists from '../utils/remarkEditorialLists.js';
import LinkPreview from './LinkPreview';

const previewPlugins = [remarkGfm, remarkEditorialLists, remarkStandaloneLinks];
const plainPlugins = [remarkGfm, remarkEditorialLists];

// Keep the existing code colors without interpreting code as HTML.
function highlightCode(text) {
  return text.split(/(\b(?:const|let|return|function|import|export|if|else|async|await|class|def|package|func)\b|"[^"\n]*"|'[^'\n]*'|\b\d+\b)/g).map((token, index) => {
    const className = /^(const|let|return|function|import|export|if|else|async|await|class|def|package|func)$/.test(token)
      ? 'syntax-keyword'
      : /^['"]/.test(token) ? 'syntax-string' : /^\d+$/.test(token) ? 'syntax-number' : undefined;
    return <span key={index} className={className}>{token}</span>;
  });
}

const components = {
  p({ node, children }) {
    const url = node.properties.dataPreviewUrl;
    return url ? <LinkPreview url={url}>{children}</LinkPreview> : <p>{children}</p>;
  },
  pre({ children }) {
    return <pre>{cloneElement(children, {}, highlightCode(String(children.props.children)))}</pre>;
  },
  table({ children }) {
    return <div className="blog-table-scroll"><table>{children}</table></div>;
  },
  img({ src, alt, title }) {
    // Unsafe URLs are transformed to an empty string; avoid an empty-src request.
    // Authored images have arbitrary URLs and no required dimensions.
    // eslint-disable-next-line @next/next/no-img-element
    return src ? <img src={src} alt={alt || ''} title={title} /> : null;
  },
};

export default function Markdown({ content = '', linkPreviews = true }) {
  return (
    <div className="blog-prose">
      {/* No raw HTML plugin; retain react-markdown's default safe URL transform. */}
      <ReactMarkdown remarkPlugins={linkPreviews ? previewPlugins : plainPlugins} components={components} skipHtml>
        {content}
      </ReactMarkdown>
    </div>
  );
}
