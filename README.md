# ansh — portfolio

Personal site for a security researcher / bug-bounty hunter. An "operator's console"
aesthetic — refined dark, terminal DNA, threat-intel restraint. React + Vite, zero backend,
no trackers.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production

```bash
npm run build      # static site → ./dist
npm run preview    # preview the production build
```

Deploys to Netlify from `main` (`netlify.toml`, publish `dist/`). Security headers + CSP
are set there. Any static host works (the build is fully self-contained bar Google Fonts).

## Make it yours

**Everything you edit lives in one file:** `src/data/content.js`
- `identity` — name, handle, role, focus, taglines, availability
- `metrics` — the four headline numbers in the hero (keep them true)
- `about` / `approach` — first-person bio + how-I-work rail
- `findings` — validated bugs (`impact` = the money sentence, `detail` = mechanism/proof;
  private targets stay `[ REDACTED ]` by class — respect disclosure rules)
- `disclosures` — public open-source advisories (GHSA IDs, CVSS, CWE)
- `capabilities` — vuln-class breakdown; bar width is the real finding count, not a vibe
- `tools` — daily toolchain
- `writeups` — published research (`status: 'live' | 'draft'`)
- `social` — links (github, linkedin, medium, twitter, email)

**Colors / fonts:** the `:root` block at the top of `src/index.css`. Type is
Chakra Petch (display) + JetBrains Mono (mono) + Familjen Grotesk (body).

## Structure

```
src/
  data/content.js     ← edit this (single source of truth)
  App.jsx             ← composition
  index.css           ← design system + all component styles
  hooks.js            ← reveal / typewriter / count-up
  components/         ← Boot, Effects, Nav, Terminal, Scramble
  sections/           ← Hero, About, Findings, Disclosures, Arsenal(=capabilities),
                        Writeups, Contact
```

## Notes
- Boot plays once per session (sessionStorage), skippable with **Esc**.
- Respects `prefers-reduced-motion`; the interactive shell is keyboard-navigable.
- No custom cursor, no matrix takeover — motion is intentional and quiet.
