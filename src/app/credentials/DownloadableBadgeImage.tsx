"use client";

import { Box, Tooltip } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type DownloadState = "idle" | "working" | "done" | "failed";

interface DownloadableBadgeImageProps {
  /** Absolute URL of the badge image. */
  src: string;
  /** Credential title, used for alt text and to name the saved file. */
  title: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * The badge image itself is the download control — clicking it saves the file.
 * A separate overlay button ate into the space the image had to render in, and a
 * tooltip carries the affordance just as well.
 *
 * The image is fetched into a blob first because `<a download>` is ignored
 * cross-origin — Firebase Storage is a different host, so a plain link would
 * navigate to the image instead of saving it. If the fetch is blocked (CORS),
 * fall back to opening it so the image can still be saved manually.
 */
const DownloadableBadgeImage = ({ src, title }: DownloadableBadgeImageProps) => {
  const [state, setState] = useState<DownloadState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1500);
  };

  const download = useCallback(async () => {
    setState("working");
    try {
      const res = await fetch(src);
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
      reset();
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
      setState("failed");
      reset();
    }
  }, [src, title]);

  const tooltip =
    state === "working"
      ? "Downloading…"
      : state === "done"
        ? "Saved!"
        : state === "failed"
          ? "Opened in a new tab"
          : "Click to download";

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <Box
        onClick={download}
        sx={{ width: "100%", cursor: "pointer", lineHeight: 0 }}
      >
        <Image
          src={src}
          alt={title}
          width={500}
          height={300}
          unoptimized
          style={{
            width: "100%",
            height: "300px",
            maxHeight: "300px",
            objectFit: "contain",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default DownloadableBadgeImage;
