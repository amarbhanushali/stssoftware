// Local administrator command: checks the SMTP login and sends one test email
// to NOTIFY_EMAIL. Run on the server with `npm run mail:test`.
import {
  createMailTransport,
  describeMailError,
  mailSummary,
  mailWarnings,
  missingMailSettings,
} from "../server/mail.mjs";

const missing = missingMailSettings();
if (missing.length) {
  console.error(`Email is OFF. Set these settings: ${missing.join(", ")}.`);
  process.exit(1);
}
for (const warning of mailWarnings()) console.warn(`WARNING: ${warning}`);
const transport = createMailTransport();
try {
  await transport.verify();
  console.log(`1/2 SMTP login OK (${mailSummary()}).`);
  const info = await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.NOTIFY_EMAIL,
    subject: "STS website email test",
    text: `This is a test email from the Samarth Tech Software website server, sent ${new Date().toISOString()}.\n\nIf you can read this, enquiry notifications are working.`,
  });
  console.log(
    `2/2 Test email accepted for ${process.env.NOTIFY_EMAIL} (smtp: ${String(info.response).slice(0, 60)}). Check the inbox and the Spam folder.`,
  );
} catch (error) {
  console.error(`FAILED. ${describeMailError(error)}`);
  process.exit(1);
}
