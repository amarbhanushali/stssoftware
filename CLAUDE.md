# Samarth Tech Software website — project rules

Company website for **Samarth Tech Software (STS)**, Nashik, Maharashtra, India — live at `https://stssoftware.in`.
Its job is to win customer enquiries: every change should help visitors understand the services and reach `/contact`, and help Google and AI assistants find and describe the company correctly.

## Stack (not PHP)

React 19 + React Router 7 + Vite 8 on the client, Express 5 SSR server on Node ≥ 22.13, SQLite (`node:sqlite`) for enquiries. XAMPP/Apache does **not** run this app; use `npm start` (http://127.0.0.1:3001) or `npm run dev`.

| File | Purpose |
| --- | --- |
| `src/data.js` | All content: `services`, `stages`, `projects`, `articles`, `faqs` |
| `src/App.jsx` | Every page and shared component (Header, Footer, Hero, CTA, FAQ…) and routes |
| `src/metadata.js` | Page titles/descriptions (`pages`), JSON-LD (`getStructuredData`), `llms.txt` (`getLlmsText`) |
| `src/styles.css` | **The only stylesheet** |
| `server/index.mjs` | Helmet/CSP, rate limits, CSRF, enquiry API, SSR, robots.txt, sitemap.xml, llms.txt |
| `tests/api.test.mjs` | API/SSR/SEO/security tests (`npm test`) |

## Rule 1 — CSS is consolidated in one file

- All styles live in `src/styles.css`, imported once in `src/main.jsx`. **Never** create per-page or per-component CSS files, CSS modules, `<style>` blocks or `style={{…}}` props.
- Reuse existing classes and design tokens (`:root` variables, `.section`, `.card`, `.grid.three`, `.eyebrow`, `.button`, `.tag` …) before adding new ones. Search `styles.css` first.
- New classes go next to the related section of `styles.css`, named for what they are (`.footer-address`), not for a single page.
- Inline styles are also blocked by the CSP (`style-src 'self'`), so they will silently fail in production.

## Rule 2 — Security first

- Treat all form/URL input as untrusted. Validate on the server (allow-lists, length limits) — the client check is only UX.
- Never use `dangerouslySetInnerHTML`, `eval`, or string-built HTML with user data. Escape anything injected into the SSR template with the `escape()` helper; JSON-LD is escaped by replacing `<` with `<`.
- Keep the CSP strict: no `'unsafe-inline'`/`'unsafe-eval'`, no new third-party origins unless genuinely required (then add only that exact origin). No CDN scripts, remote fonts or remote images — assets are local in `public/`.
- Keep CSRF, the honeypot field, idempotency keys and both rate limiters on the enquiry API. Never add an unauthenticated endpoint that lists or exports enquiries.
- Secrets only in `.env` (git-ignored); document new variables in `.env.example` with an empty value. Never commit `.env`, `server/data/`, or tokens.
- Enquiry emails come only from the branded template in `server/email.mjs`: HTML with every form value passed through its `escape()`, plus a plain-text part, sent with `disableFileAccess`/`disableUrlAccess`. Never build email HTML anywhere else or insert unescaped form content. Inline styles are allowed in that template only (email clients ignore stylesheets).
- Production must set `NODE_ENV=production`, an HTTPS `PUBLIC_ORIGIN`, and `TRUST_PROXY=1` behind a reverse proxy (otherwise every visitor shares one rate limit).
- Run `npm audit` after dependency changes; fix high/critical findings before deploying.

## Rule 3 — SEO and AI-search on every page

- Each route needs an entry in `pages` in `src/metadata.js`: unique title (≤ 60 chars before the ` | Samarth Tech Software` suffix, include "Nashik" where natural) and a 140–160 char description.
- Exactly one `<h1>` per page (the `Hero` component provides it); headings in order; descriptive link text; `alt` on meaningful images, `width`/`height` on `<img>`.
- Structured data comes from `getStructuredData`: Organization (with Nashik address), WebSite, WebPage, BreadcrumbList, plus Service / FAQPage / BlogPosting where the page visibly shows that content. Never mark up content that is not visible on the page.
- New pages/services/articles automatically appear in `sitemap.xml` and `llms.txt` because both read from `pages`/`data.js` — add content there, not hard-coded in the server.
- Don't publish invented facts: no fake clients, reviews, ratings, certifications, staff or statistics. Solution examples stay labelled "illustrative". Ask the owner for real phone/email/social links before adding them.
- Keep pages server-rendered (content must be in the HTML response, not only after JS runs).

## Workflow

```bash
npm run build && npm test
```

- Run both after any change; add a test in `tests/api.test.mjs` for new server behaviour.
- Check the page in the browser (`.claude/launch.json` → `sts-website`) on desktop and mobile width; look for console CSP errors.
- Use the `sts-website` project skill (`.claude/skills/sts-website/SKILL.md`) for adding services or pages.
- Use the `sts-blog` project skill (`.claude/skills/sts-blog/SKILL.md`) for writing, reviewing or adding blog posts (Insights articles).
