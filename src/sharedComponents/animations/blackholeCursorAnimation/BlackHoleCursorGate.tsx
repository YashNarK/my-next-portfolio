"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * Renders the black-hole cursor only on visitor-facing routes.
 *
 * The cursor is a react-three-fiber Canvas with an animation frame loop —
 * the single most expensive thing on the page. The admin panel is behind
 * a login and is a data-entry surface, so it pays that cost for nobody.
 *
 * WHAT THIS DOES AND DOES NOT SAVE. Skipping the render avoids the real
 * runtime cost — no WebGL context, no per-frame loop, no pointer
 * listeners on admin routes. It does NOT currently shrink the download:
 * SceneBackground also sits in the root layout and statically imports
 * @react-three/fiber, so the ~956 KB three.js chunk is referenced by
 * every prerendered page either way (verified in the build output).
 * Gating SceneBackground the same way is what would realise that saving.
 *
 * The import is still dynamic so the cursor's own module is not pulled
 * in eagerly, and so this stays correct if SceneBackground is gated
 * later — at which point admin genuinely stops fetching three.js.
 *
 * ssr: false because the component reads pointer position and mounts a
 * WebGL canvas — there is nothing meaningful to render on the server.
 */
const BlackHoleCursor = dynamic(() => import("./BlackHoleCursor"), {
  ssr: false,
});

/** Route prefixes that never show the cursor. */
const EXCLUDED_PREFIXES = ["/admin"];

export default function BlackHoleCursorGate() {
  const pathname = usePathname();

  const excluded = EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`),
  );

  if (excluded) return null;

  return <BlackHoleCursor />;
}
