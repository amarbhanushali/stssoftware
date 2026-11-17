# Draft case studies (not published)

Everything in `src/data.js` is bundled into the JavaScript every visitor downloads, so a draft kept
there is public even when no page shows it. Drafts therefore live here, outside `src/`.

To publish one: confirm Samarth Tech Software's exact role, check every claim against the repository,
remove client names and web addresses, then move the entry into `caseStudies` in `src/data.js`.

## UAE electronics online store (WooCommerce): role to confirm

Source repository: a snapshot of a live WordPress and WooCommerce site (mostly third-party code), so
what STS did on it (theme set-up, plugin configuration, SEO, hosting, migration) must be confirmed.

```js
  {
    slug: "uae-electronics-online-store",
    draft: true,
    title: "An online electronics store built on WooCommerce",
    sector: "E-commerce",
    intro:
      "A WooCommerce store for an electronics retailer in the UAE, with card payments, shipping rates, warranty claims and a multilingual front end.",
    services: ["wordpress", "website-development"],
    overview:
      "A WooCommerce online store for an electronics retailer in the UAE, running on WordPress with a commercial store theme and a child theme.",
    features: [
      "A WooCommerce product catalogue with a commercial store theme and a child theme",
      "Card payments through Stripe and shipping rates through Shippo",
      "A warranty claim flow and the UAE dirham currency symbol",
      "SEO set-up with Yoast and a Google Merchant and Ads product feed, plus analytics",
      "A multilingual front end, and social login",
      "Page and object caching with WP Rocket and Redis, and image optimisation",
    ],
    stack: ["WordPress", "WooCommerce", "WoodMart child theme", "Stripe", "Shippo", "Yoast SEO", "WP Rocket", "Redis"],
    quality: "",
  },
```
