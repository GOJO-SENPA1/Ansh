// ──────────────────────────────────────────────────────────────────────────
//  EDIT EVERYTHING HERE.  This is the single source of truth for the site.
//  Swap in your real name, handles, links, findings, and writeups.
// ──────────────────────────────────────────────────────────────────────────

export const identity = {
  handle: 'ansh',
  name: 'ANSH', // shown big in the hero — your name or handle
  role: '15 y/o security researcher // bug bounty menace',
  // one-liners typed out after the prompt in the hero, cycled through
  taglines: [
    "yeah i'm 15. yeah i pop criticals. cope.",
    'auth bypass · ssrf → metadata · idor · stored xss · jwt 0day',
    "i don't do homework, i do account takeovers.",
    'low + low = critical. i just ask what the bug unlocks.',
    'currently hunting my first CVE 👀 (it is coming)',
    'redacted programs fear the `[ REDACTED ]` tag fr',
  ],
  location: 'somewhere with wifi',
  status: 'open to private invites (lmk)',
}

// Headline numbers in the hero. Make them true. (count up on scroll)
export const stats = [
  { label: 'CRITICAL (full ATO)', value: 1, suffix: '' },
  { label: 'targets pwned', value: 12, suffix: '' },
  { label: 'HIGHs landed', value: 5, suffix: '' },
  { label: 'years old (yeah rly)', value: 15, suffix: '' },
]

// about.md — first-person, blunt, hunter voice (15yo flex edition)
export const about = `okay so storytime. i'm 15 and instead of grinding ranked
i grind attack surface. i'm a bug bounty hunter — not a pen tester,
not some scanner kid spamming nuclei. i get paid per REAL bug.

the move is simple: i think like the dev who shipped the feature at
2am under a deadline, then i go straight for the corner they cut.
auth boundaries, money flows, anything that crosses a user line —
that's where the fat bounties live and i live there rent free.

depth > breadth always. i'd rather fully own ONE endpoint than poke
fifty like a tourist. then i chain it: self-xss + login csrf = ATO.
open redirect + oauth = your token is mine. low + low = critical.

tl;dr: i find the bug that pays, prove it cold, and write it so the
triager literally cannot say no. now scroll, i wanna flex. 🐐`

// Findings. Real work. Targets stay [redacted] for private programs;
// open-source CVE-class projects are named (public disclosures).
// severity: CRIT | HIGH | MED | LOW   ·   exactly ONE crit, on purpose.
export const findings = [
  {
    id: 'F-001',
    severity: 'CRIT',
    title: 'JWT signature bypass → full account takeover',
    target: '[ REDACTED ] · European bike-share platform · partner login API',
    summary:
      "ok this one is my baby 🐐. their federated login straight up did NOT check the JWT signature — alg:none and busted RS256 both walked right in. forged any victim's `sub`, got a real working session back. that's every Google-federated user = full ATO. critical. ggs no re.",
    tags: ['JWT', 'auth-bypass', 'OIDC', 'ATO'],
    bar: 99,
  },
  {
    id: 'F-002',
    severity: 'HIGH',
    title: 'Whitelisted-command RCE via pipe-arg injection',
    target: 'k8s-mcp-server · open-source (210★) · Kubernetes AI tooling',
    summary:
      "they whitelisted 'safe' pipe commands (awk, find, xargs, curl) but never validated the ARGS. so i smuggled shell into the args → arbitrary command exec on the host, which is holding cluster-admin creds btw. AI tools letting models run commands is a goldmine and nobody's looking.",
    tags: ['RCE', 'command-injection', 'whitelist-escape', 'MCP'],
    bar: 88,
  },
  {
    id: 'F-003',
    severity: 'HIGH',
    title: 'Stored XSS via javascript: scheme → org-admin ATO',
    target: '[ REDACTED ] · SaaS analytics dashboard',
    summary:
      "their html sanitizer flexed about blocking <script>/<iframe>/onerror… and then forgot to validate URL schemes 💀. so `<a href=javascript:...>` stored fine, fired in their own origin, rode the session and invited myself as org-admin. proved it end-to-end. sanitizers are not a vibe.",
    tags: ['stored-XSS', 'sanitizer-bypass', 'session-riding', 'ATO'],
    bar: 86,
  },
  {
    id: 'F-004',
    severity: 'HIGH',
    title: 'Blind stored XSS in OIDC name claims → staff session theft',
    target: '[ REDACTED ] · bike-share internal staff panel',
    summary:
      "set my OIDC given_name/name to a payload, it got stored raw, then detonated inside the STAFF admin panel when they viewed my account. blind xss that fires in a higher-priv context = steal staff session / do staff actions. second-order bugs hit different.",
    tags: ['stored-XSS', 'blind-XSS', 'OIDC-injection', 'privesc'],
    bar: 82,
  },
  {
    id: 'F-005',
    severity: 'HIGH',
    title: 'Command-allowlist bypass via command substitution (RCE)',
    target: 'cli-mcp-server · open-source (171★) · "secure" CLI MCP server',
    summary:
      "the allowlist split on spaces/operators but 'forgot' about `$(...)` and backticks, and it ran with shell=True. so command substitution evaluates BEFORE the allowlist even sees it → RCE. the word 'secure' was right there in the repo name, couldn't be me.",
    tags: ['RCE', 'allowlist-bypass', 'command-substitution', 'MCP'],
    bar: 78,
  },
  {
    id: 'F-006',
    severity: 'HIGH',
    title: 'Path-traversal sandbox escape (arbitrary file read/write)',
    target: 'filesystem MCP server · open-source',
    summary:
      "no canonicalization on relative paths so `../../` just yeets you straight out of the documented sandbox → read AND write files anywhere the server can. 'sandbox' is doing a lot of heavy lifting in their README ngl.",
    tags: ['path-traversal', 'sandbox-escape', 'file-read', 'MCP'],
    bar: 74,
  },
  {
    id: 'F-007',
    severity: 'MED',
    title: 'SSRF reaching AWS metadata via DNS + IPv6 deny-list bypass',
    target: '[ REDACTED ] · event-networking SaaS',
    summary:
      "server fetches a photoUrl for you. cute. their deny-list blocked the literal 169.254.169.254 but NOT `169.254.169.254.nip.io` or the IPv6-mapped `[::ffff:a9fe:a9fe]` — both resolve to metadata. confirmed it reaches IMDS via OOB. deny-lists age like milk.",
    tags: ['SSRF', 'cloud-metadata', 'IPv6', 'deny-list-bypass'],
    bar: 66,
  },
  {
    id: 'F-008',
    severity: 'MED',
    title: 'AppSync GraphQL BOLA — read/inject any user by tripId',
    target: '[ REDACTED ] · government transport ERP mobile app',
    summary:
      "the AppSync GraphQL mutations/subscriptions took a tripId/userId and never checked you actually OWN it. so i read other people's trip chats and injected spoofed messages + notifications into them. two-account diff, clean repro. object-level authz is not optional bestie.",
    tags: ['IDOR', 'BOLA', 'GraphQL', 'authz-bypass'],
    bar: 62,
  },
  {
    id: 'F-009',
    severity: 'MED',
    title: 'Stored XSS in embeddable map widget (no CSP, fires for anons)',
    target: '[ REDACTED ] · maps SaaS · embeddable widgets',
    summary:
      "overlay title/description stored raw, only encoded client-side (lol), then rendered as HTML in the widget origin that has NO CSP and auto-pops on load. so `<img src=x onerror=...>` runs for anonymous viewers on every third-party site embedding the map. spicy.",
    tags: ['stored-XSS', 'embedded-widget', 'no-CSP'],
    bar: 58,
  },
  {
    id: 'F-010',
    severity: 'MED',
    title: 'Unsandboxed iframe injection → full-page phishing',
    target: '[ REDACTED ] · changelog / release-notes SaaS',
    summary:
      "their post sanitizer allowed `<iframe src=https://...>` with NO sandbox attr. dropped a full-viewport iframe pointing at my phishing page, served from THEIR trusted domain with THEIR branding around it. unauth visitors just see a legit-looking login. free creds.",
    tags: ['HTML-injection', 'iframe', 'phishing', 'sanitizer-bypass'],
    bar: 54,
  },
  {
    id: 'F-011',
    severity: 'MED',
    title: 'Hardcoded OAuth client secrets shipped in prod JS',
    target: '[ REDACTED ] · B2B fintech SPA',
    summary:
      "found TWO confidential client_id:client_secret pairs base64'd right there in the production bundle. a 'confidential' secret living in a public SPA is just a public secret with extra steps. usable against their auth server, introspect tokens all day.",
    tags: ['secrets', 'OAuth', 'credential-exposure'],
    bar: 50,
  },
  {
    id: 'F-012',
    severity: 'MED',
    title: 'Unauthenticated OData $filter injection in CRM data-hub',
    target: '[ REDACTED ] · B2B dealer/customer CRM proxy',
    summary:
      "they slot your id straight into an OData `$filter=AccountNumber eq '{id}'` with zero sanitizing. a single `%27` breaks out of the filter and returns unfiltered records. latent High (would dump customer PII) — backend had a typo'd hostname saving them, lucky.",
    tags: ['OData-injection', 'filter-bypass', 'unauth'],
    bar: 48,
  },
  {
    id: 'F-013',
    severity: 'LOW',
    title: 'Unauthenticated SSRF via KML import',
    target: '[ REDACTED ] · maps SaaS',
    summary:
      "`/api/import/kml?url=` makes the backend fetch any URL you give it, unauthenticated, follows redirects, no egress allow-list. confirmed server-side fetch via OOB callback from their cloud IPs. couldn't reach anything juicy internally but the primitive is 100% real.",
    tags: ['SSRF', 'unauth', 'no-allowlist'],
    bar: 34,
  },
  {
    id: 'F-014',
    severity: 'LOW',
    title: 'Open redirect on the payment domain',
    target: '[ REDACTED ] · bike-share payments',
    summary:
      "unvalidated success_url on the checkout flow → the actual payment domain 302s you to any external site, no payment required. phishing from a trusted `payments.` host is way more believable than some random link.",
    tags: ['open-redirect', 'payment-domain', 'phishing'],
    bar: 30,
  },
  {
    id: 'F-015',
    severity: 'LOW',
    title: 'Server-side paywall bypass (mint Pro features free)',
    target: '[ REDACTED ] · maps SaaS',
    summary:
      "Pro gating was 100% client-side `isPaid()`. server never re-checked the plan on save, so i POST'd `secure:true` + a password directly and got a real Pro password-protected map for $0. client-side checks are decoration, not security.",
    tags: ['business-logic', 'paywall-bypass', 'server-validation'],
    bar: 28,
  },
  {
    id: 'F-016',
    severity: 'LOW',
    title: 'Email-squatting → onboarding denial-of-service',
    target: '[ REDACTED ] · event-networking SaaS',
    summary:
      "an attach-email mutation added emails to my account with NO ownership verification. so i pre-claim other people's emails into the global namespace and lock the real owner out of ever registering. small but annoying = valid.",
    tags: ['business-logic', 'email-verification', 'pre-claim'],
    bar: 24,
  },
]

// Arsenal — skill bars rendered like an nmap scan
export const arsenal = [
  { name: 'Broken Access Control · IDOR / BOLA / BFLA', level: 95 },
  { name: 'Authentication & JWT attacks', level: 93 },
  { name: 'SSRF & cloud metadata exploitation', level: 88 },
  { name: 'XSS — stored / DOM / sanitizer bypass', level: 91 },
  { name: 'RCE · command injection · MCP/AI tooling', level: 85 },
  { name: 'API & GraphQL abuse', level: 87 },
  { name: 'OAuth / OIDC / SAML flows', level: 80 },
  { name: 'Mobile (APK recon → hidden API)', level: 78 },
]

export const tools = [
  'burp suite', 'caido', 'ffuf', 'nuclei', 'subfinder', 'httpx',
  'katana', 'gau', 'arjun', 'jwt_tool', 'jadx', 'sqlmap',
  'amass', 'dnsx', 'gf', 'interactsh',
]

// Writeups / things I've built.  status: 'live' (linked) | 'soon' (coming soon)
export const writeups = [
  {
    title: 'I made OpenID Connect stop checking signatures (and got paid $0 for it)',
    kind: 'writeup',
    status: 'live',
    blurb:
      "the federated login never actually verified the JWT signature. alg:none strolled right in, forged any victim's sub, full ATO. critical bug, $0 bounty, infinite clout. here's the whole story.",
    href: 'https://medium.com/@anshbohra10/i-made-openid-connect-stop-checking-signatures-and-got-paid-0-for-it-32510d8cbcf0',
  },
  {
    title: 'The bouncer who frisked everyone and forgot to lock the door',
    kind: 'writeup',
    status: 'live',
    blurb:
      "they checked WHO you are on every single request… and never once checked WHAT you're allowed to touch. a little story about broken access control and reading stuff that isn't yours.",
    href: 'https://medium.com/@anshbohra10/the-bouncer-who-frisked-everyone-and-forgot-to-lock-the-door-4d68dcde76e1',
  },
  {
    title: 'Getting XSS past React escaping',
    kind: 'writeup',
    status: 'soon',
    blurb:
      'dangerouslySetInnerHTML, javascript: hrefs, SSR JSON-LD, createElement sinks, iframe srcdoc, and CSP gadgets — the field guide i wish i had. writing it up rn.',
    href: '#',
  },
  {
    title: 'arsenal',
    kind: 'tool',
    status: 'soon',
    blurb:
      'my personal recon + payload toolkit: context-aware wordlists, WAF-bypass XSS sets, and per-class methodology notes. i hunt out of this. dropping it publicly soon.',
    href: '#',
  },
]

export const social = [
  { label: 'github', handle: '@GOJO-SENPA1', href: 'https://github.com/GOJO-SENPA1' },
  { label: 'twitter/x', handle: '@AnshBohra08975', href: 'https://x.com/AnshBohra08975' },
  { label: 'linkedin', handle: 'in/ansh-bohara', href: 'https://www.linkedin.com/in/ansh-bohara-47169a344/' },
  { label: 'medium', handle: '@anshbohra10', href: 'https://medium.com/@anshbohra10' },
  { label: 'email', handle: 'anshbohara10@proton.me', href: 'mailto:anshbohara10@proton.me' },
]
