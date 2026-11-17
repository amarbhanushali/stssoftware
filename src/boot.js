// Everything the very first render needs to know, computed the same way on the
// server (server/index.mjs) and in the browser (src/main.jsx). Because both
// sides start from identical values, React can hydrate without a mismatch, and
// the cookie banner and chat button can be part of the HTML the server sends
// instead of popping in after the JavaScript finishes (PageSpeed: Speed Index).

// The visitor's analytics choice is remembered in a small first-party cookie
// (not localStorage) because the server has to see it to know whether to draw
// the banner. It holds only the word accepted or denied.
export const consentCookie = "sts_consent";

export function parseConsent(cookies) {
  const match = String(cookies || "").match(/(?:^|;\s*)sts_consent=(accepted|denied)(?=;|$)/);
  return match ? match[1] : null;
}

export function saveConsent(value) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${consentCookie}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
}

// Browser side. The meta tags are written by the server from the same values it
// uses to render, so the two always agree.
export function readBoot() {
  const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.content || "";
  return {
    consent: parseConsent(document.cookie),
    gaId: meta("google-analytics-id"),
    hubspot: meta("hubspot-tracking"),
    chat: Boolean(document.querySelector('meta[name="chat-enabled"]')),
  };
}

// Used by tests and by the dev server, where nothing is configured.
export const emptyBoot = { consent: null, gaId: "", hubspot: "", chat: false };
