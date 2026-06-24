import { useState, useEffect } from 'react'
import { identity } from '../data/content'

const LINKS = [
  { id: 'about', n: '01' },
  { id: 'findings', n: '02' },
  { id: 'arsenal', n: '03' },
  { id: 'writeups', n: '04' },
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
      <a href="#top" className="nav-brand">
        {identity.handle}<span className="blink">_</span>
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} className="nav-link">
            <span className="b">{l.n}.</span> {l.id}
          </a>
        ))}
        <a href="#contact" className="nav-cta">./contact.sh</a>
      </div>
    </nav>
  )
}
