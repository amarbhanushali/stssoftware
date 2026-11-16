import { followUpEmail } from "./email.mjs";
import { describeMailError } from "./mail.mjs";

// Automatic follow-up: one email per enquiry, sent FOLLOWUP_DELAY_HOURS after
// it arrived (always within 24 hours), asking service-specific questions.
// - Only enquiries from the last 24 hours are considered, so deploying this
//   never emails old leads.
// - Sent during Indian business hours (09:00–20:00 IST) only.
// - Skipped when the team has already moved the lead out of "New" in HubSpot.
// - Each enquiry is claimed atomically, so it is never emailed twice.

export function istHour(date) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hourCycle: "h23",
    }).format(date),
  );
}

export function createFollowUps({ db, transport, delayHours, hubspot, origin, from, replyTo, log = console }) {
  const enabled = Boolean(transport) && delayHours > 0 && delayHours < 24;
  async function run(now = new Date()) {
    if (!enabled) return [];
    const hour = istHour(now);
    if (hour < 9 || hour >= 20) return [];
    const due = new Date(now.getTime() - delayHours * 3600000).toISOString();
    const oldest = new Date(now.getTime() - 24 * 3600000).toISOString();
    const rows = db
      .prepare(
        "SELECT * FROM enquiries WHERE followup_status IS NULL AND created_at <= ? AND created_at > ? ORDER BY created_at LIMIT 20",
      )
      .all(due, oldest);
    const results = [];
    for (const row of rows) {
      const claim = db
        .prepare("UPDATE enquiries SET followup_status='sending' WHERE id=? AND followup_status IS NULL")
        .run(row.id);
      if (claim.changes !== 1) continue;
      let status = "";
      if (hubspot && row.hubspot_contact_id) {
        try {
          const lead = await hubspot.leadStatus(row.hubspot_contact_id);
          if (lead && lead !== "NEW") status = "skipped-contacted";
        } catch (error) {
          // A HubSpot outage should not stop the follow-up.
          log.error(`Follow-up: HubSpot lead status check failed for ${row.id}. ${error.message}`);
        }
      }
      if (!status) {
        try {
          await transport.sendMail({ from, to: row.email, replyTo, ...followUpEmail(row, origin) });
          status = "sent";
        } catch (error) {
          status = "failed";
          log.error(`Follow-up email failed for ${row.id}. ${describeMailError(error)}`);
        }
      }
      db.prepare("UPDATE enquiries SET followup_status=?, followup_sent_at=? WHERE id=?").run(
        status,
        status === "sent" ? now.toISOString() : null,
        row.id,
      );
      if (status === "sent" && hubspot && row.hubspot_contact_id)
        await hubspot
          .addNote(
            row.hubspot_contact_id,
            `<p>Automatic follow-up email sent for ${row.id.replace(/[^A-Z0-9-]/gi, "")}, asking for more project details. Replies go to the sales inbox.</p>`,
          )
          .catch((error) => log.error(`Follow-up: HubSpot note failed for ${row.id}. ${error.message}`));
      results.push({ id: row.id, status });
    }
    return results;
  }
  return { enabled, run };
}
