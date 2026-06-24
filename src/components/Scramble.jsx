import { useState, useEffect, useRef } from 'react'

const CHARS = '!<>-_\\/[]{}=+*^?#01abcdef█▓▒░ABCXZ$%&'

// Decodes scrambled glyphs into `text` once `go` is true.
export default function Scramble({ text, go = true, className = '', style, onDone }) {
  const [cells, setCells] = useState(() => text.split('').map((c) => ({ c, d: false })))
  const raf = useRef()

  useEffect(() => {
    if (!go) return
    const queue = text.split('').map((to) => ({
      to,
      start: (Math.random() * 18) | 0,
      end: ((Math.random() * 38) | 0) + 14,
      char: null,
    }))
    let frame = 0
    const run = () => {
      let done = 0
      const next = queue.map((q) => {
        if (q.to === ' ') return { c: ' ', d: false }
        if (frame >= q.end) {
          done++
          return { c: q.to, d: false }
        }
        if (!q.char || Math.random() < 0.32) q.char = CHARS[(Math.random() * CHARS.length) | 0]
        return { c: q.char, d: true }
      })
      setCells(next)
      if (done < queue.length) {
        frame++
        raf.current = requestAnimationFrame(run)
      } else if (onDone) onDone()
    }
    run()
    return () => cancelAnimationFrame(raf.current)
  }, [text, go])

  return (
    <span className={className} style={style} aria-label={text}>
      {cells.map((cell, i) => (
        <span key={i} aria-hidden="true" className={cell.d ? 'scr-dud' : undefined}>
          {cell.c}
        </span>
      ))}
    </span>
  )
}
