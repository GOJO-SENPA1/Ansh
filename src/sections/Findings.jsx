import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { findings } from '../data/content'
import { useReveal } from '../hooks'

const SEV_COLOR = {
  CRIT: 'var(--crit)',
  HIGH: 'var(--high)',
  MED: 'var(--med)',
  LOW: 'var(--low)',
}

const FILTERS = ['ALL', 'CRIT', 'HIGH', 'MED', 'LOW']

export default function Findings() {
  const [filter, setFilter] = useState('ALL')
  const [headRef, headShown] = useReveal()

  const visible = findings.filter((f) => filter === 'ALL' || f.severity === filter)

  // counts for filter labels
  const count = (s) => findings.filter((f) => f.severity === s).length

  return (
    <section id="findings" className="wrap">
      <div ref={headRef} className={`reveal ${headShown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="num">02.</span> cat findings.log</div>
      </div>

      <div className="sev-filter">
        {FILTERS.map((s) => (
          <button
            key={s}
            className={`sev-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}{s !== 'ALL' ? ` (${count(s)})` : ` (${findings.length})`}
          </button>
        ))}
      </div>

      <div className="findings-list">
        <AnimatePresence mode="popLayout">
          {visible.map((f, i) => (
            <motion.article
              key={f.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              className="finding"
              style={{ '--sev-color': SEV_COLOR[f.severity] }}
            >
              <div className="finding-sev">
                <span className="sev-badge">{f.severity}</span>
                <span className="sev-id">{f.id}</span>
              </div>
              <div className="finding-body">
                <h3 className="finding-title">{f.title}</h3>
                <div className="finding-target">{f.target}</div>
                <p className="finding-summary">{f.summary}</p>
                <div className="finding-tags">
                  {f.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <div className="finding-bar"><i style={{ width: `${f.bar}%` }} /></div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
