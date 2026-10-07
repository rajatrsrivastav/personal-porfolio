'use client';

import { useLayoutEffect, useRef } from 'react';

export function resizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  const borderHeight = textarea.offsetHeight - textarea.clientHeight;
  textarea.style.height = `${textarea.scrollHeight + borderHeight}px`;
}

export default function AutoGrowTextarea({ value, ...props }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    resizeTextarea(ref.current);
  }, [value]);

  useLayoutEffect(() => {
    const textarea = ref.current;
    let active = true;
    let width = textarea.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const nextWidth = textarea.getBoundingClientRect().width;
      if (nextWidth !== width) {
        width = nextWidth;
        resizeTextarea(textarea);
      }
    });
    observer.observe(textarea);
    document.fonts?.ready.then(() => { if (active) resizeTextarea(textarea); });
    return () => { active = false; observer.disconnect(); };
  }, []);

  return <textarea {...props} ref={ref} value={value} className="cms-markdown-input" />;
}
