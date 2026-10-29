import { services, projects, articles, faqs } from "./data.js";
export const company = {
  name: "Samarth Tech Software",
  locality: "Nashik",
  region: "Maharashtra",
  country: "India",
};
const baseDescription =
  "Samarth Tech Software is a software company in Nashik, Maharashtra. We build websites, custom software, mobile apps and AI automation for businesses across India.";
const page = (title, description) => ({ title, description });
export const pages = new Map([
  ["/", page("Website & Software Development Company in Nashik", baseDescription)],
  [
    "/services",
    page(
      "Software, Website & App Development Services",
      "Custom software, business websites, web apps, Android and iOS apps, WordPress and AI automation from a Nashik team that starts with your actual problem.",
    ),
  ],
  [
    "/about",
    page(
      "About Us – Software Company in Nashik",
      "Meet Samarth Tech Software, a Nashik software company that listens first, builds in clear milestones and supports your website or software after launch.",
    ),
  ],
  [
    "/process",
    page(
      "How We Work – Our Development Process",
      "Six simple stages from first call to launch and support: discovery, design, development, testing, handover and improvement, with no surprises along the way.",
    ),
  ],
  [
    "/technology",
    page(
      "Our Technology Stack",
      "React, Node.js, Laravel, Python, PostgreSQL, Flutter and more: proven tools chosen for your project and for whoever maintains the system later on.",
    ),
  ],
  [
    "/work",
    page(
      "Solution Examples – Software for Real Problems",
      "Illustrative examples of how we would automate order entry, build customer portals, track stock across locations and give field staff an offline app.",
    ),
  ],
  [
    "/insights",
    page(
      "Guides for Business Owners – Software & AI",
      "Plain-English guides on planning software, replacing Excel sheets, launching a business website and starting with AI automation, before you spend money.",
    ),
  ],
  [
    "/contact",
    page(
      "Contact Us – Software Company in Nashik",
      "Tell us what you would like to build or fix. Send a few lines about your business to Samarth Tech Software in Nashik and get honest next steps by email.",
    ),
  ],
  [
    "/consultation",
    page(
      "Request a Consultation",
      "Share your website, app or software idea with Samarth Tech Software. We read every enquiry and reply with a clear, honest suggestion for the next step.",
    ),
  ],
  [
    "/privacy",
    page(
      "Privacy Notice",
      "How the Samarth Tech Software website handles the details you send through the enquiry form, security cookies and optional analytics, in plain English.",
    ),
  ],
  [
    "/terms",
    page(
      "Terms of Use",
      "The terms for using the Samarth Tech Software website and sending a project enquiry. An enquiry does not create a contract; project terms are agreed separately.",
    ),
  ],
  ...services.map((s) => [
    `/services/${s.slug}`,
    { title: `${s.name} in Nashik`, description: s.description },
  ]),
  ...projects.map((p) => [
    `/work/${p.slug}`,
    {
      title: p.title,
      description: `Example: ${p.challenge}`,
    },
  ]),
  ...articles.map((a) => [
    `/insights/${a.slug}`,
    { title: a.title, description: a.intro },
  ]),
]);
export function getMetadata(pathname) {
  return (
    pages.get(pathname.replace(/\/$/, "") || "/") || {
      title: "Page Not Found",
      description:
        "Find services, insights and contact information for Samarth Tech Software.",
    }
  );
}

const sections = {
  services: "Our Services",
  work: "Solution Examples",
  insights: "Insights",
};

function breadcrumbs(normalizedPath, origin) {
  const parts = normalizedPath.split("/").filter(Boolean);
  const items = [{ name: "Home", url: origin }];
  parts.forEach((part, index) => {
    const path = `/${parts.slice(0, index + 1).join("/")}`;
    const name =
      index === 0 && parts.length > 1
        ? sections[part] || getMetadata(path).title
        : getMetadata(path).title;
    items.push({ name, url: `${origin}${path}` });
  });
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getStructuredData(pathname, origin) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const metadata = getMetadata(normalizedPath);
  const pageUrl = `${origin}${normalizedPath}`;
  const area = [
    { "@type": "City", name: company.locality },
    { "@type": "State", name: company.region },
    { "@type": "Country", name: company.country },
  ];
  const graph = [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": `${origin}/#organization`,
      name: company.name,
      alternateName: "STS Software",
      url: origin,
      logo: `${origin}/sts-logo.png`,
      image: `${origin}/sts-whatsapp-app-icon.png`,
      description: baseDescription,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "16 Shukhakarta Row Houses, Ganpati Temple, Shivajinagar Dharmaji Colony, Ashok Nagar",
        addressLocality: company.locality,
        addressRegion: company.region,
        postalCode: "422012",
        addressCountry: "IN",
      },
      areaServed: area,
      knowsAbout: services.map((s) => s.name),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Software development services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.name,
            url: `${origin}/services/${s.slug}`,
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: company.name,
      inLanguage: "en-IN",
      publisher: { "@id": `${origin}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: metadata.title,
      description: metadata.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${origin}/#website` },
      about: { "@id": `${origin}/#organization` },
    },
  ];
  if (normalizedPath !== "/") graph.push(breadcrumbs(normalizedPath, origin));
  const service = services.find((item) => normalizedPath === `/services/${item.slug}`);
  if (service) {
    graph.push({
      "@type": "Service",
      name: service.name,
      serviceType: service.name,
      description: service.description,
      provider: { "@id": `${origin}/#organization` },
      areaServed: area,
      url: pageUrl,
    });
  }
  // Only for pages that visibly render the FAQ list.
  if (service || normalizedPath === "/contact" || normalizedPath === "/consultation") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }
  const article = articles.find((item) => normalizedPath === `/insights/${item.slug}`);
  if (article) {
    graph.push({
      "@type": "BlogPosting",
      headline: article.title,
      description: article.intro,
      articleSection: article.category,
      url: pageUrl,
      mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      author: { "@id": `${origin}/#organization` },
      publisher: { "@id": `${origin}/#organization` },
      image: `${origin}/sts-whatsapp-app-icon.png`,
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

// Plain-language site summary for AI assistants and answer engines (llmstxt.org).
export function getLlmsText(origin) {
  const link = (path, title, description) =>
    `- [${title}](${origin}${path}): ${description}`;
  return [
    `# ${company.name}`,
    "",
    `> ${baseDescription}`,
    "",
    `${company.name} is located at 16 Shukhakarta Row Houses, Ashok Nagar, ${company.locality}, ${company.region} 422012, ${company.country}. Enquiries are accepted through ${origin}/contact.`,
    "",
    "## Services",
    ...services.map((s) => link(`/services/${s.slug}`, s.name, s.description)),
    "",
    "## Company",
    ...["/about", "/process", "/technology", "/contact"].map((p) =>
      link(p, getMetadata(p).title, getMetadata(p).description),
    ),
    "",
    "## Solution examples (illustrative)",
    ...projects.map((p) => link(`/work/${p.slug}`, p.title, p.challenge)),
    "",
    "## Guides",
    ...articles.map((a) => link(`/insights/${a.slug}`, a.title, a.intro)),
    "",
    "## Frequently asked questions",
    ...faqs.flatMap(([q, a]) => [`### ${q}`, a, ""]),
  ].join("\n");
}
