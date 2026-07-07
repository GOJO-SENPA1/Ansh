import { about, approach, identity } from '../data/content'
import { useReveal } from '../hooks'

// highlight a few key phrases without over-marking the prose
function renderAbout(text) {
  const parts = text.split(/(real, exploitable bug|two critical account-\/tenant-takeovers|two published GitHub\nSecurity Advisories|Low plus low equals critical)/g)
  return parts.map((p, i) =>
    /real, exploitable bug|two published GitHub/.test(p) ? <span className="hl" key={i}>{p}</span>
    : /two critical account|Low plus low equals critical/.test(p) ? <span className="gd" key={i}>{p}</span>
    : p
  )
}

export default function About() {
  const [ref, shown] = useReveal()
  return (
    <section id="approach" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">01</span> <span className="txt">whoami</span> — how I hunt</div>

        <div className="about-grid">
          <div>
            <p className="about-text">{renderAbout(about)}</p>

            <div className="approach">
              {approach.map((a) => (
                <div className="approach-row" key={a.k}>
                  <div className="approach-k">{a.k}</div>
                  <div>
                    <div className="approach-t">{a.title}</div>
                    <div className="approach-b">{a.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="term">
            <div className="term-bar">
              <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
              <span className="term-title">~/ <b>operator.cfg</b></span>
            </div>
            <div className="term-body">
              <div className="cfg-row"><span className="cfg-k">handle</span><span className="cfg-v acc">{identity.handle}</span></div>
              <div className="cfg-row"><span className="cfg-k">name</span><span className="cfg-v">{identity.fullName}</span></div>
              <div className="cfg-row"><span className="cfg-k">role</span><span className="cfg-v gold">hunter</span></div>
              <div className="cfg-row"><span className="cfg-k">focus</span><span className="cfg-v">auth · access-control</span></div>
              <div className="cfg-row"><span className="cfg-k"></span><span className="cfg-v">ssrf · xss · rce</span></div>
              <div className="cfg-row"><span className="cfg-k">method</span><span className="cfg-v">hypothesis-driven</span></div>
              <div className="cfg-row"><span className="cfg-k">currency</span><span className="cfg-v gold">impact only</span></div>
              <div className="cfg-row"><span className="cfg-k">platforms</span><span className="cfg-v">H1 · YWH · BC</span></div>
              <div className="cfg-row"><span className="cfg-k">status</span><span className="cfg-v acc">available ▸</span></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
