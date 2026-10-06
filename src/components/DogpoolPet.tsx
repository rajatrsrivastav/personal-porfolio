'use client'

import { useEffect, useRef, useState } from 'react'
import './DogpoolPet.css'

const wisecracks = [
  'WOOF (maximum effort)!',
  'Got chimichangas?',
  'Cutest mercenary in the multiverse.',
]

// Inline SVG keeps the companion self-contained: no sprite downloads or requests.
function DogpoolArtwork() {
  return (
    <svg className="dogpool-art" viewBox="0 0 40 40" aria-hidden="true">
      <ellipse cx="21" cy="36" rx="14" ry="2" fill="#171717" opacity=".14" />
      <g className="dogpool-awake">
        <path className="dogpool-tail" d="M10 25 Q3 23 5 17 L3 15 M5 17 L7 16" fill="none" stroke="#c7c5c1" strokeWidth="2" strokeLinecap="round" />
        <g className="dogpool-leg dogpool-leg-a"><path d="M13 27 Q10 31 12 35 L15 35 M28 27 L30 34 L33 35" fill="none" stroke="#3a3032" strokeWidth="2.8" strokeLinecap="round" /></g>
        <g className="dogpool-leg dogpool-leg-b"><path d="M17 27 L18 34 L21 35 M32 27 Q34 31 33 34 L36 34" fill="none" stroke="#a8a09a" strokeWidth="2.2" strokeLinecap="round" /></g>
        <g className="dogpool-torso">
          <path d="M9 24 Q10 18 18 19 Q24 19 29 21 L32 27 Q31 31 25 32 L14 31 Q8 30 9 24Z" fill="#a51c30" stroke="#4b202a" strokeWidth=".7" />
          <path d="M11 22 Q18 19 27 22" fill="none" stroke="#e2525e" strokeWidth="1" />
          <path d="M11 22 L15 20 L16 30 L12 30Z M26 21 L30 22 L31 28 L26 31Z" fill="#202025" />
          <path d="M18 21 L19 30 M24 22 L24 31" stroke="#6d1525" strokeWidth=".7" />
          <path d="M14 27 L27 28" stroke="#29252a" strokeWidth="2" />
          <rect x="20" y="26.5" width="3" height="2.5" rx=".4" fill="#bc9b68" />
          <path d="M25 20 L31 21 L31 24 L25 23Z" fill="#18191d" stroke="#625458" strokeWidth=".5" />
          <circle cx="28" cy="22" r=".8" fill="#c2b7a1" />
        </g>
        <g className="dogpool-head">
          {/* Back Floppy Ear */}
          <path d="M25 10 C22 8.5 19 9 19 13 C19 17 20 19.5 22 21 C23 19 22.5 16 23 13 Z" fill="#7a6e69" stroke="#4a423f" strokeWidth=".6" />
          <path d="M21 11.5 Q20 14.5 22 18.5" fill="none" stroke="#5a504c" strokeWidth=".5" />

          {/* Cute Round Puppy Head & Deadpool Cowl */}
          <path d="M22 17 C21 12 25 8 30 8 C35 8 36 12 36 18 C36 23 33 25 28 25 C24 25 22 22 22 17 Z" fill="#bf2b3d" stroke="#5c1520" strokeWidth=".7" />

          {/* Front Floppy Ear */}
          <path d="M33 10 Q37 9 37 14 Q37 19 34 21 Q33 19 33 14 Z" fill="#9e8f88" stroke="#5c524c" strokeWidth=".6" />
          <path d="M34 12 Q36 12 36 16 Q35 18 34 19" fill="#d9aba0" />

          {/* Deadpool Mask Seam & Soft Crest */}
          <path d="M29 8 Q29 13 29 16" fill="none" stroke="#8b1e2c" strokeWidth=".5" strokeDasharray="1 1" />
          <path d="M27 8 Q29 5.8 30 7.5 Q31 5.8 32 8" fill="#d92e40" stroke="#751a24" strokeWidth=".5" />

          {/* Deadpool Black Eye Patches (Rounded & cute) */}
          <path d="M23.8 12.5 C22.8 14 23.2 17 25.8 17.5 C27.5 17.5 28 15.5 27.5 13.5 C27 12 25 11.5 23.8 12.5 Z" fill="#1b1c20" stroke="#383336" strokeWidth=".4" />
          <path d="M29.5 12.5 C29 15.5 29.8 17.5 32 17.5 C34 17.5 35 15 34 12.5 C33.5 11.5 30.5 11.5 29.5 12.5 Z" fill="#1b1c20" stroke="#383336" strokeWidth=".4" />

          {/* Big Soulful, Wise Puppy Eyes */}
          <ellipse cx="25.5" cy="14.8" rx="1.6" ry="1.9" fill="#ffffff" />
          <ellipse cx="25.7" cy="14.8" rx="1.2" ry="1.4" fill="#1c1618" />
          <circle cx="25.3" cy="14.2" r=".55" fill="#ffffff" />
          <circle cx="26.3" cy="15.5" r=".25" fill="#ffffff" />

          <ellipse cx="31.5" cy="14.8" rx="1.6" ry="1.9" fill="#ffffff" />
          <ellipse cx="31.7" cy="14.8" rx="1.2" ry="1.4" fill="#1c1618" />
          <circle cx="31.3" cy="14.2" r=".55" fill="#ffffff" />
          <circle cx="32.3" cy="15.5" r=".25" fill="#ffffff" />

          {/* Wise Expressive Brow Arches */}
          <path d="M24 11 Q25.8 10.2 27.5 11" fill="none" stroke="#ffffff" strokeWidth=".6" strokeLinecap="round" opacity=".85" />
          <path d="M29.5 11 Q31.5 10.2 33.5 11" fill="none" stroke="#ffffff" strokeWidth=".6" strokeLinecap="round" opacity=".85" />

          {/* Cute Puppy Muzzle & Cheek Warmth */}
          <path d="M26 18 C26 16.5 29 16.5 33 17.5 C35 18 36 20 35 22.5 C34 24.5 30 25 27.5 24 C26 23.5 26 20 26 18 Z" fill="#eedfd4" stroke="#826e64" strokeWidth=".5" />
          <circle cx="25.5" cy="18" r="1.2" fill="#ffb3ba" opacity=".35" />
          <circle cx="34.5" cy="18.5" r="1.2" fill="#ffb3ba" opacity=".35" />

          {/* Cute Button Nose */}
          <path d="M31.2 18 C32.4 17.4 34.2 17.7 34.6 18.7 C34.8 19.5 33.5 20.3 32.8 20.3 C31.8 20.3 30.6 19 31.2 18 Z" fill="#1a191b" />
          <circle cx="32.5" cy="18.3" r=".35" fill="#ffffff" opacity=".8" />

          {/* Gentle Smile */}
          <path d="M30 21.5 Q32 22.8 33.8 21.2" fill="none" stroke="#52433e" strokeWidth=".6" strokeLinecap="round" />

          {/* Cute Tiny Puppy Tongue Blep (panting origin at 30px 23px) */}
          <path className="dogpool-tongue" d="M31.5 22 Q34 21.5 35 23.5 Q35.5 25.5 33.5 25.5 Q31.5 25.5 31.2 23.2 Z" fill="#ff9ebb" stroke="#d46380" strokeWidth=".45" />
          <path d="M33 22.5 L33.5 24.5" stroke="#ba4865" strokeWidth=".4" strokeLinecap="round" />
        </g>
      </g>
      <g className="dogpool-asleep">
        <path d="M6 30 Q6 20 19 21 Q32 19 35 28 Q36 35 24 35 L13 35 Q6 35 6 30Z" fill="#b82638" stroke="#481e25" strokeWidth=".7" />
        <path d="M13 31 L26 31" stroke="#202025" strokeWidth="2" />
        <rect x="18" y="30" width="3" height="2" rx=".4" fill="#bc9b68" />
        <path d="M8 31 Q4 26 8 23 Q12 20 16 24" fill="none" stroke="#a89f9a" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="23" cy="34" rx="3" ry="1.5" fill="#8c7f79" stroke="#483f3b" strokeWidth=".5" />

        {/* Cute Sleeping Dogpool Head */}
        <path d="M19 23 C18 17 24 13 30 14 C35 15 36 21 34 27 C32 31 24 32 19 28 C18 26 18 24 19 23 Z" fill="#bf2b3d" stroke="#5c1520" strokeWidth=".7" />
        <path d="M20 18 Q16 19 18 24 Q20 27 22 25 Z" fill="#8c7f79" stroke="#524844" strokeWidth=".5" />

        {/* Sleeping Mask Patches & Sweet Closed Eyes */}
        <path d="M22 20 C21 22 22 25 25 25 C26 25 27 23 26 21 C25 19.5 23 19 22 20 Z" fill="#1b1c20" />
        <path d="M28 20 C27 22 28 25 31 25 C32 25 33 23 32 21 C31 19.5 29 19 28 20 Z" fill="#1b1c20" />
        <path d="M22.5 22 Q24 20.5 25.5 22" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <path d="M28.5 22 Q30 20.5 31.5 22" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

        {/* Sweet Sleeping Muzzle & Nose */}
        <path d="M24 25 C24 23.5 27 23.5 30 24.5 C31 25 31 27 30 28 C28.5 29 25 28.5 24 27 Z" fill="#eedfd4" />
        <path d="M27 24.8 Q28.5 24 29.5 25.2 Q28.5 26.2 27 25.6 Z" fill="#1a191b" />
        <path d="M26.5 27 Q28 27.8 29.5 27" fill="none" stroke="#52433e" strokeWidth=".5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export default function DogpoolPet() {
  const shellRef = useRef(null)
  const spriteRef = useRef(null)
  const bubbleRef = useRef(null)
  const engineRef = useRef(null)
  const [device, setDevice] = useState({ enabled: false, reduced: false })

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const evaluate = () => setDevice(previous => {
      const next = { enabled: !coarse.matches && window.innerWidth >= 768, reduced: reduced.matches }
      return previous.enabled === next.enabled && previous.reduced === next.reduced ? previous : next
    })
    evaluate()
    window.addEventListener('resize', evaluate)
    coarse.addEventListener('change', evaluate)
    reduced.addEventListener('change', evaluate)
    return () => {
      window.removeEventListener('resize', evaluate)
      coarse.removeEventListener('change', evaluate)
      reduced.removeEventListener('change', evaluate)
    }
  }, [])

  useEffect(() => {
    if (!device.enabled) return
    const shell = shellRef.current
    const sprite = spriteRef.current
    const bubble = bubbleRef.current
    if (!shell || !sprite || !bubble) return

    const now = performance.now()
    const engine = {
      x: window.innerWidth - 64, y: window.innerHeight - 64,
      targetX: window.innerWidth - 44, targetY: window.innerHeight - 44,
      lastMove: now, lastFrame: now, state: device.reduced ? 'sleeping' : 'idle',
      facing: 1, clickedUntil: 0, circleStart: 0, circleX: 0, circleY: 0,
      held: false, quote: -1,
      vx: 0, vy: 0, phase: 0, yaw: 0, bank: 0,
    }
    engineRef.current = engine
    let frame = 0
    let bubbleTimer = 0
    const clamp = () => {
      engine.x = Math.max(0, Math.min(window.innerWidth - 48, engine.x))
      engine.y = Math.max(0, Math.min(window.innerHeight - 48, engine.y))
    }
    const paint = () => {
      clamp()
      shell.style.transform = `translate3d(${engine.x}px, ${engine.y}px, 0)`
      shell.dataset.state = engine.state
      shell.dataset.bubbleSide = engine.x > window.innerWidth / 2 ? 'left' : 'right'
      shell.dataset.bubbleVertical = engine.y < 80 ? 'below' : 'above'
      sprite.style.transform = `perspective(160px) rotateY(${engine.yaw}deg) rotateZ(${engine.bank}deg)`
    }
    const tick = (time) => {
      const elapsed = Math.min(32, time - engine.lastFrame)
      const dt = elapsed / 1000
      engine.lastFrame = time
      const dx = engine.targetX - (engine.x + 24)
      const dy = engine.targetY - (engine.y + 24)
      const distance = Math.hypot(dx, dy)
      let desiredX = 0
      let desiredY = 0
      if (time < engine.clickedUntil) {
        engine.state = 'clicked'
      } else if (engine.held) {
        engine.state = 'idle'
      } else {
        if (time - engine.lastMove >= 4000) {
          if (engine.state !== 'sleeping' && engine.state !== 'settling') {
            engine.circleStart = time
            engine.circleX = engine.x
            engine.circleY = engine.y
          }
          const progress = Math.min(1, (time - engine.circleStart) / 650)
          if (progress < 1) {
            engine.state = 'settling'
            engine.x = engine.circleX + Math.sin(progress * Math.PI * 2) * 7
            engine.y = engine.circleY + (1 - Math.cos(progress * Math.PI * 2)) * 4
          } else {
            if (engine.state === 'settling') {
              engine.x = engine.circleX
              engine.y = engine.circleY
            }
            engine.state = 'sleeping'
          }
        } else if (distance > (engine.state === 'running' ? 40 : 48)) {
          engine.state = 'running'
          if (Math.abs(dx) > 3) engine.facing = dx >= 0 ? 1 : -1
          const speed = Math.min(330, Math.max(0, (distance - 40) * 3.8))
          desiredX = dx / distance * speed
          desiredY = dy / distance * speed
        } else {
          engine.state = 'idle'
          if (Math.abs(dx) > 2) engine.facing = dx >= 0 ? 1 : -1
        }
      }
      const response = 1 - Math.exp(-dt * (desiredX || desiredY ? 7 : 13))
      const oldVX = engine.vx
      const oldVY = engine.vy
      engine.vx += (desiredX - engine.vx) * response
      engine.vy += (desiredY - engine.vy) * response
      if (engine.state === 'running' || engine.state === 'idle') {
        if (engine.held || distance <= 40) {
          engine.vx = 0
          engine.vy = 0
        } else {
          const step = Math.hypot(engine.vx, engine.vy) * dt
          const limit = Math.min(1, Math.max(0, distance - 40) / Math.max(step, .001))
          engine.x += engine.vx * dt * limit
          engine.y += engine.vy * dt * limit
        }
      } else {
        engine.vx = 0
        engine.vy = 0
      }
      const speed = Math.hypot(engine.vx, engine.vy)
      engine.phase += speed * dt * .18
      const gait = engine.state === 'running' ? Math.min(1, speed / 120) : 0
      sprite.style.setProperty('--dogpool-bounce', `${-Math.abs(Math.sin(engine.phase * 2)) * 1.6 * gait}px`)
      sprite.style.setProperty('--dogpool-head-bob', `${Math.sin(engine.phase * 2 + .5) * .8 * gait}px`)
      sprite.style.setProperty('--dogpool-paw-a', `${Math.sin(engine.phase) * 22 * gait}deg`)
      sprite.style.setProperty('--dogpool-paw-b', `${-Math.sin(engine.phase) * 22 * gait}deg`)
      const turn = (oldVX * engine.vy - oldVY * engine.vx) / Math.max(100, speed * speed)
      engine.bank += (Math.max(-8, Math.min(8, turn * 55)) - engine.bank) * (1 - Math.exp(-dt * 10))
      engine.yaw += ((engine.facing === 1 ? 0 : 180) - engine.yaw) * (1 - Math.exp(-dt * 20))
      paint()
      frame = requestAnimationFrame(tick)
    }
    const pointerMove = (event) => {
      if (event.pointerType === 'touch' || (event.clientX === engine.targetX && event.clientY === engine.targetY)) return
      engine.targetX = event.clientX
      engine.targetY = event.clientY
      engine.lastMove = performance.now()
      if (engine.state === 'sleeping' || engine.state === 'settling') engine.state = 'idle'
    }
    const resize = () => {
      if (device.reduced) {
        engine.x = window.innerWidth - 64
        engine.y = window.innerHeight - 64
      }
      paint()
    }
    const visibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && !device.reduced) {
        engine.lastFrame = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }
    engine.poke = () => {
      const time = performance.now()
      engine.lastMove = time
      engine.clickedUntil = time + 650
      engine.state = device.reduced ? 'sleeping' : 'clicked'
      // Avoid repeating the same wisecrack on consecutive pokes.
      engine.quote = (engine.quote + 1 + Math.floor(Math.random() * 2)) % wisecracks.length
      bubble.textContent = wisecracks[engine.quote]
      shell.dataset.speaking = 'true'
      clearTimeout(bubbleTimer)
      bubbleTimer = window.setTimeout(() => { shell.dataset.speaking = 'false' }, 1800)
      paint()
    }
    paint()
    if (!device.reduced) {
      window.addEventListener('pointermove', pointerMove, { passive: true })
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(bubbleTimer)
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
      engineRef.current = null
    }
  }, [device.enabled, device.reduced])

  if (!device.enabled) return null

  const hold = () => {
    if (!engineRef.current) return
    engineRef.current.held = true
  }
  const release = () => {
    if (!engineRef.current) return
    engineRef.current.held = false
    engineRef.current.lastMove = performance.now()
  }

  return (
    <div ref={shellRef} className="dogpool-shell" data-reduced={device.reduced}>
      <div ref={bubbleRef} className="dogpool-bubble" role="status" aria-live="polite" aria-atomic="true" />
      <div className="dogpool-zzz" aria-hidden="true"><span>z</span><span>z</span><span>Z</span></div>
      <button type="button" className="dogpool-button" aria-label="Poke Dogpool for a wisecrack"
        onClick={() => engineRef.current?.poke()}
        onPointerEnter={hold} onPointerLeave={release} onFocus={hold} onBlur={release}>
        <span ref={spriteRef} className="dogpool-sprite"><DogpoolArtwork /></span>
      </button>
    </div>
  )
}
