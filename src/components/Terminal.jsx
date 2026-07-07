import { useState, useRef, useEffect, useCallback } from 'react'
import { identity, findings, capabilities, tools, social, about, writeups, disclosures } from '../data/content'
import { useReveal } from '../hooks'

const BANNER = [
  ' █████╗ ███╗   ██╗███████╗██╗  ██╗',
  '██╔══██╗████╗  ██║██╔════╝██║  ██║',
  '███████║██╔██╗ ██║███████╗███████║',
  '██╔══██║██║╚██╗██║╚════██║██╔══██║',
  '██║  ██║██║ ╚████║███████║██║  ██║',
  '╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝',
]
const FILES = ['about.md', 'findings.log', 'disclosures.log', 'capabilities.sh', 'writeups/', 'contact.sh', '.bash_history']
const L = (t, c) => ({ t, c })

function help() {
  return [
    L('available commands:', 'c-gold'),
    L('  whoami            who is ansh'),
    L('  findings [sev]    validated bugs  (crit|high|med|low)'),
    L('  disclosures       published GHSA advisories'),
    L('  capabilities      vuln-class breakdown'),
    L('  writeups          published research'),
    L('  cat <file>        read a file  (try: about.md)'),
    L('  ls [-la] · tools · contact · banner'),
    L('  clear · history · echo · pwd · date · help'),
  ]
}

function cmdFindings(args) {
  const sev = (args[0] || '').toUpperCase()
  const list = findings.filter((f) => !sev || f.severity === sev)
  if (!list.length) return [L(`no findings at severity "${sev}". try crit|high|med|low`, 'c-red')]
  return list.flatMap((f) => [
    L(`[${f.severity}] ${f.id}  ${f.title}`, `sev-${f.severity}`),
    L(`        ${f.cls}  ·  ${f.target}`, 'c-dim'),
  ])
}

function cmdDisclosures() {
  return disclosures.flatMap((d) => [
    L(`${d.id === 'MCP-AUDIT' ? '[audit]' : d.id}  ${d.pkg}${d.cvss ? `  (CVSS ${d.cvss})` : ''}`, 'c-acc'),
    L(`        ${d.title}`, 'c-dim'),
  ])
}

function cmdContact() {
  return [
    L('open a channel:', 'c-gold'),
    ...social.map((s) => L(`  ${s.label.padEnd(9)} ${s.handle}  ${s.href}`, 'c-acc')),
  ]
}

function buildCommands() {
  return {
    help, '?': help,
    whoami: () => [
      L(`${identity.fullName} (${identity.handle}) — ${identity.role}`, 'c-acc'),
      L(''),
      L('  bug-bounty hunter. impact is the only currency.'),
      L('  2 criticals · 2 GHSA advisories · 17 documented findings.'),
      L(`  ${identity.availability.toLowerCase()}.`, 'c-dim'),
    ],
    ls: (args) => {
      if (['-la', '-l', '-al'].includes(args[0])) {
        return [
          L('total 42', 'c-dim'),
          ...FILES.map((f) => L(`-rw-r--r--  1 ansh  ansh  ${(f.length * 173) % 8000 + 200}  ${f}`)),
        ]
      }
      return [L(FILES.join('   '), 'c-acc')]
    },
    cat: (args) => {
      const f = args[0]
      if (!f) return [L('cat: missing operand. try `ls`', 'c-red')]
      if (f === 'about.md') return about.split('\n').map((l) => L(l))
      if (f === 'findings.log') return cmdFindings([])
      if (f === 'disclosures.log') return cmdDisclosures()
      if (f === 'contact.sh') return cmdContact()
      if (f === '.bash_history')
        return [
          L('subfinder -d target -all | httpx -sc -td', 'c-dim'),
          L('katana -u target | grep -iE "api|graphql"', 'c-dim'),
          L('jwt_tool token.txt -X a   # alg:none', 'c-dim'),
          L('arjun -u target/api -m GET', 'c-dim'),
          L('# the rest stays in scope ;)', 'c-dim'),
        ]
      if (f === 'writeups/') return [L('cat: writeups/: Is a directory. try `writeups`', 'c-red')]
      return [L(`cat: ${f}: No such file or directory`, 'c-red')]
    },
    findings: cmdFindings, bugs: cmdFindings,
    disclosures: cmdDisclosures, cve: cmdDisclosures, ghsa: cmdDisclosures,
    capabilities: () =>
      capabilities.map((c) => {
        const filled = Math.round((c.count / 4) * 16)
        return L(`  ${'█'.repeat(filled)}${'░'.repeat(16 - filled)}  ${String(c.count).padStart(2)}  ${c.cls}`, 'c-acc')
      }),
    skills: () => buildCommands().capabilities(),
    tools: () => [L('daily toolchain:', 'c-gold'), L('  ' + tools.join('  ·  '), 'c-acc')],
    writeups: () => writeups.flatMap((w) => [L(`◈ [${w.kind}] ${w.title}`, 'c-acc'), L(`    ${w.blurb}`, 'c-dim')]),
    contact: cmdContact, social: cmdContact,
    sudo: (args) => {
      if (!args.length) return [L('usage: sudo <command>', 'c-dim')]
      return [L('ansh is not in the sudoers file. This incident will not be reported.', 'c-red')]
    },
    hire: () => [L('good call. → run `contact`, or scroll to the bottom.', 'c-gold')],
    hireme: () => [L('good call. → run `contact`, or scroll to the bottom.', 'c-gold')],
    banner: () => BANNER.map((l) => L(l, 'c-acc')),
    echo: (args) => [L(args.join(' '))],
    pwd: () => [L('/home/ansh/portfolio', 'c-acc')],
    date: () => [L(new Date().toString(), 'c-acc')],
    clear: () => 'CLEAR', history: () => 'HISTORY',
  }
}

export default function Terminal() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [cmdLog, setCmdLog] = useState([])
  const [logIdx, setLogIdx] = useState(-1)
  const [booted, setBooted] = useState(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const [ref, shown] = useReveal()
  const commands = useRef(buildCommands()).current

  const run = useCallback(
    (raw) => {
      const trimmed = raw.trim()
      const [name, ...args] = trimmed.split(/\s+/)
      const key = name.toLowerCase()
      let out
      if (!trimmed) out = []
      else if (commands[key]) {
        const res = commands[key](args)
        if (res === 'CLEAR') { setHistory([]); return }
        out = res === 'HISTORY' ? cmdLog.map((c, i) => L(`  ${String(i + 1).padStart(3)}  ${c}`, 'c-dim')) : res
      } else out = [L(`command not found: ${name}. type 'help'.`, 'c-red')]
      setHistory((h) => [...h, { cmd: trimmed, out }])
      if (trimmed) setCmdLog((l) => [...l, trimmed])
    },
    [commands, cmdLog]
  )

  useEffect(() => {
    if (!shown || booted) return
    setBooted(true)
    setHistory([{ out: [...BANNER.map((l) => L(l, 'c-acc')), L(''), L("type 'help' for commands. ↵", 'c-dim')] }])
    const t = setTimeout(() => run('whoami'), 600)
    return () => clearTimeout(t)
  }, [shown, booted, run])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [history])

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); setInput(''); setLogIdx(-1) }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!cmdLog.length) return
      const ni = logIdx < 0 ? cmdLog.length - 1 : Math.max(0, logIdx - 1)
      setLogIdx(ni); setInput(cmdLog[ni])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (logIdx < 0) return
      const ni = logIdx + 1
      if (ni >= cmdLog.length) { setLogIdx(-1); setInput('') } else { setLogIdx(ni); setInput(cmdLog[ni]) }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setHistory([]) }
    else if (e.key === 'Tab') {
      e.preventDefault()
      const m = Object.keys(commands).find((c) => c.startsWith(input.toLowerCase()))
      if (m) setInput(m)
    }
  }

  return (
    <section id="shell" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="idx">06</span> <span className="txt">shell</span> — it actually works, type something</div>

        <div className="term console" onClick={() => inputRef.current?.focus()}>
          <div className="term-bar">
            <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
            <span className="term-title">guest@{identity.handle}: <b>~/portfolio</b> — zsh</span>
            <span className="console-hint">▲▼ history · tab · ⌃L clear</span>
          </div>
          <div className="console-body" ref={bodyRef}>
            {history.map((h, i) => (
              <div key={i} className="console-block">
                {h.cmd !== undefined && (
                  <div className="console-cmd"><span className="console-ps">guest@ansh</span><span className="console-sep">:~$</span>{h.cmd}</div>
                )}
                {h.out.map((line, j) => (
                  <div key={j} className={`console-out ${line.c || ''}`}>{line.t || ' '}</div>
                ))}
              </div>
            ))}
            <div className="console-input-row">
              <span className="console-ps">guest@ansh</span><span className="console-sep">:~$</span>
              <input
                ref={inputRef} className="console-input" value={input}
                onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
                spellCheck="false" autoComplete="off" autoCapitalize="off" aria-label="terminal input"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
