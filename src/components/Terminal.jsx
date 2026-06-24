import { useState, useRef, useEffect, useCallback } from 'react'
import { identity, findings, arsenal, tools, social, about, writeups } from '../data/content'
import { useReveal } from '../hooks'

const BANNER = [
  ' █████╗ ███╗   ██╗███████╗██╗  ██╗',
  '██╔══██╗████╗  ██║██╔════╝██║  ██║',
  '███████║██╔██╗ ██║███████╗███████║',
  '██╔══██║██║╚██╗██║╚════██║██╔══██║',
  '██║  ██║██║ ╚████║███████║██║  ██║',
  '╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝',
]

const FILES = ['about.md', 'findings.log', 'arsenal.sh', 'writeups/', 'contact.sh', 'secret.txt', '.bash_history']

// each output line: { t: string, c?: className }
const L = (t, c) => ({ t, c })

function help() {
  return [
    L('available commands:', 'c-amber'),
    L('  help              this menu'),
    L('  whoami            who is ansh'),
    L('  ls [-la]          list files'),
    L('  cat <file>        read a file  (try: secret.txt)'),
    L('  findings [sev]    list bugs  (crit|high|med|low)'),
    L('  arsenal           skill loadout'),
    L('  tools             toolchain'),
    L('  writeups          published research'),
    L('  contact           open a channel'),
    L('  sudo <cmd>        elevate (good luck)'),
    L('  matrix            ▓▒░ wake up ░▒▓'),
    L('  banner · clear · echo · pwd · date · history'),
  ]
}

function buildCommands(setMatrix) {
  return {
    help,
    '?': help,
    whoami: () => [
      L(`${identity.handle} :: ${identity.role}`, 'c-green'),
      L(''),
      L('  a bug bounty hunter. not a pen tester, not a scanner.'),
      L('  i find the bug that pays and prove it cold.'),
      L(`  status: ${identity.status} · ${identity.location}`, 'c-dim'),
    ],
    ls: (args) => {
      if (args[0] === '-la' || args[0] === '-l' || args[0] === '-al') {
        return [
          L('total 1337', 'c-dim'),
          ...FILES.map((f) =>
            L(`-rwx------  1 ansh  root  ${(f.length * 311) % 9000 + 100}  ${f}`, f === 'secret.txt' ? 'c-amber' : '')
          ),
        ]
      }
      return [L(FILES.join('   '), 'c-green')]
    },
    cat: (args) => {
      const f = args[0]
      if (!f) return [L('cat: missing file operand. try `ls`', 'c-red')]
      if (f === 'about.md') return about.split('\n').map((l) => L(l))
      if (f === 'findings.log') return cmdFindings([])
      if (f === 'contact.sh') return cmdContact()
      if (f === 'secret.txt')
        return [
          L('┌─────────────────────────────────────────────┐', 'c-amber'),
          L('│  you actually typed it. respect. 🫡          │', 'c-amber'),
          L('│  low + low = critical. always ask what       │', 'c-amber'),
          L('│  the bug *unlocks*. that mindset is the edge. │', 'c-amber'),
          L('│  now go break something. — ansh              │', 'c-amber'),
          L('└─────────────────────────────────────────────┘', 'c-amber'),
        ]
      if (f === '.bash_history')
        return [
          L('sudo rm -rf /scope_creep', 'c-dim'),
          L('curl -s target/.git/config', 'c-dim'),
          L('ffuf -w wordlist.txt -u FUZZ', 'c-dim'),
          L('jwt_tool token.txt -X a', 'c-dim'),
          L('# the rest is redacted ;)', 'c-dim'),
        ]
      if (f === 'writeups/') return [L('cat: writeups/: Is a directory. try `writeups`', 'c-red')]
      return [L(`cat: ${f}: No such file or directory`, 'c-red')]
    },
    findings: (args) => cmdFindings(args),
    bugs: (args) => cmdFindings(args),
    arsenal: () =>
      arsenal.map((s) => {
        const filled = Math.round(s.level / 5)
        const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)
        return L(`  ${bar}  ${String(s.level).padStart(3)}%  ${s.name}`, 'c-green')
      }),
    skills: () => buildCommands(setMatrix).arsenal(),
    tools: () => [L('loaded toolchain:', 'c-amber'), L('  ' + tools.join('  ·  '), 'c-green')],
    writeups: () =>
      writeups.flatMap((w) => [L(`◇ [${w.kind}] ${w.title}`, 'c-green'), L(`    ${w.blurb}`, 'c-dim')]),
    contact: cmdContact,
    social: cmdContact,
    sudo: (args) => {
      if (!args.length) return [L('usage: sudo <command>', 'c-dim')]
      return [
        L(`[sudo] password for guest: `, 'c-dim'),
        L('Sorry, user guest is not in the sudoers file.', 'c-red'),
        L('This incident has been reported. (jk. but nice try 😏)', 'c-amber'),
      ]
    },
    matrix: () => {
      setMatrix(true)
      return [L('▓▒░ wake up, neo… ░▒▓', 'c-green')]
    },
    banner: () => BANNER.map((l) => L(l, 'c-green')),
    echo: (args) => [L(args.join(' '))],
    pwd: () => [L('/home/ansh/portfolio', 'c-green')],
    date: () => [L(new Date().toString(), 'c-green')],
    hire: () => [L('smart move. → scroll to ./contact.sh or run `contact`', 'c-amber')],
    hireme: () => [L('smart move. → scroll to ./contact.sh or run `contact`', 'c-amber')],
    exit: () => [L('nice try. there is no escape from the terminal. 👁', 'c-amber')],
    clear: () => 'CLEAR',
    history: () => 'HISTORY',
  }
}

function cmdFindings(args) {
  const sev = (args[0] || '').toUpperCase()
  const list = findings.filter((f) => !sev || f.severity === sev)
  if (!list.length) return [L(`no findings at severity "${sev}". try crit|high|med|low`, 'c-red')]
  return list.flatMap((f) => [
    L(`[${f.severity}] ${f.id}  ${f.title}`, `sev-${f.severity}`),
    L(`        ${f.target}  ·  #${f.tags.join(' #')}`, 'c-dim'),
  ])
}

function cmdContact() {
  return [
    L('open a channel:', 'c-amber'),
    ...social.map((s) => L(`  ${s.label.padEnd(11)} ${s.handle}  ${s.href}`, 'c-green')),
  ]
}

export default function Terminal({ onMatrix }) {
  const [history, setHistory] = useState([]) // {prompt?, cmd?, out:[lines]}
  const [input, setInput] = useState('')
  const [cmdLog, setCmdLog] = useState([])
  const [logIdx, setLogIdx] = useState(-1)
  const [booted, setBooted] = useState(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const [ref, shown] = useReveal()

  const commands = useRef(buildCommands((on) => on && onMatrix?.())).current

  const run = useCallback(
    (raw) => {
      const trimmed = raw.trim()
      const [name, ...args] = trimmed.split(/\s+/)
      const key = name.toLowerCase()
      let out
      if (!trimmed) out = []
      else if (commands[key]) {
        const res = commands[key](args)
        if (res === 'CLEAR') {
          setHistory([])
          return
        }
        if (res === 'HISTORY') {
          out = cmdLog.map((c, i) => L(`  ${String(i + 1).padStart(3)}  ${c}`, 'c-dim'))
        } else out = res
      } else {
        out = [L(`command not found: ${name}. type 'help' for the list.`, 'c-red')]
      }
      setHistory((h) => [...h, { cmd: trimmed, out }])
      if (trimmed) setCmdLog((l) => [...l, trimmed])
    },
    [commands, cmdLog]
  )

  // intro: print banner + auto-run whoami, then hand control
  useEffect(() => {
    if (!shown || booted) return
    setBooted(true)
    setHistory([{ out: [...BANNER.map((l) => L(l, 'c-green')), L(''), L("type 'help' to begin. ↵", 'c-dim')] }])
    const t = setTimeout(() => run('whoami'), 650)
    return () => clearTimeout(t)
  }, [shown, booted, run])

  // keep scrolled to bottom
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [history])

  const onKey = (e) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
      setLogIdx(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCmdLog((l) => {
        if (!l.length) return l
        const ni = logIdx < 0 ? l.length - 1 : Math.max(0, logIdx - 1)
        setLogIdx(ni)
        setInput(l[ni])
        return l
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCmdLog((l) => {
        if (logIdx < 0) return l
        const ni = logIdx + 1
        if (ni >= l.length) {
          setLogIdx(-1)
          setInput('')
        } else {
          setLogIdx(ni)
          setInput(l[ni])
        }
        return l
      })
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setHistory([])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const pool = Object.keys(commands)
      const m = pool.find((c) => c.startsWith(input.toLowerCase()))
      if (m) setInput(m)
    }
  }

  return (
    <section id="shell" className="wrap">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="eyebrow"><span className="num">//</span> live shell — it actually works, type something</div>

        <div className="term console-win" onClick={() => inputRef.current?.focus()}>
          <div className="term-bar">
            <span className="term-dot r" /><span className="term-dot y" /><span className="term-dot g" />
            <span className="term-title">guest@{identity.handle}: <b>~/portfolio</b> — zsh</span>
            <span className="console-hint">▲▼ history · tab · ⌃L clear</span>
          </div>
          <div className="console-body" ref={bodyRef}>
            {history.map((h, i) => (
              <div key={i} className="console-block">
                {h.cmd !== undefined && (
                  <div className="console-cmd">
                    <span className="console-ps">guest@ansh</span>
                    <span className="console-sep">:~$</span> {h.cmd}
                  </div>
                )}
                {h.out.map((line, j) => (
                  <div key={j} className={`console-out ${line.c || ''}`}>{line.t || ' '}</div>
                ))}
              </div>
            ))}
            <div className="console-input-row">
              <span className="console-ps">guest@ansh</span>
              <span className="console-sep">:~$</span>
              <input
                ref={inputRef}
                className="console-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                aria-label="terminal input"
              />
              <span className="console-caret" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
