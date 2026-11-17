import { articles, projects, publishedCaseStudies } from "./data.js";

// Internal linking helpers. Every page should be reachable from several other
// pages Google already visits, so new guides and examples are found quickly.

// Other guides for the end of an article: most shared services first, then the
// same category, then a guide that covers this guide's main service (the first
// one listed) before one that only shares a minor service, then the newest (the
// articles list is newest first).
export function relatedArticles(article, count = 3) {
  const score = (other) =>
    other.services.filter((s) => article.services.includes(s)).length * 2 +
    (other.category === article.category ? 1 : 0) +
    (other.services.includes(article.services[0]) ? 1 : 0);
  return articles
    .filter((other) => other.slug !== article.slug)
    .map((other, index) => ({ other, index, points: score(other) }))
    .sort((a, b) => b.points - a.points || a.index - b.index)
    .slice(0, count)
    .map(({ other }) => other);
}

// Guides that cover the same services as an example, newest first.
export const guidesForProject = (project, count = 3) =>
  articles
    .filter((a) => a.services.some((s) => project.services.includes(s)))
    .slice(0, count);

// Illustrative solution examples that belong to a service.
export const examplesForService = (slug) =>
  projects.filter((project) => project.services.includes(slug));

// Published case studies that belong to a service.
export const caseStudiesForService = (slug) =>
  publishedCaseStudies.filter((study) => study.services.includes(slug));

// Other case studies for the end of a case study: those sharing the most
// services first, then the order they are listed in.
export function relatedCaseStudies(study, count = 3) {
  const score = (other) => other.services.filter((s) => study.services.includes(s)).length;
  return publishedCaseStudies
    .filter((other) => other.slug !== study.slug)
    .map((other, index) => ({ other, index, points: score(other) }))
    .sort((a, b) => b.points - a.points || a.index - b.index)
    .slice(0, count)
    .map(({ other }) => other);
}
