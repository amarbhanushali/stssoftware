import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const db = new DatabaseSync(
  path.join(
    process.env.DATA_DIR || path.join(root, "server/data"),
    "enquiries.sqlite",
  ),
  { readOnly: true },
);
// Local administrator command only. Never exposed through HTTP.
console.log(
  JSON.stringify(
    db
      .prepare(
        "SELECT id,created_at,name,email,company,phone,service,timeline,message,notification_status FROM enquiries ORDER BY created_at DESC",
      )
      .all(),
    null,
    2,
  ),
);
db.close();
