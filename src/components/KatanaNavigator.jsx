'use client';

import { useEffect, useId, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { getAboutScrollTop } from '../utils/aboutScroll'

export default function KatanaNavigator() {
  const lenis = useLenis()
  const steelId = useId()
  const timer = useRef(null)
  const [slashing, setSlashing] = useState(false)
  useEffect(() => () => clearTimeout(timer.current), [])

  const slice = () => {
    if (slashing) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSlashing(true)
    timer.current = window.setTimeout(() => {
      const about = document.getElementById('about')
      if (about) {
        const top = getAboutScrollTop(about)
        if (lenis && !reduced) lenis.scrollTo(top, { duration: 1.05, easing: t => 1 - Math.pow(1 - t, 4), lock: true })
        else window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' })
      }
      setSlashing(false)
    }, reduced ? 0 : 260)
  }

  return (
    <div className="katana-seam">
      <button type="button" className={`katana-navigator ${slashing ? 'is-slashing' : ''}`} onClick={slice} aria-label="Need some convincing first? Slice to explore About Me">
        <svg className="katana-navigator-art" viewBox="0 0 260 100" aria-hidden="true">
          <defs>
            <linearGradient id={steelId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#424b54" /><stop offset=".3" stopColor="#bdc6cc" /><stop offset=".5" stopColor="#fff" /><stop offset=".7" stopColor="#75818b" /><stop offset="1" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          {[0, 1].map(blade => (
            <g key={blade} className={`navigator-blade navigator-blade-${blade}`}>
              <path d="M72 47 Q150 50 236 39 L226 48 Q152 57 72 54Z" fill={`url(#${steelId})`} stroke="#68717a" strokeWidth=".6" />
              <path className="navigator-glint" d="M80 53 Q160 55 226 47" fill="none" stroke="#fff" strokeWidth="1.2" />
              <path d="M79 49 Q160 51 222 43" fill="none" stroke="#475569" strokeWidth=".6" />
              <rect x="67" y="46" width="7" height="9" rx="1" fill="#ad8750" />
              <path d="M64 40 L68 43 L68 58 L64 61 L61 58 L61 43Z" fill="#19191c" stroke="#b91c1c" />
              <rect x="25" y="47" width="36" height="8" rx="2" fill="#991b1b" stroke="#18181b" />
              {[29, 36, 43, 50, 57].map(x => <path key={x} d={`M${x - 3} 47 l6 8 m0 -8 l-6 8`} stroke="#18181b" strokeWidth="2" />)}
              <rect x="23" y="46" width="4" height="10" rx="1" fill="#27272a" />
            </g>
          ))}
          <g className="navigator-spark"><path d="M130 32 L130 68 M112 50 L148 50 M118 38 L142 62 M118 62 L142 38" stroke="#dc2626" strokeWidth="2" /><circle cx="130" cy="50" r="5" fill="#fff" /></g>
        </svg>
        <span className="katana-navigator-prompt" aria-hidden="true">
          <span>Or see for yourself</span>
          <svg viewBox="0 0 70 28" fill="none">
            <path d="M18 2 C16 17 39 3 44 14 C47 20 49 21 52 24 M46 20 L52 24 L47 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  )
}
