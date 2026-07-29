"use client";

import { isVisitorRoute } from "@/sharedComponents/routeVisibility";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import SolidBackdrop from "./SolidBackdrop";

/**
 * Renders the animated background on visitor routes, and a plain themed
 * fill on the admin panel.
 *
 * THE FALLBACK IS NOT OPTIONAL. globals.css sets
 * `html, body { background: transparent !important }`, so SceneBackground
 * is the only thing painting the page — the dark-mode branch is a Canvas
 * whose own `background: #000000` IS the dark theme's backdrop. Simply
 * omitting it on admin would leave the browser default white behind
 * light-on-dark text, which is a bug rather than a style change.
 *
 * SolidBackdrop is also the dynamic import's `loading` state, which
 * matters on VISITOR routes: making this lazy means the WebGL chunk now
 * arrives after hydration, and without a placeholder those pages would
 * flash white in the gap. With it, every route paints a themed
 * background immediately and the animation replaces it when it lands.
 */
const SceneBackground = dynamic(() => import("./Scenebackground"), {
  ssr: false,
  loading: () => <SolidBackdrop />,
});

export default function SceneBackgroundGate() {
  const pathname = usePathname();

  if (isVisitorRoute(pathname)) {
    return <SceneBackground />;
  }

  return <SolidBackdrop />;
}
