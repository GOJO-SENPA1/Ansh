import { about, identity } from '../data/content'
import { useReveal } from '../hooks'

export default function About() {
  const [ref, shown] = useReveal()
  return (
    <section id="about" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="num">01.</span> whoami</div>

        <div className="about-grid">
          <p className="about-text">
            {about.split(/(\bbug bounty hunter\b|\bcritical\b|\bchain\b|\bauth boundaries\b)/g).map((part, i) =>
              /bug bounty hunter|critical|chain|auth boundaries/.test(part)
                ? <span className="hl" key={i}>{part}</span>
                : part
            )}
          </p>

          <div className="term about-side">
            <div className="term-bar">
              <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
              <span className="term-title">~/ <b>operator.cfg</b></span>
            </div>
            <div className="term-body">
              <div className="kv"><span className="k">handle</span><span className="v">{identity.handle}</span></div>
              <div className="kv"><span className="k">role</span><span className="v amber">hunter</span></div>
              <div className="kv"><span className="k">specialties</span><span className="v">access-control</span></div>
              <div className="kv"><span className="k"></span><span className="v">auth / jwt</span></div>
              <div className="kv"><span className="k"></span><span className="v">ssrf / xss</span></div>
              <div className="kv"><span className="k">method</span><span className="v">hypothesis-driven</span></div>
              <div className="kv"><span className="k">currency</span><span className="v amber">impact only</span></div>
              <div className="kv"><span className="k">status</span><span className="v">{'>'}_ available</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
