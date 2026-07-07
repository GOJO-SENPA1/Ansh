import { motion } from 'framer-motion'
import { writeups } from '../data/content'
import { useReveal } from '../hooks'

const card = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
}

export default function Writeups() {
  const [ref, shown] = useReveal()
  return (
    <section id="writeups" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">05</span> <span className="txt">writeups</span> — the story behind the bug</div>
      </div>

      <div className="wu-grid">
        {writeups.map((w, i) => {
          const live = w.status === 'live'
          const Tag = live ? motion.a : motion.div
          const props = live ? { href: w.href, target: '_blank', rel: 'noreferrer' } : {}
          return (
            <Tag
              key={w.title}
              className={`wu ${live ? 'live' : 'draft'}`}
              {...props}
              {...card}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {!live && <span className="wu-badge">draft</span>}
              <span className="wu-kind">{w.kind}</span>
              <h3 className="wu-title">{w.title}</h3>
              <p className="wu-blurb">{w.blurb}</p>
              <span className="wu-link">
                {live ? <>read on Medium <span className="arr">→</span></> : 'in progress…'}
              </span>
            </Tag>
          )
        })}
      </div>
    </section>
  )
}
