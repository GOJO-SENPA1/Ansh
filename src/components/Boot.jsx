import { useState, useEffect, useRef } from 'react'
import MatrixRain from './MatrixRain'
import Scramble from './Scramble'
import Skull from './Skull'

// status lines that decode in during phase 1 — movie multi-color
const STATUS = [
  { t: '> initializing ansh secure shell v3.3.1', c: 'c-cyan' },
  { t: '> spoofing source · routing through 7 hops ........ ok', c: 'c-green' },
  { t: '> establishing encrypted channel [aes-256-gcm] .... ok', c: 'c-magenta' },
  { t: '> fingerprinting target perimeter ................. done', c: 'c-amber' },
  { t: '> 6 critical payloads armed & staged .............. ready', c: 'c-red' },
]

// rotating color per hex row for that "live decrypt" movie look
const HEXC = ['c-green', 'c-cyan', 'c-amber', 'c-green', 'c-magenta', 'c-cyan', 'c-green']
const STAGEC = ['c-cyan', 'c-amber', 'c-magenta', 'c-red', 'c-amber', 'c-green', 'c-cyan']

// breach stages that flash by while the bar fills (phase 2)
const STAGES = [
  'bypassing edge WAF',
  'fuzzing auth boundary',
  'cracking JWT handshake',
  'injecting payload',
  'escalating privileges',
  'dumping operator profile',
  'wiping access logs',
]

function hexRow() {
  const hex = () => ((Math.random() * 256) | 0).toString(16).padStart(2, '0')
  const bytes = Array.from({ length: 16 }, hex)
  const ascii = bytes
    .map((b) => {
      const n = parseInt(b, 16)
      return n >= 33 && n <= 126 ? String.fromCharCode(n) : '.'
    })
    .join('')
  const addr = ((Math.random() * 0xfffff) | 0).toString(16).padStart(6, '0')
  return `${addr}  ${bytes.join(' ')}  ${ascii}`
}

export default function Boot({ onDone }) {
  const [phase, setPhase] = useState(0) // 0 wake · 1 status · 2 breach · 3 granted · 4 skull · exit
  const [lines, setLines] = useState(0)
  const [hex, setHex] = useState([])
  const [pct, setPct] = useState(0)
  const [stage, setStage] = useState(0)
  const [exiting, setExiting] = useState(false)
  const timers = useRef([])
  const done = useRef(false)

  const after = (ms, fn) => timers.current.push(setTimeout(fn, ms))

  const finish = () => {
    if (done.current) return
    done.current = true
    timers.current.forEach(clearTimeout)
    setExiting(true)
    setTimeout(onDone, 650)
  }

  // master timeline
  useEffect(() => {
    after(450, () => setPhase(1))
    after(2300, () => setPhase(2))
    after(4200, () => setPhase(3))   // ACCESS GRANTED (brief)
    after(5050, () => setPhase(4))   // 💀 skull takeover
    after(7450, finish)              // let the skull breathe, then glitch out
    return () => timers.current.forEach(clearTimeout)
  }, [])

  // reveal status lines one by one in phase 1
  useEffect(() => {
    if (phase < 1) return
    const id = setInterval(() => setLines((n) => Math.min(n + 1, STATUS.length)), 230)
    return () => clearInterval(id)
  }, [phase])

  // live hex dump while phase 1–2
  useEffect(() => {
    if (phase < 1 || phase > 2) return
    const id = setInterval(() => {
      setHex(Array.from({ length: 7 }, hexRow))
    }, 70)
    return () => clearInterval(id)
  }, [phase])

  // breach bar + rotating stage in phase 2
  useEffect(() => {
    if (phase !== 2) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / 1900, 1)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const sid = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 230)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(sid)
    }
  }, [phase])

  // skip
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`cboot ${exiting ? 'exit' : ''}`}>
      <MatrixRain className="cboot-rain" opacity={phase >= 1 ? 0.5 : 0.15} fade={0.08} />
      <div className="cboot-scan" />

      <div className="cboot-stage">
        {/* phase 1: status + hex dump */}
        {phase >= 1 && phase < 3 && (
          <div className="cboot-feed">
            <div className="cboot-status">
              {STATUS.slice(0, lines).map((l, i) => (
                <div key={i} className={`cboot-line ${l.c}`}>
                  <Scramble text={l.t} />
                </div>
              ))}
            </div>
            <div className="cboot-hex">
              {hex.map((r, i) => (
                <div key={i} className={`cboot-hexrow ${HEXC[i % HEXC.length]}`} style={{ opacity: 0.4 + i * 0.085 }}>
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* phase 2: big glitch wordmark + breach bar */}
        {phase >= 2 && phase < 3 && (
          <div className="cboot-breach">
            <div className="cboot-word glitch" data-text="ANSH">ANSH</div>
            <div className="cboot-barwrap">
              <div className="cboot-bartop">
                <span className={`cboot-stagelabel ${STAGEC[stage % STAGEC.length]}`}>› {STAGES[stage]}…</span>
                <span className="cboot-pct">{pct.toString().padStart(3, '0')}%</span>
              </div>
              <div className="cboot-bar"><i style={{ width: `${pct}%` }} /></div>
            </div>
          </div>
        )}

        {/* phase 3: access granted stamp */}
        {phase === 3 && (
          <div className="cboot-granted">
            <div className="cboot-grantedline glitch" data-text="ACCESS GRANTED">ACCESS GRANTED</div>
            <div className="cboot-grantedsub">welcome back, operator — decrypting session…</div>
          </div>
        )}

        {/* phase 4: 💀 DedSec glitch-skull takeover */}
        {phase >= 4 && (
          <div className="cboot-skull">
            <Skull />
            <div className="cboot-skull-tag glitch" data-text="SYSTEM BREACHED">SYSTEM BREACHED</div>
            <div className="cboot-skull-sub">// signed, ansh &mdash; you never saw this 💀</div>
          </div>
        )}
      </div>

      <div className="cboot-skip" onClick={finish}>[ esc · skip intro ]</div>
    </div>
  )
}
