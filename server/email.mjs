import { company } from "../src/metadata.js";
import { services } from "../src/data.js";

// Branded enquiry emails. Every submitted value is untrusted: it is escaped
// before it enters the HTML, and a plain-text part is always sent alongside.
// Email clients ignore stylesheets, so this template is the one place in the
// project where inline styles are used (the website rule does not apply here).
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const address =
  "16 Shukhakarta Row Houses, Ganpati Temple, Shivajinagar Dharmaji Colony, Ashok Nagar, Nashik, Maharashtra 422012, India";
const colors = {
  navy: "#0c2f6e",
  orange: "#f96a00",
  ink: "#172033",
  muted: "#59697f",
  line: "#e2e8f0",
  canvas: "#f5f7fa",
};
const font = "Arial, Helvetica, sans-serif";

const serviceName = (slug) =>
  slug === "not-sure"
    ? "Not sure yet"
    : services.find((s) => s.slug === slug)?.name || slug;

function details(record) {
  return [
    ["Reference", record.id],
    ["Name", record.name],
    ["Email", record.email],
    ["Company", record.company || "Not supplied"],
    ["Phone", record.phone || "Not supplied"],
    ["Service", serviceName(record.service)],
    ["Timeline", record.timeline],
    ["Source", record.source === "chat" ? "Website chat assistant" : "Contact form"],
  ];
}

function layout({ origin, preheader, heading, intro, questions = [], record, messageLabel, note, closing }) {
  const logo = origin?.startsWith("https://")
    ? `<img src="${escape(`${origin}/sts-logo.png`)}" width="120" height="80" alt="${escape(company.name)}" style="display:block;border:0;width:120px;height:80px">`
    : `<span style="font-size:20px;font-weight:bold;color:${colors.navy}">${escape(company.name)}</span>`;
  const rows = details(record)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid ${colors.line};color:${colors.muted};font-size:14px;width:120px;vertical-align:top">${label}</td><td style="padding:8px 12px;border-bottom:1px solid ${colors.line};color:${colors.ink};font-size:14px;word-break:break-word">${escape(value)}</td></tr>`,
    )
    .join("");
  const message = escape(record.message).replace(/\r?\n/g, "<br>");
  const site = origin
    ? `<a href="${escape(origin)}" style="color:${colors.navy}">${escape(origin.replace(/^https?:\/\//, ""))}</a> · `
    : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(heading)}</title></head>
<body style="margin:0;padding:0;background:${colors.canvas};font-family:${font}">
<div style="display:none;max-height:0;overflow:hidden">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.canvas}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid ${colors.line}">
<tr><td style="background:#ffffff;padding:12px 24px;border-top:6px solid ${colors.navy};border-bottom:3px solid ${colors.orange}">${logo}</td></tr>
<tr><td style="padding:24px">
<h1 style="margin:0 0 12px;font-size:22px;color:${colors.navy};font-family:${font}">${escape(heading)}</h1>
${intro.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.5;color:${colors.ink}">${escape(p)}</p>`).join("")}
${questions.length ? `<ol style="margin:0 0 16px;padding-left:22px;font-size:15px;line-height:1.5;color:${colors.ink}">${questions.map((q) => `<li style="margin:0 0 8px">${escape(q)}</li>`).join("")}</ol>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border:1px solid ${colors.line};border-radius:6px">${rows}</table>
<h2 style="margin:20px 0 8px;font-size:16px;color:${colors.navy};font-family:${font}">${escape(messageLabel)}</h2>
<div style="padding:12px;background:${colors.canvas};border-left:3px solid ${colors.orange};font-size:14px;line-height:1.5;color:${colors.ink};word-break:break-word">${message}</div>
<p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:${colors.muted}">${escape(note)}</p>
${closing ? `<p style="margin:20px 0 0;font-size:15px;line-height:1.5;color:${colors.ink}">${closing.map(escape).join("<br>")}</p>` : ""}
</td></tr>
<tr><td style="padding:16px 24px;background:${colors.canvas};border-top:1px solid ${colors.line};font-size:12px;line-height:1.5;color:${colors.muted}">
<strong style="color:${colors.ink}">${escape(company.name)}</strong><br>${escape(address)}<br>
${site}<a href="mailto:${escape(company.email)}" style="color:${colors.navy}">${escape(company.email)}</a><br>
<a href="tel:${escape(company.phone)}" style="color:${colors.navy}">${escape(company.phoneDisplay)}</a><br>
${company.social.map(([network, url]) => `<a href="${escape(url)}" style="color:${colors.navy}">${network}</a>`).join(" · ")}
</td></tr>
</table></td></tr></table>
</body></html>`;
}

const textSocial = () =>
  company.social.map(([network, url]) => `${network}: ${url}`).join("\n");
const textDetails = (record) =>
  details(record)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

export function teamEmail(record, origin) {
  const note =
    "Security note: Treat any links, phone numbers, payment requests, or attachments mentioned in this enquiry as untrusted until independently verified.";
  return {
    subject: `STS ${record.source === "chat" ? "chat" : "website"} enquiry ${record.id}`,
    text: `${textDetails(record)}\n\nProject details (untrusted form content):\n${record.message}\n\n${note}`,
    html: layout({
      origin,
      preheader: `New enquiry from ${record.name} about ${serviceName(record.service)}`,
      heading: "New website enquiry",
      intro: [
        record.source === "chat"
          ? "A visitor described their project to the website chat assistant, reviewed this summary and sent it. Reply to this email to answer them directly."
          : "A visitor submitted the consultation form. Reply to this email to answer them directly.",
      ],
      record,
      messageLabel: "Project details (untrusted form content)",
      note,
    }),
  };
}

export function visitorEmail(record, origin) {
  const note =
    "For your security, this confirmation contains no payment links or attachments. Please verify any future request for sensitive information through our official website.";
  const intro = [
    "Thank you for contacting Samarth Tech Software. We have received your enquiry and will review it shortly.",
    "Here is a copy of what you sent us.",
  ];
  return {
    subject:
      process.env.AUTO_REPLY_EMAIL_SUBJECT ||
      "We received your enquiry | Samarth Tech Software",
    text:
      process.env.AUTO_REPLY_EMAIL_TEXT ||
      `Hello ${record.name},\n\n${intro.join("\n\n")}\n\n${textDetails(record)}\n\nProject details:\n${record.message}\n\n${note}\n\nRegards,\n${company.name}\n${company.email}\n${company.phoneDisplay}\n${textSocial()}`,
    // A custom AUTO_REPLY_EMAIL_TEXT replaces the whole message, so no HTML
    // part is sent that would contradict it.
    html: process.env.AUTO_REPLY_EMAIL_TEXT
      ? undefined
      : layout({
          origin,
          preheader: `We received your enquiry ${record.id}`,
          heading: `Hello ${record.name},`,
          intro,
          record,
          messageLabel: "Project details",
          note,
          closing: ["Regards,", company.name],
        }),
  };
}

// Questions for the automatic follow-up, chosen by the service the visitor
// picked. A service without its own list uses the general questions.
const followUpQuestions = {
  "custom-software": [
    "Which task, spreadsheet or manual process should the software replace first?",
    "Roughly how many people will use it, and in which roles (owner, office staff, field staff, customers)?",
    "Which tools must it work with today, for example Tally, Excel, WhatsApp, a payment gateway or an existing website?",
  ],
  "website-development": [
    "Do you already have a website or domain? If so, please share the link.",
    "Which pages or features do you need, for example services, enquiry form, product catalogue, booking or a blog?",
    "Please share two or three websites you like, and what you like about them.",
  ],
  "web-applications": [
    "Which process should the web application handle first, and how is it done today?",
    "Roughly how many people will log in, and do different roles need different access?",
    "Which tools or data must it connect to, for example Excel files, accounting software or an existing database?",
  ],
  "mobile-applications": [
    "Do you need Android, iPhone or both?",
    "Who will use the app: your customers, your field staff, or both?",
    "Which three features must the first version have?",
  ],
  wordpress: [
    "Is this a new WordPress site, or an existing one to improve? If existing, please share the link.",
    "Who on your team will update the content, and how often?",
    "Do you need features such as WooCommerce, bookings, multiple languages or a members area?",
  ],
  "ai-automation": [
    "Which repetitive task takes your team the most time today?",
    "Roughly how often does it happen, for example how many orders, emails or documents per day?",
    "Where does the information live today, for example Excel, Google Sheets, email, WhatsApp or accounting software?",
  ],
  "php-security": [
    "Which website or application needs attention, and who hosts it?",
    "Do you know the PHP or WordPress version it runs on?",
    "Have you seen any warning signs, such as a malware alert, unexpected redirects, spam emails or slowness?",
  ],
  "not-sure": [
    "What problem would you most like to solve first?",
    "Which tools do you use today, for example Excel, WhatsApp, Tally or an existing website?",
    "What would a good result look like for you six months from now?",
  ],
};

export function followUpEmail(record, origin) {
  const questions = [
    ...(followUpQuestions[record.service] || followUpQuestions["not-sure"]),
    "Do you have a rough budget range in mind? A range is enough.",
    record.phone
      ? "When is a good time for a short call?"
      : "When is a good time for a short call, and on which phone number?",
  ];
  const intro = [
    `Thank you again for your enquiry about ${serviceName(record.service)}. We are reviewing it now.`,
    "So we can send you useful next steps, could you reply to this email with a few more details? Short answers are fine.",
  ];
  const note =
    "Please do not send passwords, OTPs or payment details by email. If you no longer need help, simply reply \"no thanks\" and we will not follow up again.";
  return {
    subject: `A few quick questions about your enquiry ${record.id} | ${company.name}`,
    text: `Hello ${record.name},\n\n${intro.join("\n\n")}\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nYour original request:\n${record.message}\n\n${note}\n\nRegards,\n${company.name}\n${company.email}\n${company.phoneDisplay}\n${textSocial()}`,
    html: layout({
      origin,
      preheader: "A few quick questions so we can prepare your next steps",
      heading: `Hello ${record.name},`,
      intro,
      questions,
      record,
      messageLabel: "Your original request",
      note,
      closing: ["Regards,", company.name],
    }),
  };
}
