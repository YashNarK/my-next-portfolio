"use client";

import { useAppTheme } from "@/hooks/useAppTheme";

/**
 * A plain themed fill occupying the same slot as the animated background.
 *
 * Needed because globals.css sets
 * `html, body { background: transparent !important }` — the animated
 * background is the only thing painting the page, so any moment where it
 * is absent shows the browser default white. Under the dark theme that
 * is light-on-white text, i.e. unreadable rather than merely plain.
 *
 * Used in two places: as the admin panel's permanent background, and as
 * the loading state while the visitor background's WebGL chunk is still
 * downloading — so neither route ever flashes white.
 */
export default function SolidBackdrop() {
  const theme = useAppTheme();

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        background: theme.palette.background.default,
      }}
    />
  );
}
