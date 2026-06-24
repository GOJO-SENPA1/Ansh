import { useState, useRef, useEffect } from 'react'
import { social, identity } from '../data/content'
import { useReveal } from '../hooks'

const urlOf = (label) => social.find((s) => s.label === label)?.href || '#'
const FOLLOW = [
  { label: 'medium', icon: 'M', href: urlOf('medium') },
  { label: 'twitter / x', icon: '𝕏', href: urlOf('twitter/x') },
  { label: 'linkedin', icon: 'in', href: urlOf('linkedin') },
]

const EMAIL = social.find((s) => s.label === 'email')?.handle || 'you@domain.com'
const SU = encodeURIComponent('yo — saw your portfolio 👾')
const BODY = encodeURIComponent('hey Ansh,\n\n')

// web-compose deep links — open the visitor's webmail with a pre-filled draft
const COMPOSERS = [
  { id: 'gmail', label: 'Gmail', url: `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${SU}&body=${BODY}` },
  { id: 'outlook', label: 'Outlook', url: `https://outlook.live.com/mail/0/deeplink/compose?to=${EMAIL}&subject=${SU}&body=${BODY}` },
  { id: 'yahoo', label: 'Yahoo', url: `https://compose.mail.yahoo.com/?to=${EMAIL}&subject=${SU}&body=${BODY}` },
  { id: 'default', label: 'Default mail app', url: `mailto:${EMAIL}?subject=${SU}&body=${BODY}`, native: true },
]

function EmailRow() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mail-wrap" ref={wrapRef}>
      <button className="mail-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="social-label">email</span>
        <span className="social-handle">{EMAIL}</span>
        <span className="social-go">{open ? 'close ✕' : 'compose ✉'}</span>
      </button>

      {open && (
        <div className="mail-menu">
          <div className="mail-menu-head"># open compose in…</div>
          {COMPOSERS.map((c) => (
            <a
              key={c.id}
              className="mail-opt"
              href={c.url}
              target={c.native ? undefined : '_blank'}
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              <span className="mail-opt-bullet">▸</span> {c.label}
              <span className="mail-opt-hint">{c.native ? 'mailto' : 'web'}</span>
            </a>
          ))}
          <button className="mail-opt copy" onClick={copy}>
            <span className="mail-opt-bullet">⎘</span> {copied ? 'copied to clipboard!' : 'copy address'}
            <span className="mail-opt-hint">{copied ? '✓' : EMAIL}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const [ref, shown] = useReveal()
  return (
    <section id="contact" className="wrap contact">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="num">05.</span> ./contact.sh
        </div>

        <h2 className="contact-head">let&apos;s talk.</h2>
        <p className="contact-sub">
          got a program, a lead, or a target that needs breaking? open a channel.
        </p>

        <div className="follow-bar">
          <span className="follow-label">{'>'} follow / connect:</span>
          {FOLLOW.map((f) => (
            <a key={f.label} className="follow-btn" href={f.href} target="_blank" rel="noreferrer">
              <span className="follow-icon">{f.icon}</span> {f.label}
            </a>
          ))}
        </div>

        <div className="term contact-term">
          <div className="term-bar">
            <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
            <span className="term-title">root@{identity.handle}: <b>~/contact</b></span>
          </div>
          <div className="term-body">
            <div className="social-list">
              {social
                .filter((s) => s.label !== 'email')
                .map((s) => (
                  <a className="social-row" href={s.href} key={s.label} target="_blank" rel="noreferrer">
                    <span className="social-label">{s.label}</span>
                    <span className="social-handle">{s.handle}</span>
                    <span className="social-go">open ↗</span>
                  </a>
                ))}
              <EmailRow />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <span className="grn">{'<'}/{'>'}</span> built &amp; broken by {identity.handle} ·
        no trackers · no frameworks of trust · est. {'>'}_2026
      </footer>
    </section>
  )
}
