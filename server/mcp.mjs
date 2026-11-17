import { agentToolDescriptors, runAgentTool } from "../src/agentTools.js";
import { company } from "../src/metadata.js";

// A small, read-only Model Context Protocol server (Streamable HTTP, JSON
// responses, no sessions). It only exposes the public content tools in
// src/agentTools.js, so there is nothing to authenticate and nothing it can
// change. POST /mcp in server/index.mjs calls handleMcp for every message.

export const mcpServerInfo = {
  name: "stssoftware-website",
  title: `${company.name} website`,
  version: "1.0.0",
};
const supportedVersions = ["2025-06-18", "2025-03-26", "2024-11-05"];
const instructions = `Read-only information about ${company.name}, a software company in ${company.locality}, India: services, guides, FAQs and contact options. To start a project, direct the person to the contact form or email; no tool sends an enquiry.`;

const rpcError = (id, code, message) => ({
  jsonrpc: "2.0",
  id: id ?? null,
  error: { code, message },
});
const ok = (id, result) => ({ status: 200, body: { jsonrpc: "2.0", id, result } });

// Returns { status, body? } for one JSON-RPC message.
export function handleMcp(message, origin = "") {
  if (
    !message ||
    typeof message !== "object" ||
    Array.isArray(message) ||
    message.jsonrpc !== "2.0" ||
    typeof message.method !== "string" ||
    (message.id !== undefined &&
      message.id !== null &&
      typeof message.id !== "string" &&
      typeof message.id !== "number")
  )
    return {
      status: 400,
      body: rpcError(null, -32600, "Invalid request. Send one JSON-RPC 2.0 message per POST."),
    };
  const { id, method, params } = message;
  // Notifications (no id), such as notifications/initialized, get no reply.
  if (id === undefined) return { status: 202 };
  switch (method) {
    case "initialize": {
      const asked = params?.protocolVersion;
      return ok(id, {
        protocolVersion: supportedVersions.includes(asked) ? asked : supportedVersions[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: mcpServerInfo,
        instructions,
      });
    }
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: agentToolDescriptors });
    case "tools/call": {
      const name = params?.name;
      if (typeof name !== "string" || !agentToolDescriptors.some((t) => t.name === name))
        return { status: 200, body: rpcError(id, -32602, "Unknown tool name.") };
      try {
        const data = runAgentTool(name, params.arguments, origin);
        return ok(id, { content: [{ type: "text", text: JSON.stringify(data) }], isError: false });
      } catch (error) {
        // Only deliberate input errors (plain Error) are shown to the caller.
        const text = error?.constructor === Error ? error.message : "The tool could not run.";
        return ok(id, { content: [{ type: "text", text }], isError: true });
      }
    }
    default:
      return { status: 200, body: rpcError(id, -32601, "Method not found.") };
  }
}

// /.well-known/mcp/server-card.json. The card format is still a draft, so the
// endpoint is given both inside `transport` and at the top level.
export function serverCard(origin = "") {
  const endpoint = `${origin}/mcp`;
  return {
    serverInfo: mcpServerInfo,
    protocolVersion: supportedVersions[0],
    description: instructions,
    documentationUrl: `${origin}/llms.txt`,
    transport: { type: "streamable-http", endpoint },
    endpoint,
    capabilities: { tools: { listChanged: false } },
    authentication: { required: false },
    tools: agentToolDescriptors.map(({ name, title, description }) => ({ name, title, description })),
  };
}
