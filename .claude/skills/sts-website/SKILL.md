---
name: sts-website
description: Add or change content on the Samarth Tech Software company website (services, articles/insights, solution examples, FAQs, new pages) while keeping SEO, AI-search visibility, the single consolidated stylesheet and the security rules intact. Use for any website content, page, SEO or styling change in this repository.
---

# Samarth Tech Software website changes

Read `CLAUDE.md` first — its three rules (one CSS file, security first, SEO on every page) are mandatory.

## Company facts (use exactly; do not invent others)

- Name: Samarth Tech Software (STS). Domain: `https://stssoftware.in`.
- Address: 16 Shukhakarta Row Houses, Ganpati Temple, Shivajinagar Dharmaji Colony, Ashok Nagar, Nashik, Maharashtra 422012, India.
- Services: custom software, website development & design, web applications, mobile applications, WordPress, AI automation (slugs in `src/data.js`).
- Tone: practical, plain English, no hype, no guaranteed outcomes. British spelling ("optimisation") as in existing copy.
- Not yet published (ask the owner before adding): phone, email, social profiles, real client names, reviews, prices.

## Recipes

### Add a service
1. Append an object to `services` in `src/data.js` (`slug`, `name`, `short`, `category`, `icon` from `paths` in `App.jsx`, `description` 140–160 chars, `deliverables`, `stack`).
2. Add the slug to `allowedServices` in `server/index.mjs` (the form's options are generated from `services`, but the server allow-list is not).
3. Nothing else: route, title ("… in Nashik"), Service + FAQPage + BreadcrumbList JSON-LD, sitemap and `llms.txt` are generated.

### Add an insight article
Follow the `sts-blog` skill (`.claude/skills/sts-blog/SKILL.md`). It covers voice, titles, structure, honesty rules, review checklists and the `articles` data format.

### Add a new top-level page
1. Component in `src/App.jsx` using `Hero` (gives the single `<h1>` and breadcrumb), `SectionHeading`, existing grid/card classes and `CTA`.
2. `<Route>` in `App`, entry in `pages` in `src/metadata.js`, optional link in Header/Footer.
3. If it shows Q&A or a service, extend `getStructuredData` for that path.

### Styling
- Edit only `src/styles.css`. Search it for an existing class/token first. No new `.css` files, no `style={{}}`, no `<style>`.

## Before finishing

```bash
npm run build && npm test
```

Then open the page via the `sts-website` launch config, check desktop + mobile width, and confirm the console has no CSP errors. Validate JSON-LD at https://validator.schema.org if structured data changed.

## After deploying (owner tasks)

- Google Search Console: submit `https://stssoftware.in/sitemap.xml`; request indexing for new pages.
- Bing Webmaster Tools: import from Search Console (also feeds ChatGPT/Copilot search).
- Google Business Profile for the Nashik address — the biggest local-search factor; keep name/address identical to the site.
