// Shared-secret authentication for machine callers (LLM tools, scripts, cron)
// that have no browser session and therefore no Firebase ID token cookie.

import { createHash, timingSafeEqual } from "node:crypto";

export type AuthResult =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: string };

/**
 * Compares two secrets without leaking their length or a byte-position prefix
 * through timing. Hashing first gives both sides a fixed 32-byte width, so
 * `timingSafeEqual` never throws on a length mismatch.
 */
function secretsMatch(a: string, b: string): boolean {
  const digest = (value: string) =>
    createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(digest(a), digest(b));
}

/** Pulls the presented secret from `Authorization: Bearer …` or `X-API-Key`. */
function readPresentedToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization) {
    const [scheme, ...rest] = authorization.trim().split(/\s+/);
    if (scheme.toLowerCase() === "bearer" && rest.length) {
      return rest.join(" ");
    }
    return null;
  }

  return request.headers.get("x-api-key");
}

/**
 * Guards a route with a static token held in an environment variable.
 *
 * Deliberately header-only: a token in the query string ends up in server
 * logs, browser history and `Referer` headers, and this one grants read access
 * to every note.
 *
 * A missing or blank env var fails closed with 503 rather than letting the
 * endpoint fall open — an unset variable in production must not become
 * anonymous access.
 */
export function authorizeBearer(
  request: Request,
  expectedToken: string | undefined,
): AuthResult {
  if (!expectedToken || !expectedToken.trim()) {
    return {
      ok: false,
      status: 503,
      error: "API access is not configured on this server",
    };
  }

  const presented = readPresentedToken(request);
  if (!presented) {
    return {
      ok: false,
      status: 401,
      error: "Missing credentials: send 'Authorization: Bearer <token>'",
    };
  }

  if (!secretsMatch(presented, expectedToken)) {
    return { ok: false, status: 401, error: "Invalid token" };
  }

  return { ok: true };
}
