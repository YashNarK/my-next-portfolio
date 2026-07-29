/**
 * Which routes count as visitor-facing.
 *
 * The admin panel sits behind a login and exists to enter data, so the
 * portfolio's decorative and visitor-oriented chrome — the WebGL cursor,
 * the animated background, the chatbot — has no audience there. Each of
 * those is gated on this single rule so the list lives in one place
 * rather than being restated in three components.
 */
const NON_VISITOR_PREFIXES = ["/admin"];

export function isVisitorRoute(pathname: string | null): boolean {
  if (!pathname) return true; // assume visitor until the route is known
  return !NON_VISITOR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
