'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';

const options = {
  lerp: 0.085,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
  anchors: true,
};

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return enabled ? <ReactLenis root options={options}>{children}</ReactLenis> : children;
}
