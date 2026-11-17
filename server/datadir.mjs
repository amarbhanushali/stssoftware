import path from "node:path";

// Where enquiries live decides whether they survive a deploy and whether
// anyone could download them, so the startup log names the exact folder and
// warns about the three mistakes that have real consequences. `configured` is
// the raw DATA_DIR value, `resolved` the full path the app will really use.
export function dataDirWarnings(configured, resolved) {
  const warnings = [];
  if (configured && !path.isAbsolute(configured))
    warnings.push(
      `DATA_DIR "${configured}" is a relative path (no leading "/"), so it is created inside the app's current folder: ${resolved}. Set it to a full path, for example /home/<user>/sts-data.`,
    );
  if (/[\\/]hbuilds[\\/]versions[\\/]/.test(resolved))
    warnings.push(
      "the data folder is inside this deployment's build folder, which is replaced on every deploy, so enquiries may not survive the next one. Set DATA_DIR to a full path outside it, for example /home/<user>/sts-data.",
    );
  if (/[\\/]public_html([\\/]|$)/.test(resolved))
    warnings.push(
      "the data folder is inside public_html, the web server's public folder. Move it outside (for example /home/<user>/sts-data) so the database and secret can never be downloaded.",
    );
  return warnings;
}
