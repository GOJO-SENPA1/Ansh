import { useState } from 'react'
import Boot from './components/Boot'
import Effects from './components/Effects'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Findings from './sections/Findings'
import Disclosures from './sections/Disclosures'
import Arsenal from './sections/Arsenal'
import Writeups from './sections/Writeups'
import Terminal from './components/Terminal'
import Contact from './sections/Contact'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      {!booted && <Boot onDone={() => setBooted(true)} />}
      <Effects />

      {booted && (
        <>
          <Nav />
          <main>
            <Hero />
            <About />
            <Findings />
            <Disclosures />
            <Arsenal />
            <Writeups />
            <Terminal />
            <Contact />
          </main>
        </>
      )}
    </>
  )
}
