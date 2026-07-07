import { useState, useEffect, useRef } from 'react'

// Short, honest terminal init. Plays once per session (interviewers and repeat
// visitors skip straight to the site), skippable, and quiet — no cosplay.
const LINES = [
  { t: 'ansh@sec ~ % ./init --portfolio', c: '' },
  { t: 'loading operator profile ............... ok', c: 'ok' },
  { t: 'indexing findings & advisories ......... 17 records', c: 'k' },
  { t: 'verifying signatures .......... 2 GHSA · 2 critical', c: 'ok' },
  { t: 'session ready.', c: 'd' },
]

const SEEN_KEY = 'ansh_boot_v2'

export default function Boot({ onDone }) {
  const [skip, setSkip] = useState(() => {
    try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
  })
  const [exiting, setExiting] = useState(false)
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    setExiting(true)
    setTimeout(onDone, 500)
  }

  // if we've booted this session already, don't replay it
  useEffect(() => {
    if (skip) { onDone(); return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(finish, reduce ? 400 : 1650)
    const onKey = (e) => { if (['Escape', 'Enter', ' '].includes(e.key)) finish() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, []) // eslint-disable-line

  if (skip) return null

  return (
    <div className={`boot ${exiting ? 'exit' : ''}`} onClick={finish}>
      <div className="boot-wrap">
        <div className="boot-brand">ANSH<b>_</b></div>
        {LINES.map((l, i) => (
          <div key={i} className="boot-line" style={{ animationDelay: `${0.12 + i * 0.2}s` }}>
            <span className={l.c}>{l.t}</span>
            {i === LINES.length - 1 && <span className="boot-cursor" />}
          </div>
        ))}
      </div>
      <button className="boot-skip" onClick={finish}>[ esc · skip ]</button>
    </div>
  )
}
