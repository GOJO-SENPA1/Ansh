import { useState } from 'react'
import { social, identity } from '../data/content'
import { useReveal } from '../hooks'

const EMAIL = social.find((s) => s.label === 'email')?.handle || ''
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Reaching out — saw your portfolio')}`

export default function Contact() {
  const [ref, shown] = useReveal()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked */ }
  }

  const rows = social.filter((s) => s.label !== 'email')

  return (
    <section id="contact" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">07</span> <span className="txt">contact</span> — open a channel</div>

        <h2 className="contact-head">let&apos;s build<br />something <span className="acc">secure.</span></h2>
        <p className="contact-sub">
          Hiring, a research collaboration, a private program invite, or just want to compare notes on an auth
          bypass — I read everything. Fastest routes below.
        </p>

        <div className="contact-grid">
          <div className="social-list">
            {rows.map((s) => (
              <a className="social-row" href={s.href} key={s.label} target="_blank" rel="noreferrer">
                <span className="social-label">{s.label}</span>
                <span className="social-handle">{s.handle}</span>
                <span className="social-go">open ↗</span>
              </a>
            ))}
            <div className="social-row mail-wrap">
              <span className="social-label">email</span>
              <span className="social-handle">{EMAIL}</span>
              <button className="copy-btn" onClick={copy}>{copied ? 'copied ✓' : 'copy'}</button>
            </div>
          </div>

          <aside className="term contact-card">
            <div className="term-bar">
              <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
              <span className="term-title">~/ <b>reach.sh</b></span>
            </div>
            <div className="term-body">
              <div><span className="k">status</span>  <span className="v">{identity.availability}</span></div>
              <div><span className="k">timezone</span> flexible · async-friendly</div>
              <div><span className="k">reply</span>   usually within a day</div>
              <div className="contact-cta">
                <a className="btn gold" href={MAILTO}>email me →</a>
                <a className="btn" href={social.find((s) => s.label === 'github')?.href} target="_blank" rel="noreferrer">github</a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="footer">
        <b>{'<'}/{'>'}</b> designed &amp; built by {identity.fullName} · React + Vite · no trackers, no cookies · {new Date().getFullYear()}
      </footer>
    </section>
  )
}
