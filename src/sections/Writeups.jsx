import { motion } from 'framer-motion'
import { writeups } from '../data/content'
import { useReveal } from '../hooks'

const card = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
}

export default function Writeups() {
  const [ref, shown] = useReveal()
  return (
    <section id="writeups" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="num">04.</span> ls ./writeups</div>
      </div>

      <div className="writeups-grid">
        {writeups.map((w, i) => {
          const soon = w.status === 'soon'
          const Tag = soon ? motion.div : motion.a
          const linkProps = soon ? {} : { href: w.href, target: '_blank', rel: 'noreferrer' }
          return (
            <Tag
              key={w.title}
              className={`card ${soon ? 'soon' : ''}`}
              {...linkProps}
              {...card}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {soon && <span className="card-soon">soon™</span>}
              <span className="card-kind">{w.kind}</span>
              <h3 className="card-title">{w.title}</h3>
              <p className="card-blurb">{w.blurb}</p>
              {soon ? (
                <span className="card-link muted">coming soon…</span>
              ) : (
                <span className="card-link">read on medium <span className="arrow">→</span></span>
              )}
            </Tag>
          )
        })}
      </div>
    </section>
  )
}
