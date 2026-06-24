import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { identity, stats } from '../data/content'
import { useRotatingTyper, useCountUp, useReveal } from '../hooks'
import Scramble from '../components/Scramble'
import MatrixRain from '../components/MatrixRain'

function Stat({ value, suffix, label, run }) {
  const n = useCountUp(value, run)
  return (
    <div className="stat">
      <div className="stat-val">{n}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// magnetic button — pulls slightly toward the cursor
function Magnetic({ className, href, children }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.4}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <a ref={ref} href={href} className={className} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </a>
  )
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
  }),
}

export default function Hero() {
  const typed = useRotatingTyper(identity.taglines)
  const [statRef, statShown] = useReveal()
  const [decoded, setDecoded] = useState(false)
  const heroRef = useRef(null)

  // mouse-reactive spotlight
  const onMove = (e) => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <header className="hero" id="top" ref={heroRef} onMouseMove={onMove}>
      <MatrixRain className="hero-rain" opacity={0.12} fade={0.06} speed={0.8} fontSize={16} />
      <div className="hero-spot" />

      <div className="wrap hero-inner">
        <motion.div className="hero-tag" custom={0} variants={fade} initial="hidden" animate="show">
          <span className="pulse" />
          {identity.status} · {identity.location}
        </motion.div>

        <motion.h1 className="hero-name" custom={1} variants={fade} initial="hidden" animate="show">
          <span className="glitch" data-text={identity.name}>
            <Scramble text={identity.name} go onDone={() => setDecoded(true)} />
          </span>
        </motion.h1>

        <motion.div className="hero-role" custom={2} variants={fade} initial="hidden" animate="show">
          <span className="prompt-min">$ </span>{identity.role}<span className="blink" />
        </motion.div>

        <motion.div className="hero-typed" custom={3} variants={fade} initial="hidden" animate="show">
          <span className="gt">{'>'}</span>
          <span>{typed}</span>
          <span className="boot-cursor" />
        </motion.div>

        <motion.div className="hero-actions" custom={4} variants={fade} initial="hidden" animate="show">
          <Magnetic href="#findings" className="btn primary">view the bodies →</Magnetic>
          <Magnetic href="#shell" className="btn">./open_shell</Magnetic>
        </motion.div>

        <div className="hero-stats" ref={statRef}>
          {stats.map((s) => (
            <Stat key={s.label} {...s} run={statShown} />
          ))}
        </div>
      </div>
    </header>
  )
}
