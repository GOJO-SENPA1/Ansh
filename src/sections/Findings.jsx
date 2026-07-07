import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { findings } from '../data/content'
import { useReveal } from '../hooks'

const SEV = {
  CRIT: 'var(--crit)',
  HIGH: 'var(--high)',
  MED: 'var(--med)',
  LOW: 'var(--low)',
}
const FILTERS = ['ALL', 'CRIT', 'HIGH', 'MED', 'LOW']

export default function Findings() {
  const [filter, setFilter] = useState('ALL')
  const [open, setOpen] = useState(() => new Set())
  const [ref, shown] = useReveal()

  const visible = findings.filter((f) => filter === 'ALL' || f.severity === filter)
  const count = (s) => (s === 'ALL' ? findings.length : findings.filter((f) => f.severity === s).length)

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <section id="findings" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">02</span> <span className="txt">findings</span> — selected, validated</div>
      </div>

      <div className="filters">
        {FILTERS.map((s) => (
          <button key={s} className={`filter ${filter === s ? 'on' : ''}`} onClick={() => setFilter(s)}>
            {s} <span className="c">({count(s)})</span>
          </button>
        ))}
      </div>

      <div className="finds">
        <AnimatePresence mode="popLayout">
          {visible.map((f, i) => {
            const isOpen = open.has(f.id)
            return (
              <motion.article
                key={f.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.04, 0.3), duration: 0.4 } }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                className={`find ${isOpen ? 'open' : ''}`}
                style={{ '--sev': SEV[f.severity] }}
              >
                <button className="find-head" onClick={() => toggle(f.id)} aria-expanded={isOpen}>
                  <span className="find-sevcol">
                    <span className="sev-badge">{f.severity}</span>
                    <span className="find-id">{f.id}</span>
                  </span>
                  <span className="find-main">
                    <span className="find-title">{f.title}</span>
                    <span className="find-meta">
                      <span className="find-cls">{f.cls}</span>
                      <span className="find-target">{f.target}</span>
                    </span>
                  </span>
                  <span className="find-toggle">+</span>
                </button>

                <p className="find-impact"><b>Impact —</b> {f.impact}</p>

                <div className="find-detail">
                  <div className="find-detail-in">
                    <div className="find-detail-label">mechanism &amp; proof</div>
                    <div className="find-detail-txt">{f.detail}</div>
                    <div className="find-tags">
                      {f.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}
