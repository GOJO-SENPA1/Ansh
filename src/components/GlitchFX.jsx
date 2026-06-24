import { useEffect, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]

// Occasional full-screen RGB glitch flashes + the konami easter egg.
export default function GlitchFX({ onMatrix }) {
  const [burst, setBurst] = useState(false)

  // random glitch flashes
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let alive = true
    let to
    const schedule = () => {
      const wait = 6000 + Math.random() * 7000
      to = setTimeout(() => {
        if (!alive) return
        setBurst(true)
        setTimeout(() => setBurst(false), 220)
        schedule()
      }, wait)
    }
    schedule()
    return () => {
      alive = false
      clearTimeout(to)
    }
  }, [])

  // konami code → matrix takeover
  useEffect(() => {
    let pos = 0
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (k === KONAMI[pos]) {
        pos++
        if (pos === KONAMI.length) {
          pos = 0
          onMatrix?.()
        }
      } else {
        pos = k === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMatrix])

  return <div className={`fx-glitch ${burst ? 'on' : ''}`} aria-hidden="true" />
}
