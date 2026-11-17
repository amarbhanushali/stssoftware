// Turns the server-rendered page into Markdown for agents that send
// `Accept: text/markdown` (a fraction of the tokens of the HTML). It reads only
// the <main> content, which comes from src/data.js, and drops scripts, forms,
// buttons, SVG and anything marked aria-hidden (decorative). Links keep their
// text; relative links become absolute.

const entities = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·",
  ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  hellip: "…", times: "×",
};
const decode = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name) => {
    if (name[0] === "#") {
      const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : match;
    }
    return entities[name.toLowerCase()] ?? match;
  });

const skipTags = new Set(["script", "style", "svg", "form", "button", "nav", "noscript", "template", "select", "textarea"]);
const paragraphTags = new Set(["p", "div", "section", "article", "header", "footer", "main", "aside", "figure", "figcaption", "blockquote", "table", "details", "address", "dl"]);
const lineTags = new Set(["li", "tr", "br", "summary", "dt", "dd"]);
const voidTags = new Set(["img", "br", "hr", "input", "meta", "link", "source", "wbr"]);
const emphasis = { strong: "**", b: "**", em: "*", i: "*", code: "`" };
const hiddenAttribute = /\baria-hidden\s*=\s*["']true["']/i;
const hrefAttribute = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i;

function absoluteHref(href, origin) {
  const value = decode(href).trim();
  if (value.startsWith("/") && !value.startsWith("//")) return `${origin}${value}`;
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return "";
}

export function htmlToMarkdown(html, origin = "") {
  const start = html.indexOf("<main");
  const end = html.lastIndexOf("</main>");
  const source = start >= 0 && end > start ? html.slice(start, end) : html;
  const out = [];
  const links = [];
  const lists = [];
  const marks = [];
  let skipDepth = 0;
  let skipTag = "";
  const tokens = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>|([^<]+)|</g;
  let m;
  while ((m = tokens.exec(source))) {
    if (m[4] !== undefined) {
      if (!skipDepth) out.push(decode(m[4]).replace(/\s+/g, " "));
      continue;
    }
    if (m[2] === undefined) continue; // comment or stray "<"
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    if (skipDepth) {
      if (tag === skipTag) skipDepth += closing ? -1 : 1;
      continue;
    }
    const selfClosed = m[3].trimEnd().endsWith("/");
    if (!closing && !selfClosed && !voidTags.has(tag) && (skipTags.has(tag) || hiddenAttribute.test(m[3]))) {
      skipDepth = 1;
      skipTag = tag;
      continue;
    }
    if (skipTags.has(tag)) continue;
    if (/^h[1-6]$/.test(tag)) out.push(closing ? "\n\n" : `\n\n${"#".repeat(Number(tag[1]))} `);
    else if (paragraphTags.has(tag)) out.push("\n\n");
    else if (tag === "ul" || tag === "ol") {
      if (closing) lists.pop();
      else lists.push({ ordered: tag === "ol", n: 0 });
      out.push("\n");
    } else if (tag === "li") {
      if (closing) out.push("");
      else if (!lists.length) out.push("\n");
      else {
        const list = lists.at(-1);
        out.push(`\n${"  ".repeat(lists.length - 1)}${list.ordered ? `${++list.n}. ` : "- "}`);
      }
    } else if (tag === "summary") out.push(closing ? "\n\n" : "\n\n### ");
    else if (lineTags.has(tag)) out.push("\n");
    else if (tag === "hr") out.push("\n\n---\n\n");
    else if (emphasis[tag]) {
      // Emphasis is kept only around real text, never around nothing.
      if (!closing) marks.push({ tag, at: out.length });
      else {
        const i = marks.findLastIndex((x) => x.tag === tag);
        if (i >= 0) {
          const { at } = marks[i];
          marks.length = i;
          const text = out.splice(at).join("");
          out.push(text.trim() ? `${emphasis[tag]}${text.trim()}${emphasis[tag]} ` : text);
        }
      }
    } else if (tag === "span") out.push(" ");
    else if (tag === "td" || tag === "th") {
      if (closing) out.push(" | ");
    } else if (tag === "a") {
      if (!closing) {
        const href = m[3].match(hrefAttribute);
        links.push({ at: out.length, href: absoluteHref(href?.[1] ?? href?.[2] ?? "", origin) });
      } else if (links.length) {
        const { at, href } = links.pop();
        const text = out.splice(at).join("").replace(/\s+/g, " ").trim();
        out.push(text && href ? `[${text.replace(/([[\]])/g, "\\$1")}](${href}) ` : text);
      }
    }
  }
  return out
    .join("")
    .split("\n")
    .map((line) => {
      const lead = line.match(/^ */)[0];
      return (lead.length > 1 ? lead : "") + line.slice(lead.length).replace(/ {2,}/g, " ").trimEnd();
    })
    .join("\n")
    .replace(/ +([.,;:!?)])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
