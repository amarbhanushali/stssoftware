import { services, articles, faqs } from "./data.js";
import { company } from "./metadata.js";

// Read-only tools that describe the company to AI agents. One definition feeds
// both the MCP endpoint (server/mcp.mjs, POST /mcp) and the in-browser WebMCP
// registration (the AgentTools component in App.jsx), so they can never
// disagree. Every tool returns public website content only: nothing here
// reads enquiries, and nothing submits one. Visitors send enquiries themselves
// through the contact form, which needs their consent.

const noInput = { type: "object", properties: {}, additionalProperties: false };
const serviceSlugs = services.map((s) => s.slug);

export const agentTools = [
  {
    name: "get_company_info",
    title: "Company information",
    description:
      "Who Samarth Tech Software is, where it is based, and how to contact it or send an enquiry.",
    inputSchema: noInput,
    run: (_args, origin) => ({
      name: company.name,
      summary:
        "Software company in Nashik, Maharashtra, India building websites, custom software, web and mobile applications, WordPress sites and AI automation for businesses across India.",
      location: `${company.locality}, ${company.region}, ${company.country}`,
      email: company.email,
      phone: company.phone,
      website: origin || "/",
      profiles: Object.fromEntries(company.social),
      howToEnquire: `Use the contact form at ${origin}/contact, email ${company.email} or call ${company.phoneDisplay}. A person replies; this tool cannot send an enquiry.`,
    }),
  },
  {
    name: "list_services",
    title: "List services",
    description:
      "The services Samarth Tech Software offers, each with a one-line summary and its page URL.",
    inputSchema: noInput,
    run: (_args, origin) => ({
      services: services.map((s) => ({
        slug: s.slug,
        name: s.name,
        summary: s.short,
        url: `${origin}/services/${s.slug}`,
      })),
    }),
  },
  {
    name: "get_service",
    title: "Service details",
    description:
      "Full description, deliverables and technology for one service. Use list_services to see the available slugs.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          enum: serviceSlugs,
          description: "Service identifier, for example ai-automation.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    run: (args, origin) => {
      const s = services.find((x) => x.slug === args.slug);
      if (!s) throw new Error(`Unknown service. Choose one of: ${serviceSlugs.join(", ")}.`);
      return {
        slug: s.slug,
        name: s.name,
        summary: s.short,
        description: s.description,
        deliverables: s.deliverables,
        technology: s.stack,
        url: `${origin}/services/${s.slug}`,
      };
    },
  },
  {
    name: "list_guides",
    title: "List guides",
    description:
      "Insights articles published by Samarth Tech Software, with a short answer, publish and update dates, and page URL.",
    inputSchema: noInput,
    run: (_args, origin) => ({
      guides: articles.map((a) => ({
        title: a.title,
        answer: a.intro,
        category: a.category,
        published: a.published,
        updated: a.updated,
        url: `${origin}/insights/${a.slug}`,
      })),
    }),
  },
  {
    name: "get_faqs",
    title: "Frequently asked questions",
    description:
      "Answers to common questions about cost, timelines, working with existing software and support after launch.",
    inputSchema: noInput,
    run: () => ({ faqs: faqs.map(([question, answer]) => ({ question, answer })) }),
  },
];

// Runs a tool by name. Throws a plain Error (safe to show to the caller) when
// the name or arguments are not acceptable.
export function runAgentTool(name, args, origin = "") {
  const tool = agentTools.find((t) => t.name === name);
  if (!tool) throw new Error(`Unknown tool: ${String(name).slice(0, 60)}`);
  if (args === undefined || args === null) args = {};
  if (typeof args !== "object" || Array.isArray(args))
    throw new Error("Tool arguments must be an object.");
  return tool.run(args, origin);
}

// The shape MCP and WebMCP both use for describing a tool.
export const agentToolDescriptors = agentTools.map(
  ({ name, title, description, inputSchema }) => ({
    name,
    title,
    description,
    inputSchema,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }),
);
