// Helpers shared by the admin notes UI and the REST endpoint, so a note
// downloaded from the browser and one fetched over HTTP are byte-identical
// and land under the same filename.

import type { INote } from "../../data/data.type";

/** Bucket for notes saved before categories existed, or saved without one. */
export const UNCATEGORIZED = "Uncategorized";

/** Long titles are legal in Firestore but not on every filesystem. */
const MAX_BASENAME_LENGTH = 120;

// Characters that are illegal in a Windows filename or would let a title
// escape the download directory, plus C0 control characters (which would
// also let a title inject header lines into Content-Disposition).
const ILLEGAL_FILENAME_CHARS = /[\x00-\x1F\\/:*?"<>|]/g;

export function noteCategory(note: Pick<INote, "category">): string {
  return note.category?.trim() || UNCATEGORIZED;
}

/**
 * The categories that actually exist on notes, sorted, for the comboboxes
 * that assign one. Excludes the `UNCATEGORIZED` bucket on purpose: that label
 * is how a missing category is displayed, never a value to write to a note —
 * clearing the category is what puts a note back in that bucket.
 */
export function assignableCategories(
  notes: Pick<INote, "category">[],
): string[] {
  return Array.from(
    new Set(
      notes
        .map((note) => note.category?.trim())
        .filter((category): category is string => !!category),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

/**
 * Turns a note title into the `<title>.txt` filename it downloads as.
 * Spaces and casing are kept — this is a human-facing filename, not a slug —
 * but anything a filesystem or a Content-Disposition header would choke on
 * is replaced. Falls back to `note.txt` when nothing usable survives.
 */
export function noteFileName(title: string): string {
  const base = title
    .replace(ILLEGAL_FILENAME_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_BASENAME_LENGTH)
    // a trailing dot makes the extension ambiguous (and is dropped on Windows)
    .replace(/\.+$/, "")
    .trim();

  return `${base || "note"}.txt`;
}

/**
 * The body of the downloaded file: the note content and nothing else. The
 * title already rides on the filename, and callers (LLM tools included)
 * want the content verbatim, not wrapped in a header they have to strip.
 */
export function noteToPlainText(note: Pick<INote, "content">): string {
  return note.content.endsWith("\n") ? note.content : `${note.content}\n`;
}

/**
 * Builds a `Content-Disposition` value for a note download. Non-ASCII titles
 * get an RFC 5987 `filename*` alongside a stripped ASCII fallback, so clients
 * that only understand the plain parameter still save something sensible.
 */
export function noteContentDisposition(title: string): string {
  const fileName = noteFileName(title);
  const ascii = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}
