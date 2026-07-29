"use client";

import { isVisitorRoute } from "@/sharedComponents/routeVisibility";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * Renders the black-hole cursor only on visitor-facing routes.
 *
 * The cursor is a react-three-fiber Canvas with an animation frame loop —
 * the single most expensive thing on the page. The admin panel is behind
 * a login and is a data-entry surface, so it pays that cost for nobody.
 *
 * Dynamically imported so the cursor's module is not pulled in eagerly.
 * Together with SceneBackgroundGate — the layout's other three.js
 * consumer — this is what keeps the WebGL chunk off admin routes
 * entirely; gating either one alone would still have left the other
 * importing it statically.
 *
 * ssr: false because the component reads pointer position and mounts a
 * WebGL canvas — there is nothing meaningful to render on the server.
 */
const BlackHoleCursor = dynamic(() => import("./BlackHoleCursor"), {
  ssr: false,
});

export default function BlackHoleCursorGate() {
  const pathname = usePathname();

  if (!isVisitorRoute(pathname)) return null;

  return <BlackHoleCursor />;
}
