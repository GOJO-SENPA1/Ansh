import { useState, useEffect, useRef } from 'react'

// Reveal element when it scrolls into view (adds .in)
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px', ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, shown]
}

// Cycle through an array of strings, typing then deleting each.
export function useRotatingTyper(items, { type = 45, del = 22, hold = 1600 } = {}) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const current = items[i % items.length]
    let t
    if (phase === 'typing') {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), type)
      } else {
        t = setTimeout(() => setPhase('deleting'), hold)
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), del)
      } else {
        setI((v) => v + 1)
        setPhase('typing')
      }
    }
    return () => clearTimeout(t)
  }, [text, phase, i, items, type, del, hold])

  return text
}

// Count up to a target number once visible.
export function useCountUp(target, run, duration = 1400) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!run || started.current) return
    started.current = true
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, duration])
  return val
}
