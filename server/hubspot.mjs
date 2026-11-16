import { services } from "../src/data.js";

// HubSpot CRM sync. Uses a Private App access token kept on the server
// (scopes: crm.objects.contacts.read, crm.objects.contacts.write). Every
// enquiry becomes (or updates) a contact, with the enquiry saved as a note.
// Form content is untrusted: HubSpot renders note bodies as HTML, so every
// value is escaped.

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const serviceName = (slug) =>
  slug === "not-sure" ? "Not sure yet" : services.find((s) => s.slug === slug)?.name || slug;

export const hubspotEnabled = () => Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim());

async function call(method, path, body) {
  const base = (process.env.HUBSPOT_BASE_URL || "https://api.hubapi.com").replace(/\/$/, "");
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN.trim()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    // HubSpot error bodies describe the problem (missing scope, bad property)
    // without echoing the token.
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(`HubSpot ${method} ${path.split("?")[0]} returned ${response.status} ${detail}`);
  }
  return response.status === 204 ? null : response.json();
}

function splitName(name) {
  const parts = String(name).trim().split(/\s+/);
  return { firstname: parts[0] || "", lastname: parts.slice(1).join(" ") };
}

// Creates or updates the contact by email and marks it as a new lead.
export async function upsertContact(record) {
  const properties = {
    email: record.email,
    ...splitName(record.name),
    hs_lead_status: "NEW",
  };
  if (record.phone) properties.phone = record.phone;
  if (record.company) properties.company = record.company;
  const result = await call("POST", "/crm/v3/objects/contacts/batch/upsert", {
    inputs: [{ idProperty: "email", id: record.email, properties }],
  });
  const id = result?.results?.[0]?.id;
  if (!id) throw new Error("HubSpot upsert returned no contact id");
  return String(id);
}

// associationTypeId 202 = note → contact (HubSpot-defined).
export async function addNote(contactId, html) {
  await call("POST", "/crm/v3/objects/notes", {
    properties: { hs_timestamp: new Date().toISOString(), hs_note_body: html },
    associations: [
      {
        to: { id: contactId },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
      },
    ],
  });
}

export function enquiryNote(record) {
  const rows = [
    ["Reference", record.id],
    ["Source", record.source === "chat" ? "Website chat assistant" : "Contact form"],
    ["Service", serviceName(record.service)],
    ["Timeline", record.timeline],
    ["Company", record.company || "Not supplied"],
    ["Phone", record.phone || "Not supplied"],
    ["WhatsApp opt-in", record.whatsappOptIn ? "Yes" : "No"],
  ];
  return `<p><strong>Website enquiry ${escape(record.id)}</strong></p><p>${rows
    .map(([k, v]) => `${k}: ${escape(v)}`)
    .join("<br>")}</p><p><strong>Project details (untrusted visitor content):</strong><br>${escape(
    record.message,
  ).replace(/\r?\n/g, "<br>")}</p>`;
}

export async function syncEnquiry(record) {
  const contactId = await upsertContact(record);
  await addNote(contactId, enquiryNote(record));
  return contactId;
}

// Startup check: proves the token works and has the contacts scope.
export async function hubspotCheck() {
  await call("GET", "/crm/v3/objects/contacts?limit=1&properties=email");
}

// Lead status the team sets in HubSpot (NEW, OPEN, IN_PROGRESS, CONNECTED…).
export async function leadStatus(contactId) {
  const contact = await call(
    "GET",
    `/crm/v3/objects/contacts/${encodeURIComponent(contactId)}?properties=hs_lead_status`,
  );
  return contact?.properties?.hs_lead_status || "";
}
