import nodemailer from "nodemailer";

// SMTP setup shared by the server and `npm run mail:test`. Error messages and
// logs name settings and SMTP status codes only, never passwords.

const required = ["SMTP_HOST", "MAIL_FROM", "NOTIFY_EMAIL"];

export function missingMailSettings(env = process.env) {
  const missing = required.filter((name) => !env[name]?.trim());
  if (env.SMTP_USER?.trim() && !env.SMTP_PASS) missing.push("SMTP_PASS");
  if (/gmail\.com$/i.test(env.SMTP_HOST?.trim() || "") && !env.SMTP_USER?.trim())
    missing.push("SMTP_USER", "SMTP_PASS");
  return [...new Set(missing)];
}

export function mailSummary(env = process.env) {
  return `${env.SMTP_HOST?.trim()}:${Number(env.SMTP_PORT || 587)}`;
}

export function createMailTransport(env = process.env) {
  if (missingMailSettings(env).length) return null;
  const host = env.SMTP_HOST.trim();
  const port = Number(env.SMTP_PORT || 587);
  // Google shows App Passwords as "abcd efgh ijkl mnop"; the spaces are not
  // part of the password.
  const pass = /gmail\.com$/i.test(host)
    ? String(env.SMTP_PASS || "").replace(/\s+/g, "")
    : env.SMTP_PASS;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: env.SMTP_USER?.trim() ? { user: env.SMTP_USER.trim(), pass } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    // Form content is untrusted. It is escaped in the HTML template
    // (server/email.mjs) and Nodemailer must never resolve local files or
    // remote URLs from it.
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}

const address = (value) =>
  (String(value || "").match(/<([^>]+)>/)?.[1] || String(value || "")).trim().toLowerCase();

// Settings that "work" but make mail vanish with Gmail/Google Workspace.
export function mailWarnings(env = process.env) {
  if (!/gmail\.com$/i.test(env.SMTP_HOST?.trim() || "")) return [];
  const user = address(env.SMTP_USER);
  const from = address(env.MAIL_FROM);
  const warnings = [];
  if (user && from && from !== user)
    warnings.push(
      `MAIL_FROM (${from}) differs from SMTP_USER (${user}). Gmail rewrites the sender to ${user} unless ${from} is a verified "Send mail as" alias.`,
    );
  if (user && address(env.NOTIFY_EMAIL) === user)
    warnings.push(
      `NOTIFY_EMAIL is the same mailbox as SMTP_USER (${user}). Gmail files mail sent to yourself under Sent, not Inbox. Send from a different account or notify a different address.`,
    );
  return warnings;
}

// Turns a Nodemailer error into a one-line, secret-free diagnosis.
export function describeMailError(error, env = process.env) {
  const code = error?.code || "UNKNOWN";
  const status = error?.responseCode;
  const where = mailSummary(env);
  const gmail = /gmail\.com$/i.test(env.SMTP_HOST?.trim() || "");
  let hint;
  if (code === "EAUTH" || status === 535 || status === 534)
    hint = gmail
      ? "Gmail rejected the login. SMTP_USER must be the full Gmail address and SMTP_PASS a 16-character App Password (Google Account > Security > 2-Step Verification > App passwords), not the normal Gmail password."
      : "The SMTP server rejected SMTP_USER/SMTP_PASS.";
  else if (status === 530)
    hint = "The SMTP server requires a login. Set SMTP_USER and SMTP_PASS.";
  else if (["ETIMEDOUT", "ECONNECTION", "ECONNREFUSED", "ESOCKET", "ECONNRESET"].includes(code))
    hint = `Could not connect to ${where}. The hosting provider may block outgoing SMTP; try SMTP_PORT=465 (or 587), or use the host's own mail server.`;
  else if (code === "EDNS" || code === "ENOTFOUND")
    hint = `SMTP_HOST "${env.SMTP_HOST}" could not be found. For Gmail use smtp.gmail.com.`;
  else if (code === "EENVELOPE" || status === 553 || status === 550 || status === 501)
    hint = gmail
      ? "Gmail refused an address. Set MAIL_FROM to the same Gmail address as SMTP_USER (or a verified 'Send mail as' alias) and check NOTIFY_EMAIL."
      : "The server refused the sender or recipient address. Check MAIL_FROM and NOTIFY_EMAIL.";
  else hint = "Unexpected SMTP error.";
  return `${hint} [code=${code}${status ? ` smtp=${status}` : ""}${error?.command ? ` command=${error.command}` : ""}]`;
}
