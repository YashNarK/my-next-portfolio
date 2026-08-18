"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type DownloadState = "idle" | "working" | "done";

interface DownloadImageButtonProps {
  /** Absolute URL of the badge image. */
  url: string;
  /** Credential title, used to name the saved file. */
  title: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Saves the badge image to disk. The image is fetched into a blob first because
 * `<a download>` is ignored cross-origin — Firebase Storage is a different host,
 * so a plain link would navigate to the image instead of saving it. If the fetch
 * is blocked (CORS), fall back to opening it so the user can save it manually.
 */
const DownloadImageButton = ({ url, title }: DownloadImageButtonProps) => {
  const [state, setState] = useState<DownloadState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const download = useCallback(async () => {
    setState("working");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const blob = await res.blob();

      // Storage objects are saved without a file extension, so derive one from
      // the content type rather than the URL.
      const ext = (blob.type.split("/")[1] || "png").replace("jpeg", "jpg");
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${slugify(title)}.${ext}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);

      setState("done");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 2000);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
      setState("idle");
    }
  }, [url, title]);

  return (
    <Tooltip
      title={state === "done" ? "Saved!" : "Download badge image"}
      placement="left"
      arrow
    >
      <span>
        <IconButton
          onClick={download}
          disabled={state === "working"}
          aria-label="Download badge image"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": { backgroundColor: "background.paper", boxShadow: 4 },
          }}
        >
          {state === "working" ? (
            <CircularProgress size={18} />
          ) : state === "done" ? (
            <CheckRoundedIcon fontSize="small" color="success" />
          ) : (
            <DownloadRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default DownloadImageButton;
