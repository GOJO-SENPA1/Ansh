# Ansh // portfolio

A hacker-terminal portfolio for a security researcher / bug bounty hunter.
React + Vite, CRT/phosphor aesthetic, zero backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs static site to ./dist
npm run preview    # preview the production build
```

Deploy `dist/` anywhere static: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

## Make it yours

**Everything you edit lives in one file:** `src/data/content.js`
- `identity` — name, handle, role, taglines, status
- `stats` — the headline numbers in the hero
- `about` — your first-person bio
- `findings` — your bugs (targets stay `[REDACTED]` — respect disclosure rules)
- `arsenal` / `tools` — skill bars + toolchain
- `writeups` — blog posts / tools you've built
- `social` — your links (github, h1, x, email)

**Colors / fonts:** the `:root` block at the top of `src/index.css`.
Swap the phosphor green for amber or cyan by changing `--green` and friends.

## Structure

```
src/
  data/content.js     ← edit this
  App.jsx             ← composition
  index.css           ← all styling + CRT effects
  hooks.js            ← reveal / typewriter / count-up
  components/         ← Boot, Cursor, Effects, Nav
  sections/           ← Hero, About, Findings, Arsenal, Writeups, Contact
```

## Notes
- Custom cursor + boot sequence are disabled gracefully on touch devices.
- Respects `prefers-reduced-motion`.
- Press **Esc** to skip the boot animation.
