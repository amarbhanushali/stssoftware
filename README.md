# Samarth Tech Software website

A React website built from the supplied Stitch design references. The UI uses the reference orange and blue palette, STS logo, Plus Jakarta Sans and Inter typography, technical panels and page layouts. The application uses React Router, Vite, an Express backend and SQLite. There is no PHP application.

## Run locally

Requires Node.js 22.13 or newer (Node 24 was used for validation).

```powershell
npm install
npm run build
npm start
```

Open **http://127.0.0.1:3001**. The production server delivers server-rendered React pages and the enquiry API together. Keep the terminal running.

For development:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal (normally http://localhost:5173). Vite forwards `/api` to the backend on port 3001. Stop an existing `npm start` process before starting `npm run dev`.

Although the project is inside XAMPP's `htdocs`, Apache does not execute this React/Node application. Use the Node URL above. For deployment, place a reverse proxy in front of the Node server, or deploy to a host that runs Node processes. Hostinger Node.js Web App hosting creates its own routing configuration, so this repository does not include an Apache `.htaccess` file.

## Live server deployment

This application is not suitable for static-only hosting because the contact form saves enquiries and pages are server-rendered. Deploy it to a server that can run Node.js 24 or Docker.

### Docker deployment

On the live server, clone the GitHub repository, create a production `.env` from `.env.example`, set the real domain in `PUBLIC_ORIGIN`, and set `HOST=0.0.0.0`. Add SMTP settings if enquiries should send notification emails.

```bash
git clone https://github.com/amarbhanushali/stssoftware.git
cd stssoftware
cp .env.example .env
docker build -t stssoftware:latest .
docker run -d --name stssoftware --restart unless-stopped \
  --env-file .env \
  -p 127.0.0.1:3001:3001 \
  -v stssoftware-data:/data \
  stssoftware:latest
```

The Docker volume keeps contact enquiries when the container is replaced. Back it up before upgrades. Do not expose port `3001` directly to the internet; use HTTPS reverse proxying. Copy `deploy/Caddyfile.example` to the server, replace `your-domain.com` with the real domain, and use Caddy or an equivalent Nginx configuration to proxy HTTPS requests to `127.0.0.1:3001`.

For each release:

```bash
git pull --ff-only
docker build -t stssoftware:latest .
docker stop stssoftware && docker rm stssoftware
docker run -d --name stssoftware --restart unless-stopped \
  --env-file .env \
  -p 127.0.0.1:3001:3001 \
  -v stssoftware-data:/data \
  stssoftware:latest
```

Test the server locally before deploying with `npm run build`, `npm test`, and `npm start`. The production build outputs `dist/` for browser assets and `server/rendered/` for server-rendered React. They are generated at build time and intentionally excluded from Git.

## What is implemented

- Responsive homepage and shared navigation/footer based on the supplied designs.
- Services overview with category filters and six service detail pages.
- Company, six-stage process and interactive technology stack pages.
- Four clearly labelled illustrative solution examples with detail pages.
- Six complete editorial guides with category filters, search and article pages.
- Contact/consultation form with service preselection, validation, recoverable errors and a saved-enquiry receipt.
- SQLite enquiry persistence, CSRF protection, rate limiting, a spam honeypot and idempotent retries.
- Optional SMTP notifications. Failure to email never discards an accepted enquiry.
- Server-rendered page content, route-specific titles, canonical URLs when configured, sitemap, robots rules and real HTTP 404 responses.
- Local logo and font assets; no Tailwind CDN, tracking scripts or remote images.

## Enquiries and email

Enquiries are stored in `server/data/enquiries.sqlite`, outside the publicly served `dist` directory. The database is not committed. Set `DATA_DIR` to use a different persistent directory. Back up the database using a SQLite-aware backup process; do not copy a live database without its WAL state.

Read enquiries from a trusted local terminal:

```powershell
npm run enquiries
```

This command prints personal data; use it only on an authorised machine. There is intentionally no unauthenticated web endpoint for listing enquiries.

Copy `.env.example` to `.env` and fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and `NOTIFY_EMAIL` to enable notification emails. Every accepted enquiry sends one detailed email to `NOTIFY_EMAIL` and one automatic acknowledgement email with a complete enquiry copy to the visitor. Use `AUTO_REPLY_EMAIL_SUBJECT` to change its subject; the default message includes the enquiry reference. Messages are plain text, and the mail transport is configured not to read local files or remote URLs from form content. The team alert labels all submitted content as untrusted, so independently verify any link, payment request, attachment, or contact detail before acting on it. Set `MAIL_FROM` to your authenticated `@stssoftware.in` address so recipients can verify the sender. Restart the Node server after changing settings. Without SMTP, requests are still saved with notification status `unconfigured`. A failed send is marked `failed` and remains visible in the local enquiry listing; automatic email retry is not included.

## WhatsApp notifications and automatic reply

The contact form includes an optional WhatsApp consent checkbox. When it is selected, the server can send an approved WhatsApp Business template to the visitor; it can also send each enquiry to the company's WhatsApp number. This requires a Meta WhatsApp Business Platform account and approved templates. In WhatsApp Manager, create templates with these exact body variables:

- `sts_new_enquiry`: `{{1}}` name, `{{2}}` phone, `{{3}}` email, `{{4}}` service, `{{5}}` message.
- `sts_welcome`: `{{1}}` name. Suggested body: `Hello {{1}}, thank you for contacting Samarth Tech Software. We have received your enquiry and will reply shortly.`

Then set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_RECIPIENT_NUMBER` (your own WhatsApp number with country code, for example `919876543210`), `WHATSAPP_TEAM_TEMPLATE=sts_new_enquiry`, and `WHATSAPP_WELCOME_TEMPLATE=sts_welcome` in Hostinger Environment Variables. Redeploy after saving. Keep the access token private. The application uses templates because a website enquiry does not itself open a WhatsApp customer-service conversation.

Set `PUBLIC_ORIGIN` to the final origin, without a trailing slash, for canonical URLs and the sitemap. In production use HTTPS, `NODE_ENV=production`, a persistent `DATA_DIR`, and a process manager. If a reverse proxy is used, configure trusted proxy handling specifically for that deployment rather than trusting arbitrary forwarded headers.

## Google SEO and lead setup

The production site serves crawlable HTML, unique page titles and descriptions, canonical URLs, a sitemap, robots instructions, Open Graph sharing tags and Organization/WebSite/WebPage/Service structured data. Set `PUBLIC_ORIGIN=https://stssoftware.in`, deploy, then submit `https://stssoftware.in/sitemap.xml` in [Google Search Console](https://search.google.com/search-console/about). For HTML-tag verification, copy only the `content` value from Google's verification tag into Hostinger as `GOOGLE_SITE_VERIFICATION`, then redeploy. Do not submit `/api/` URLs for indexing.

Search ranking also needs useful content and external trust. Publish real, location- and customer-specific service evidence only after it is approved: project outcomes, client permissions, accurate business contact details and answers to actual customer questions. Keep the consultation call to action on every service page and review form enquiries weekly to see which services and pages generate leads.

## Visitor tracking

Create a Google Analytics 4 web data stream for the final site and add its Measurement ID (format `G-...`) in Hostinger as `GOOGLE_ANALYTICS_ID`. After redeploying, the Google tag loads with Consent Mode set to deny all storage, allowing tag diagnostics without setting analytics cookies. Accepting the banner grants only analytics storage, while advertising storage and personalisation remain denied. Accepted visitors' page views, including React client-side navigation, appear in GA4. Do not add the Google Analytics script separately in Hostinger or the page source; the application manages it after consent.

When a visitor who accepted analytics submits the consultation form, the website sends the GA4 recommended `generate_lead` event with the selected service and timeline only. It never sends names, email addresses, phone numbers or project descriptions to Google Analytics. Mark `generate_lead` as a key event in GA4 to measure enquiry conversions.

## Content editing

- `src/data.js`: services, solution examples, process stages and editorial guides.
- `src/App.jsx`: React page and shared UI components.
- `src/styles.css`: responsive styles and design tokens from the reference system.
- `public/sts-logo.png`: the company logo supplied as `aK8uQBTCkC06Y_2OWYj4SM.png`.
- `server/index.mjs`: API, persistence, mail notifications and production SSR server.
- `server/render.jsx`: React server-rendering entry point.

Content is maintained in the source files; an administrator CMS is not included in this build. Rebuild and restart after content changes.

The source designs included sample staff profiles, certifications, client outcomes and performance guarantees. These are not published as company facts. The work page instead labels its content as illustrative examples. Before public launch, approve the company contact details, service claims, policy text, retention policy and any real client evidence you want to add.

## Validation

```powershell
npm run build
npm test
npm run test:browser
```

API tests launch an isolated server and temporary database. They cover SSR routes, 404s, private-data isolation, validation, CSRF, spam rejection, durable saves, duplicate retries, rate limiting and security headers.

Browser tests use installed Chrome in headless mode (set `BROWSER_CHANNEL` to a supported alternative if necessary). They check all 27 routes on desktop and mobile, filters, article search, tabs, FAQs, mobile navigation and a real saved enquiry after a simulated failure. Temporary test databases are removed afterwards. Review screenshots are written to `tests/artifacts`.

## Source references

The original references remain in `stitch_samarth_tech_corporate_website/stitch_samarth_tech_corporate_website`. The design system is `precision_enterprise_velocity/DESIGN.md`. Font licenses are included in `public/fonts`.
