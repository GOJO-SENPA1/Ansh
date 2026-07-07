import { capabilities, tools } from '../data/content'
import { useReveal } from '../hooks'

// bar width is REAL: proportional to documented finding count, not a vibe.
const MAX = Math.max(...capabilities.map((c) => c.count))

export default function Arsenal() {
  const [ref, shown] = useReveal()
  return (
    <section id="capabilities" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">04</span> <span className="txt">capabilities</span> — weighted by real findings</div>

        <div className="cap-grid">
          <div>
            {capabilities.map((c, i) => (
              <div className="cap-row" key={c.cls}>
                <div className="cap-top">
                  <span className="cap-name">{c.cls}</span>
                  <span className="cap-count">{c.count}<span className="l"> {c.count === 1 ? 'finding' : 'findings'}</span></span>
                </div>
                <div className="cap-track">
                  <div
                    className="cap-fill"
                    style={{ width: shown ? `${(c.count / MAX) * 100}%` : '0%', transitionDelay: `${0.1 + i * 0.08}s` }}
                  />
                </div>
                <div className="cap-note">{c.note}</div>
              </div>
            ))}
          </div>

          <aside className="term tools-card">
            <div className="term-bar">
              <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
              <span className="term-title">~/ <b>which -a</b></span>
            </div>
            <div className="term-body">
              <div className="tools-head">{'>'} <b>daily toolchain</b> — recon → discovery → exploit</div>
              <div className="tools-cloud">
                {tools.map((t) => <span className="tool" key={t}>{t}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
