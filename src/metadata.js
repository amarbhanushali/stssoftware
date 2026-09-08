import { services, projects, articles } from "./data.js";
const baseDescription =
  "Samarth Tech Software builds custom software, websites, mobile applications and practical AI automation for businesses.";
export const pages = new Map([
  [
    "/",
    {
      title: "Custom Software & Practical AI Automation",
      description: baseDescription,
    },
  ],
  [
    "/services",
    {
      title: "Our Services",
      description:
        "Explore custom software, website design, web applications, mobile development, WordPress and AI automation services.",
    },
  ],
  [
    "/about",
    {
      title: "About Us",
      description:
        "Meet the approach behind Samarth Tech Software: practical engineering, clear milestones and maintainable business systems.",
    },
  ],
  [
    "/process",
    {
      title: "Engineering Delivery Process",
      description:
        "Explore our six stages of software delivery, from discovery and design to development, testing, launch and support.",
    },
  ],
  [
    "/technology",
    {
      title: "Technology Stack",
      description:
        "Explore the tools and example architectures behind our web applications, business portals, mobile products and AI workflows.",
    },
  ],
  [
    "/work",
    {
      title: "Solution Examples",
      description:
        "Explore illustrative approaches to order automation, customer portals, inventory management and mobile field operations.",
    },
  ],
  [
    "/insights",
    {
      title: "Insights",
      description:
        "Practical guides to planning software projects, designing business workflows and introducing useful AI automation.",
    },
  ],
  [
    "/contact",
    {
      title: "Contact Us",
      description:
        "Tell Samarth Tech Software about your business goals and the software or automation project you want to build.",
    },
  ],
  [
    "/consultation",
    {
      title: "Request a Consultation",
      description:
        "Share your project requirements and start a conversation about scope, technology and next steps.",
    },
  ],
  [
    "/privacy",
    {
      title: "Privacy Notice",
      description:
        "Read how the Samarth Tech Software website handles contact enquiries and technical security data.",
    },
  ],
  [
    "/terms",
    {
      title: "Terms of Use",
      description:
        "Read the terms for using the Samarth Tech Software website and submitting a project enquiry.",
    },
  ],
  ...services.map((s) => [
    `/services/${s.slug}`,
    { title: s.name, description: s.description },
  ]),
  ...projects.map((p) => [
    `/work/${p.slug}`,
    {
      title: p.title,
      description: `Illustrative solution example: ${p.challenge}`,
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
