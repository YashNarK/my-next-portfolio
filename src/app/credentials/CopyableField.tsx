"use client";

import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

interface CopyableFieldProps {
  /** The exact text placed on the clipboard. */
  value: string;
  /** The rendered field; stays styled by the caller. */
  children: React.ReactNode;
  /** Lay out as a block (description) rather than inline (ID, title). */
  block?: boolean;
}

/**
 * Click-to-copy with no visible affordance. This is an owner-facing shortcut for
 * pulling credential text into LinkedIn, not a feature visitors are meant to
 * discover — so there is no icon, no hover state and no cursor change, and the
 * wrapper adds no spacing of its own. The only thing that ever renders is the
 * transient "Copied!" confirmation, which appears after a click and never on hover.
 */
const CopyableField = ({ value, children, block = false }: CopyableFieldProps) => {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The component unmounts on every slide change, so a pending reset would
  // otherwise fire against a dead component.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(() => {
    if (!value) return;

    // Confirm optimistically and downgrade only on a rejection. Awaiting the
    // write before showing anything makes the confirmation hostage to the
    // clipboard promise, which can stay pending indefinitely when the document
    // is not properly focused — leaving a click with no feedback at all.
    setState("copied");
    navigator.clipboard.writeText(value).catch(() => setState("failed"));

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }, [value]);

  // The confirmation is rendered here rather than with a MUI Tooltip. A tooltip
  // only mounts on mouseenter, and since this field has no title until it is
  // clicked, MUI decides there is nothing to show and never opens it afterwards
  // — a controlled `open` does not rescue it either. A plain absolutely
  // positioned label has none of that coupling and only exists post-click.
  return (
    <Box
      onClick={copy}
      sx={{
        // inline-block rather than inline: an inline wrapper gives the absolutely
        // positioned confirmation no reliable box to sit above, so it lands on
        // top of the text it is confirming.
        display: block ? "block" : "inline-block",
        position: "relative",
      }}
    >
      {children}
      {state !== "idle" && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            mb: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            color: "common.white",
            backgroundColor: state === "failed" ? "error.main" : "success.main",
            zIndex: 3,
          }}
        >
          {state === "failed" ? "Copy failed" : "Copied!"}
        </Box>
      )}
    </Box>
  );
};

export default CopyableField;
