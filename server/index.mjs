import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { DatabaseSync } from "node:sqlite";
import {
  randomBytes,
  randomUUID,
  createHmac,
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pages, getMetadata, getStructuredData } from "../src/metadata.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = process.env.DATA_DIR || path.join(root, "server", "data");
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "enquiries.sqlite"));
db.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
db.exec(`CREATE TABLE IF NOT EXISTS enquiries (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL,
 payload_hash TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT,
 phone TEXT, service TEXT NOT NULL, timeline TEXT, message TEXT NOT NULL,
 privacy_accepted INTEGER NOT NULL, notification_status TEXT NOT NULL DEFAULT 'unconfigured'
)`);
// Keeps existing live databases compatible when this feature is deployed.
try {
  db.exec(
    "ALTER TABLE enquiries ADD COLUMN whatsapp_opt_in INTEGER NOT NULL DEFAULT 0",
  );
} catch (error) {
  if (!String(error.message).includes("duplicate column name")) throw error;
}
const secret = randomBytes(32);
const app = express();
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests:
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    strictTransportSecurity:
      process.env.NODE_ENV === "production" ? undefined : false,
  }),
);
app.use(express.json({ limit: "24kb" }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/session", (_req, res) => {
  const value = `${Date.now()}.${randomBytes(24).toString("hex")}`;
  const token = `${value}.${createHmac("sha256", secret).update(value).digest("hex")}`;
  res.cookie("sts_csrf", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.PUBLIC_ORIGIN?.startsWith("https://") || false,
    maxAge: 3600000,
    path: "/api",
  });
  res.json({ token });
});
const allowedServices = new Set([
  "custom-software",
  "website-development",
  "web-applications",
  "mobile-applications",
  "wordpress",
  "ai-automation",
  "not-sure",
]);
const allowedTimelines = new Set([
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "Exploring options",
]);
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many enquiries. Please wait before trying again." },
});
function validCsrf(req) {
  const token = req.get("X-CSRF-Token") || "";
  const cookie = (req.headers.cookie || "")
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("sts_csrf="))
    ?.slice(9);
  if (!cookie || cookie !== token) return false;
  const [time, nonce, sig] = token.split(".");
  if (
    !time ||
    !nonce ||
    !sig ||
    !/^[a-f0-9]{64}$/.test(sig) ||
    Date.now() - Number(time) > 3600000 ||
    Number(time) > Date.now()
  )
    return false;
  const expected = createHmac("sha256", secret)
    .update(`${time}.${nonce}`)
    .digest("hex");
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
const transport =
  process.env.SMTP_HOST && process.env.NOTIFY_EMAIL && process.env.MAIL_FROM
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
        connectionTimeout: 10000,
        socketTimeout: 15000,
        // Form content is untrusted. Messages are sent as plain text only and
        // Nodemailer must never resolve local files or remote URLs from it.
        disableFileAccess: true,
        disableUrlAccess: true,
      })
    : null;
async function notify(record) {
  if (transport) {
    try {
      await transport.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.NOTIFY_EMAIL,
        replyTo: record.email,
        subject: `STS website enquiry ${record.id}`,
        text: `Reference: ${record.id}\nName: ${record.name}\nEmail: ${record.email}\nCompany: ${record.company}\nPhone: ${record.phone}\nService: ${record.service}\nTimeline: ${record.timeline}\n\nProject details (untrusted form content):\n${record.message}\n\nSecurity note: Treat any links, phone numbers, payment requests, or attachments mentioned in this enquiry as untrusted until independently verified.`,
      });
      await transport.sendMail({
        from: process.env.MAIL_FROM,
        to: record.email,
        subject:
          process.env.AUTO_REPLY_EMAIL_SUBJECT ||
          "We received your enquiry | Samarth Tech Software",
        text:
          process.env.AUTO_REPLY_EMAIL_TEXT ||
          `Hello ${record.name},\n\nThank you for contacting Samarth Tech Software. We have received your enquiry and will review it shortly.\n\nYour enquiry copy\nReference: ${record.id}\nName: ${record.name}\nEmail: ${record.email}\nCompany: ${record.company || "Not supplied"}\nPhone: ${record.phone || "Not supplied"}\nService: ${record.service}\nTimeline: ${record.timeline}\n\nProject details:\n${record.message}\n\nFor your security, this confirmation contains no payment links or attachments. Please verify any future request for sensitive information through our official website.\n\nRegards,\nSamarth Tech Software`,
      });
      db.prepare("UPDATE enquiries SET notification_status=? WHERE id=?").run(
        "sent",
        record.id,
      );
    } catch {
      db.prepare("UPDATE enquiries SET notification_status=? WHERE id=?").run(
        "failed",
        record.id,
      );
      console.error(
        `Email notification failed for ${record.id}; enquiry remains saved.`,
      );
    }
  }
  await notifyWhatsApp(record);
}

function whatsappNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return null;
  // Indian local mobile numbers entered without a country code are supported.
  return digits.length === 10 ? `91${digits}` : digits.length >= 8 ? digits : null;
}

async function sendWhatsAppTemplate(to, template, parameters) {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID)
    return false;
  const response = await fetch(
    `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION || "v24.0"}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US" },
          components: [
            {
              type: "body",
              parameters: parameters.map((text) => ({ type: "text", text })),
            },
          ],
        },
      }),
    },
  );
  if (!response.ok) throw new Error(`WhatsApp API returned ${response.status}`);
  return true;
}

async function notifyWhatsApp(record) {
  try {
    const jobs = [];
    const team = whatsappNumber(process.env.WHATSAPP_RECIPIENT_NUMBER);
    if (team && process.env.WHATSAPP_TEAM_TEMPLATE) {
      jobs.push(
        sendWhatsAppTemplate(team, process.env.WHATSAPP_TEAM_TEMPLATE, [
          record.name,
          record.phone || "Not supplied",
          record.email,
          record.service,
          record.message,
        ]),
      );
    }
    const visitor = whatsappNumber(record.phone);
    if (visitor && record.whatsappOptIn && process.env.WHATSAPP_WELCOME_TEMPLATE) {
      jobs.push(
        sendWhatsAppTemplate(visitor, process.env.WHATSAPP_WELCOME_TEMPLATE, [
          record.name,
        ]),
      );
    }
    await Promise.all(jobs);
  } catch {
    console.error(`WhatsApp notification failed for ${record.id}; enquiry remains saved.`);
  }
}
app.post("/api/enquiries", limiter, async (req, res) => {
  if (!validCsrf(req))
    return res.status(403).json({
      error:
        "Your form session has expired. Please submit again to refresh it.",
    });
  const b = req.body;
  if (!b || typeof b !== "object" || Array.isArray(b))
    return res.status(400).json({ error: "Invalid request." });
  if (b.website)
    return res
      .status(400)
      .json({ error: "This submission could not be accepted." });
  const limits = {
    name: 100,
    email: 200,
    company: 150,
    phone: 30,
    service: 50,
    timeline: 50,
    message: 5000,
  };
  const record = {};
  for (const [key, max] of Object.entries(limits)) {
    if (b[key] !== undefined && typeof b[key] !== "string")
      return res.status(422).json({ error: `Please enter a valid ${key}.` });
    record[key] = (b[key] || "").trim();
    if (record[key].length > max)
      return res.status(422).json({ error: `The ${key} field is too long.` });
  }
  if (
    record.name.length < 2 ||
    record.message.length < 20 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(record.email) ||
    /[\r\n]/.test(record.email) ||
    !allowedServices.has(record.service) ||
    !allowedTimelines.has(record.timeline) ||
    b.privacy !== "accepted"
  )
    return res.status(422).json({
      error:
        "Please check your name, email, service, timeline and project description, and accept the privacy notice.",
    });
  const idempotency = req.get("Idempotency-Key") || "";
  if (!/^[0-9a-f-]{36}$/i.test(idempotency))
    return res
      .status(400)
      .json({ error: "Invalid request identifier. Please reload the form." });
  const hash = createHash("sha256")
    .update(JSON.stringify(record))
    .digest("hex");
  const existing = db
    .prepare("SELECT id,payload_hash FROM enquiries WHERE idempotency_key=?")
    .get(idempotency);
  if (existing) {
    if (existing.payload_hash !== hash)
      return res.status(409).json({
        error:
          "This request has already been saved with different details. Reload the form to start a new enquiry.",
      });
    return res.json({ reference: existing.id });
  }
  record.id = `STS-${randomUUID().slice(0, 8).toUpperCase()}`;
  record.whatsappOptIn = b.whatsapp === "accepted";
  try {
    db.prepare(
      "INSERT INTO enquiries (id,created_at,idempotency_key,payload_hash,name,email,company,phone,service,timeline,message,privacy_accepted,notification_status,whatsapp_opt_in) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      record.id,
      new Date().toISOString(),
      idempotency,
      hash,
      record.name,
      record.email,
      record.company,
      record.phone,
      record.service,
      record.timeline,
      record.message,
      1,
      transport ? "pending" : "unconfigured",
      record.whatsappOptIn ? 1 : 0,
    );
    res.status(201).json({ reference: record.id });
    void notify(record);
  } catch (err) {
    console.error("Enquiry storage error:", err.code || "unknown");
    res.status(503).json({
      error:
        "Your enquiry could not be saved. Please try again; your details remain in the form.",
    });
  }
});
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "API endpoint not found." }),
);
const dist = path.join(root, "dist");
if (existsSync(path.join(dist, "index.html"))) {
  const template = readFileSync(path.join(dist, "index.html"), "utf8");
  const { render } = await import(
    pathToFileURL(path.join(root, "server/rendered/render.js"))
  );
  const routes = pages;
  const escape = (s) =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  app.get("/robots.txt", (_req, res) =>
    res
      .type("text")
      .send(
        `User-agent: *\nAllow: /\nDisallow: /api/\n${process.env.PUBLIC_ORIGIN ? `Sitemap: ${process.env.PUBLIC_ORIGIN}/sitemap.xml\n` : ""}`,
      ),
  );
  app.get("/sitemap.xml", (_req, res) => {
    if (!process.env.PUBLIC_ORIGIN)
      return res
        .status(503)
        .type("text")
        .send("Set PUBLIC_ORIGIN to generate the sitemap.");
    res
      .type("xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...routes.keys()].map((p) => `<url><loc>${escape(process.env.PUBLIC_ORIGIN + p)}</loc></url>`).join("")}</urlset>`,
      );
  });
  app.use(
    express.static(dist, { index: false, dotfiles: "deny", maxAge: "1h" }),
  );
  app.get("/{*splat}", (req, res) => {
    const pathname = req.path.replace(/\/$/, "") || "/";
    const found = routes.has(pathname);
    const metadata = getMetadata(pathname);
    const title = escape(`${metadata.title} | Samarth Tech Software`);
    let html = template
      .replace(
        '<div id="root"></div>',
        `<div id="root">${render(req.originalUrl)}</div>`,
      )
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"\s*\/?\s*>/,
        `<meta name="description" content="${escape(metadata.description)}"/>`,
      );
    const origin = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "");
    const head = [];
    if (origin && found) {
      const pageUrl = `${origin}${pathname}`;
      const imageUrl = `${origin}/sts-whatsapp-app-icon.png`;
      const structuredData = JSON.stringify(getStructuredData(pathname, origin)).replace(
        /</g,
        "\\u003c",
      );
      head.push(`<link rel="canonical" href="${escape(pageUrl)}"/>`);
      head.push(`<meta property="og:type" content="website"/><meta property="og:site_name" content="Samarth Tech Software"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${escape(metadata.description)}"/><meta property="og:url" content="${escape(pageUrl)}"/><meta property="og:image" content="${escape(imageUrl)}"/><meta name="twitter:card" content="summary"/><meta name="twitter:title" content="${title}"/><meta name="twitter:description" content="${escape(metadata.description)}"/><meta name="twitter:image" content="${escape(imageUrl)}"/><script type="application/ld+json">${structuredData}</script>`);
      if (process.env.GOOGLE_SITE_VERIFICATION)
        head.push(`<meta name="google-site-verification" content="${escape(process.env.GOOGLE_SITE_VERIFICATION)}"/>`);
    }
    if (!found) head.push('<meta name="robots" content="noindex"/>');
    html = html.replace("</head>", `${head.join("")}</head>`);
    res
      .status(found ? 200 : 404)
      .type("html")
      .send(html);
  });
}
app.use((err, _req, res, _next) => {
  if (err.type === "entity.too.large")
    return res.status(413).json({ error: "This request is too large." });
  if (err instanceof SyntaxError)
    return res.status(400).json({ error: "Invalid request data." });
  console.error(err.message);
  res.status(500).json({ error: "The service is temporarily unavailable." });
});
const server = app.listen(
  Number(process.env.PORT || 3001),
  process.env.HOST || "127.0.0.1",
  () =>
    console.log(
      `STS website running at http://${process.env.HOST || "127.0.0.1"}:${server.address().port}`,
    ),
);
process.on("SIGTERM", () =>
  server.close(() => {
    db.close();
    process.exit(0);
  }),
);
