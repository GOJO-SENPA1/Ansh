import { arsenal, tools } from '../data/content'
import { useReveal } from '../hooks'

export default function Arsenal() {
  const [ref, shown] = useReveal()
  return (
    <section id="arsenal" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="num">03.</span> nmap -sV ./skills</div>

        <div className="arsenal-grid">
          <div>
            {arsenal.map((s, i) => (
              <div className="scan-row" key={s.name}>
                <div className="scan-top">
                  <span className="scan-name">{s.name}</span>
                  <span className="scan-pct">{s.level}%</span>
                </div>
                <div className="scan-track">
                  <div
                    className="scan-fill"
                    style={{
                      width: shown ? `${s.level}%` : '0%',
                      transition: `width 1s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.09}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="term">
            <div className="term-bar">
              <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
              <span className="term-title">~/ <b>which *</b></span>
            </div>
            <div className="term-body">
              <div style={{ color: 'var(--text-mute)', fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
                {'>'} loaded toolchain:
              </div>
              <div className="tools-cloud">
                {tools.map((t) => <span className="tool-chip" key={t}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
