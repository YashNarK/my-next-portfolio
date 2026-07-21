// Small, dependency-free text helpers for the chatbot's deterministic
// keyword/entity matching. Nothing here calls an external model — every
// function is a pure string transform so behavior is 100% predictable.

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "in", "on", "at", "to", "for",
  "with", "is", "are", "was", "were", "be", "been", "do", "does", "did",
  "you", "your", "yours", "i", "me", "my", "mine", "about", "tell",
  "what", "who", "whom", "where", "when", "how", "can", "could", "would",
  "please", "hi", "hey", "hello", "thanks", "thank",
]);

/** Lowercase + trim + collapse whitespace. Never throws on non-string input. */
export function normalize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Escapes a string for safe interpolation into a RegExp. */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True if `needle` appears in `haystack` on a word boundary (so "js" won't
 * match inside "reject", but "next.js" will match "I use next.js daily").
 * Both inputs are normalized internally.
 */
export function includesWord(haystack: string, needle: string): boolean {
  const h = normalize(haystack);
  const n = normalize(needle);
  if (!h || !n) return false;
  const pattern = new RegExp(
    `(?<![a-z0-9])${escapeRegExp(n)}(?![a-z0-9])`,
    "i"
  );
  return pattern.test(h);
}

/** Splits normalized text into alphanumeric tokens (drops punctuation). */
export function tokenize(input: string): string[] {
  const normalized = normalize(input);
  if (!normalized) return [];
  return normalized.match(/[a-z0-9]+/g) ?? [];
}

/** Tokens with common stopwords removed and very short tokens dropped. */
export function significantTokens(input: string, minLength = 3): string[] {
  return tokenize(input).filter(
    (t) => t.length >= minLength && !STOPWORDS.has(t)
  );
}

/**
 * Counts how many distinct significant words of `label` appear as whole
 * words in `query`. Used to rank fuzzy matches against live Firestore
 * titles/company names we can't know ahead of time.
 */
export function significantWordOverlapScore(
  query: string,
  label: string,
  minLength = 3
): number {
  const labelWords = Array.from(new Set(significantTokens(label, minLength)));
  if (labelWords.length === 0) return 0;
  let score = 0;
  for (const word of labelWords) {
    if (includesWord(query, word)) score += 1;
  }
  return score;
}

/** Clamp + trim untrusted chat input before it ever reaches the engine. */
export function sanitizeUserInput(raw: string, maxLength = 400): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").trim().slice(0, maxLength);
}
