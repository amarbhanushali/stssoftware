import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
let child, base, cookie, token;
const data = mkdtempSync(path.join(tmpdir(), "sts-api-test-"));
const payload = {
  name: "Test User",
  email: "test@example.com",
  company: "Test Company",
  phone: "",
  service: "custom-software",
  timeline: "Exploring options",
  message: "This is an automated test enquiry for the local website.",
  privacy: "accepted",
  website: "",
};
before(async () => {
  child = spawn(process.execPath, ["server/index.mjs"], {
    env: {
      ...process.env,
      PORT: "0",
      HOST: "127.0.0.1",
      DATA_DIR: data,
      SMTP_HOST: "",
      PUBLIC_ORIGIN: "http://localhost:3001",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(Error("Test server did not start")),
      15000,
    );
    child.once("error", reject);
    child.stdout.on("data", (buffer) => {
      const match = buffer.toString().match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) {
        base = match[0];
        clearTimeout(timeout);
        resolve();
      }
    });
    child.stderr.on("data", (buffer) => {
      if (buffer.toString().includes("Error")) console.error(buffer.toString());
    });
  });
  const r = await fetch(`${base}/api/session`);
  cookie = r.headers.get("set-cookie").split(";")[0];
  token = (await r.json()).token;
});
after(async () => {
  if (child && !child.killed) {
    const done = new Promise((resolve) => child.once("exit", resolve));
    child.kill();
    await done;
  }
  rmSync(data, { recursive: true, force: true });
});
function send(body = payload, key = randomUUID(), csrf = token) {
  return fetch(`${base}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
      "X-CSRF-Token": csrf,
      "Idempotency-Key": key,
    },
    body: JSON.stringify(body),
  });
}
test("pages are server rendered and unknown routes return 404", async () => {
  for (const route of [
    "/",
    "/services",
    "/services/ai-automation",
    "/about",
    "/process",
    "/technology",
    "/work",
    "/work/order-automation",
    "/insights",
    "/insights/practical-ai-automation",
    "/consultation",
    "/privacy",
    "/terms",
  ]) {
    const r = await fetch(base + route);
    assert.equal(r.status, 200, route);
    const html = await r.text();
    assert.match(html, /<h1/);
    assert.match(html, /Samarth Tech Software/);
    assert.doesNotMatch(html, /cdn.tailwindcss|googleapis.com/);
  }
  assert.equal((await fetch(base + "/does-not-exist")).status, 404);
  assert.equal((await fetch(base + "/services/nonexistent")).status, 404);
});
test("private source and database are not exposed", async () => {
  for (const route of [
    "/server/data/enquiries.sqlite",
    "/server/index.mjs",
    "/.env",
    "/src/data.js",
  ]) {
    const r = await fetch(base + route);
    assert.equal(r.status, 404);
    assert.doesNotMatch(await r.text(), /CREATE TABLE|SMTP_PASS=/);
  }
});
test("rejects missing CSRF token", async () => {
  assert.equal((await send(payload, randomUUID(), "")).status, 403);
});
test("validates the fields on the server", async () => {
  const r = await send({ ...payload, email: "invalid", message: "short" });
  assert.equal(r.status, 422);
});
test("rejects honeypot submissions", async () => {
  assert.equal(
    (await send({ ...payload, website: "https://spam.invalid" })).status,
    400,
  );
});
test("rejects unapproved service values", async () => {
  assert.equal(
    (await send({ ...payload, service: "fake-service" })).status,
    422,
  );
});
test("requires privacy acknowledgement", async () => {
  assert.equal((await send({ ...payload, privacy: "" })).status, 422);
});
test("saves durably and prevents duplicate records", async () => {
  const key = randomUUID();
  const r = await send(payload, key);
  assert.equal(r.status, 201);
  const result = await r.json();
  assert.match(result.reference, /^STS-[0-9A-F]{8}$/);
  const retry = await send(payload, key);
  assert.equal(retry.status, 200);
  assert.equal((await retry.json()).reference, result.reference);
  const db = new DatabaseSync(path.join(data, "enquiries.sqlite"), {
    readOnly: true,
  });
  const rows = db.prepare("SELECT * FROM enquiries").all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].email, payload.email);
  assert.equal(rows[0].notification_status, "unconfigured");
  db.close();
  const conflict = await send(
    { ...payload, message: payload.message + " Changed." },
    key,
  );
  assert.equal(conflict.status, 409);
});
test("rate limits repeated submissions", async () => {
  let r;
  for (let i = 0; i < 4; i++) r = await send({ ...payload, website: "spam" });
  assert.equal(r.status, 429);
});
test("serves a sitemap and security headers", async () => {
  const r = await fetch(base + "/");
  assert.ok(r.headers.get("content-security-policy"));
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  assert.match(xml, /<urlset/);
  assert.match(xml, /services\/ai-automation/);
});

test("welcomes search and AI crawlers", async () => {
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.match(robots, /User-agent: GPTBot\nAllow: \//);
  assert.match(robots, /User-agent: ClaudeBot\nAllow: \//);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: http:\/\/localhost:3001\/sitemap\.xml/);
  const llms = await fetch(base + "/llms.txt");
  assert.equal(llms.status, 200);
  const text = await llms.text();
  assert.match(text, /^# Samarth Tech Software/);
  assert.match(text, /\/services\/ai-automation/);
  assert.doesNotMatch(text, /enquir.*@/i);
});

test("emits structured data for local search", async () => {
  const html = await (await fetch(base + "/services/wordpress")).text();
  assert.match(html, /<title>[^<]*in Nashik[^<]*<\/title>/);
  const json = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1],
  );
  const types = json["@graph"].flatMap((node) => node["@type"]);
  for (const type of ["Organization", "BreadcrumbList", "Service", "FAQPage"])
    assert.ok(types.includes(type), type);
});

test("rejects scanner probes and sets hardening headers", async () => {
  for (const probe of ["/wp-login.php", "/.env", "/.git/config", "/admin.php"]) {
    const r = await fetch(base + probe);
    assert.equal(r.status, 404, probe);
    assert.doesNotMatch(await r.text(), /<html/);
  }
  const r = await fetch(base + "/");
  assert.match(r.headers.get("permissions-policy"), /camera=\(\)/);
  assert.match(r.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.doesNotMatch(r.headers.get("content-security-policy"), /unsafe-inline/);
  const api = await fetch(base + "/api/health");
  assert.equal(api.headers.get("x-robots-tag"), "noindex, nofollow");
});

test("every published service can be selected in an enquiry", async () => {
  const { services } = await import("../src/data.js");
  const source = readFileSync("server/index.mjs", "utf8");
  const allowList = source.match(/allowedServices = new Set\(\[([\s\S]*?)\]\)/)[1];
  for (const { slug } of services) assert.match(allowList, new RegExp(`"${slug}"`), slug);
  const html = await (await fetch(base + "/services/php-security")).text();
  assert.match(html, /<title>PHP Security &amp; Server Hardening in Nashik/);
});
