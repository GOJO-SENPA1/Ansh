import { useState, useEffect } from 'react'

const LINKS = [
  { id: 'approach', n: '01' },
  { id: 'findings', n: '02' },
  { id: 'disclosures', n: '03' },
  { id: 'capabilities', n: '04' },
  { id: 'writeups', n: '05' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" className="nav-brand">ansh<b>.</b><span className="cur">_</span></a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} className="nav-link">
            <span className="n">{l.n}</span> {l.id}
          </a>
        ))}
        <a href="#contact" className="nav-cta">get in touch</a>
      </div>
    </nav>
  )
}
