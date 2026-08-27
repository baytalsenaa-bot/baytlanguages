// Supabase Storage object keys can silently reject or mishandle non-ASCII
// characters (em/en dashes, Arabic/Chinese script, etc.) — real filenames
// from real client documents hit this constantly. Strip anything outside a
// safe ASCII set for the storage key while the original name is preserved
// separately in document_versions.original_filename for display.
export function sanitizeFilename(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  const base = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.slice(lastDot + 1) : "";

  const safeBase =
    base
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "file";

  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  return safeExt ? `${safeBase}.${safeExt}` : safeBase;
}
