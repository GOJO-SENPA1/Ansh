import { useRef } from 'react'
import { motion } from 'framer-motion'
import { identity, metrics } from '../data/content'
import { useRotatingTyper, useCountUp, useReveal } from '../hooks'
import Scramble from '../components/Scramble'

function Metric({ value, label, sub, run }) {
  const n = useCountUp(value, run)
  return (
    <div className="metric">
      <div className="metric-val">{n}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  )
}

// button that leans slightly toward the cursor
function Magnetic({ className, href, children }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.22}px, ${(e.clientY - (r.top + r.height / 2)) * 0.32}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <a ref={ref} href={href} className={className} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </a>
  )
}

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.11, duration: 0.65, ease: [0.2, 0.7, 0.2, 1] } }),
}

export default function Hero() {
  const typed = useRotatingTyper(identity.taglines)
  const [statRef, statShown] = useReveal()
  const heroRef = useRef(null)

  const onMove = (e) => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <header className="hero" id="top" ref={heroRef} onMouseMove={onMove}>
      <div className="hero-spot" />
      <div className="wrap hero-inner">
        <motion.div className="hero-status" custom={0} variants={fade} initial="hidden" animate="show">
          <span className="dot" /> {identity.availability}
        </motion.div>

        <motion.h1 className="hero-name" custom={1} variants={fade} initial="hidden" animate="show">
          <span className="glitch" data-text={identity.name}>
            <Scramble text={identity.name} go />
          </span>
        </motion.h1>

        <motion.div className="hero-role" custom={2} variants={fade} initial="hidden" animate="show">
          {identity.role.split(' · ').map((p, i) => (
            <span key={p}>{i > 0 && <span className="sep">/</span>}{p}</span>
          ))}
        </motion.div>

        <motion.div className="hero-typed" custom={3} variants={fade} initial="hidden" animate="show">
          <span className="gt">{'>'}</span><span>{typed}</span><span className="cur" />
        </motion.div>

        <motion.div className="hero-actions" custom={4} variants={fade} initial="hidden" animate="show">
          <Magnetic href="#findings" className="btn gold">view findings ↓</Magnetic>
          <Magnetic href="#contact" className="btn">get in touch</Magnetic>
        </motion.div>

        <div className="hero-metrics" ref={statRef}>
          {metrics.map((m) => <Metric key={m.label} {...m} run={statShown} />)}
        </div>
      </div>
    </header>
  )
}
