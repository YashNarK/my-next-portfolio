/** Turns a label into a stable, filename-safe slug, e.g. "Apache AGE" -> "apache-age". */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
