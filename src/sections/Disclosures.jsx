import { motion } from 'framer-motion'
import { disclosures } from '../data/content'
import { useReveal } from '../hooks'

const SEV = { CRIT: 'var(--crit)', HIGH: 'var(--high)', MED: 'var(--med)', LOW: 'var(--low)' }

const card = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
}

export default function Disclosures() {
  const [ref, shown] = useReveal()
  return (
    <section id="disclosures" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">03</span> <span className="txt">disclosures</span> — public / open-source</div>
        <p className="lead-sub" style={{ marginBottom: 30 }}>
          Coordinated disclosures in the Model-Context-Protocol ecosystem — the layer that lets AI models run real
          commands. Two carry published GitHub Security Advisory IDs.
        </p>
      </div>

      <div className="discs">
        {disclosures.map((d, i) => {
          const isAudit = d.id === 'MCP-AUDIT'
          return (
            <motion.article
              key={d.id}
              className="disc"
              style={{ '--sev': SEV[d.severity] }}
              {...card}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="disc-top">
                <span className={`disc-ghsa ${isAudit ? 'audit' : ''}`}>{isAudit ? 'AUDIT SERIES' : d.id}</span>
                {d.cvss
                  ? <span className="disc-cvss b" style={{ background: SEV[d.severity] }}>CVSS {d.cvss}</span>
                  : <span className="disc-cvss" style={{ background: 'var(--bg-3)', color: SEV[d.severity] }}>{d.severity}</span>}
              </div>
              <div className="disc-pkg">{d.pkg}</div>
              <div className="disc-eco">{d.eco}</div>
              <div className="disc-title">{d.title}</div>
              <p className="disc-body">{d.body}</p>
              <div className="disc-foot">
                <span className="disc-cwe">{d.cwe}</span>
                <span className="disc-status">{isAudit ? 'ongoing' : 'reported · published'}</span>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
