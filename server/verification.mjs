// GOOGLE_SITE_VERIFICATION must hold only the `content` token of Google's
// HTML-tag method (about 43 characters of letters, digits, "-" and "_").
// A common mistake is pasting the verification FILE NAME (google1234abcd.html)
// or the whole <meta> tag. Publishing a wrong value verifies nothing, so this
// returns the usable token, or an empty token plus a reason to log.
export function googleVerification(value) {
  let raw = String(value ?? "").trim();
  if (!raw) return { token: "", problem: "" };
  // Accept a pasted <meta name="google-site-verification" content="..."> tag.
  const pasted = raw.match(/content\s*=\s*["']([^"']+)["']/i);
  if (pasted) raw = pasted[1].trim();
  if (/^[A-Za-z0-9_-]{20,100}$/.test(raw)) return { token: raw, problem: "" };
  const reason = /\.html?$/i.test(raw)
    ? `"${raw.slice(0, 60)}" is a verification FILE name, not a token. The file itself is already served from /public, so it needs no setting`
    : "it is not a Google verification token (expected 20-100 letters, digits, - or _)";
  return {
    token: "",
    problem: `GOOGLE_SITE_VERIFICATION is ignored: ${reason}. Remove it, or paste only the content="..." value from Google Search Console's HTML-tag method.`,
  };
}
