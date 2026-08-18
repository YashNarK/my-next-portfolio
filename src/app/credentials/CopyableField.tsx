"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Box, Tooltip } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

interface CopyableFieldProps {
  /** The exact text placed on the clipboard. */
  value: string;
  /** Names the field in the tooltip, e.g. "credential ID" -> "Copy credential ID". */
  label: string;
  /** The rendered field; stays styled by the caller. */
  children: React.ReactNode;
  /** Lay out as a block (description) rather than inline (ID, title). */
  block?: boolean;
}

/**
 * Wraps any rendered field in a click-to-copy affordance: the whole area is the
 * hit target, and a copy icon trails the content so the behaviour is discoverable
 * without hovering. Feedback follows the same 2s "Copied!" convention the admin
 * notes list uses.
 */
const CopyableField = ({
  value,
  label,
  children,
  block = false,
}: CopyableFieldProps) => {
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

  const copy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      // Clipboard access needs a secure context; surface the failure instead of
      // silently doing nothing.
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }, [value]);

  const tooltip =
    state === "copied"
      ? "Copied!"
      : state === "failed"
        ? "Copy failed — select the text manually"
        : `Copy ${label}`;

  const Icon =
    state === "copied"
      ? CheckRoundedIcon
      : state === "failed"
        ? ErrorOutlineRoundedIcon
        : ContentCopyRoundedIcon;

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <Box
        role="button"
        tabIndex={0}
        aria-label={`Copy ${label}`}
        onClick={copy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            copy();
          }
        }}
        sx={{
          display: block ? "block" : "inline-flex",
          alignItems: block ? undefined : "center",
          gap: 0.75,
          position: "relative",
          cursor: "pointer",
          borderRadius: 1,
          px: 0.75,
          mx: -0.75,
          transition: "background-color 120ms ease",
          "&:hover, &:focus-visible": {
            backgroundColor: "action.hover",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
          "& .copy-indicator": {
            opacity: state === "idle" ? 0.45 : 1,
            transition: "opacity 120ms ease",
          },
          "&:hover .copy-indicator": { opacity: 1 },
        }}
      >
        {children}
        <Box
          component={Icon}
          className="copy-indicator"
          fontSize="small"
          sx={{
            verticalAlign: "middle",
            ml: block ? 0.75 : 0,
            color:
              state === "copied"
                ? "success.main"
                : state === "failed"
                  ? "error.main"
                  : "inherit",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default CopyableField;
