import { useState, useEffect, useCallback } from 'react'
import Boot from './components/Boot'
import Cursor from './components/Cursor'
import Effects from './components/Effects'
import GlitchFX from './components/GlitchFX'
import MatrixRain from './components/MatrixRain'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Terminal from './components/Terminal'
import Findings from './sections/Findings'
import Arsenal from './sections/Arsenal'
import Writeups from './sections/Writeups'
import Contact from './sections/Contact'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [matrix, setMatrix] = useState(false)

  // full-screen matrix takeover (konami code or `matrix` shell command)
  const triggerMatrix = useCallback(() => setMatrix(true), [])

  useEffect(() => {
    if (!matrix) return
    const off = () => setMatrix(false)
    const t = setTimeout(off, 7000)
    window.addEventListener('keydown', off)
    window.addEventListener('click', off)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', off)
      window.removeEventListener('click', off)
    }
  }, [matrix])

  return (
    <>
      {!booted && <Boot onDone={() => setBooted(true)} />}
      <Cursor />
      <Effects />

      {booted && (
        <>
          <GlitchFX onMatrix={triggerMatrix} />
          <Nav />
          <main>
            <Hero />
            <About />
            <Terminal onMatrix={triggerMatrix} />
            <Findings />
            <Arsenal />
            <Writeups />
            <Contact />
          </main>
        </>
      )}

      {matrix && (
        <div className="matrix-takeover">
          <MatrixRain fade={0.05} fontSize={18} speed={1.6} />
          <div className="matrix-msg">
            <span className="glitch" data-text="WAKE UP, NEO.">WAKE UP, NEO.</span>
            <small>[ press any key to return ]</small>
          </div>
        </div>
      )}
    </>
  )
}
