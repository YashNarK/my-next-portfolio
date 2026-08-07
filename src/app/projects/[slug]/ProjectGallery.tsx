"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  ZoomOutMap,
} from "@mui/icons-material";
import Image from "next/image";
import { IProjectShot } from "../../../../data/data.type";

/**
 * Screenshot carousel for a project's detail page. Shows the running product
 * rather than a single stock hero: a large frame, a caption naming the
 * capability on screen, a thumbnail rail, and a full-screen lightbox.
 */
const ProjectGallery = ({
  shots,
  title,
}: {
  shots: IProjectShot[];
  title: string;
}) => {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const count = shots.length;
  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  // Arrow keys move through the rail; Escape leaves the lightbox.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (count === 0) return null;

  const current = shots[index];

  const frame = (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "7 / 3",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.text.primary, 0.18)}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 18px 45px ${alpha(theme.palette.common.black, 0.45)}`,
      }}
    >
      {/* Every shot is mounted and cross-faded rather than swapped, so moving
          through the rail never shows an empty frame while the next one loads. */}
      {shots.map((shot, i) => (
        <Image
          key={shot.url}
          alt={shot.caption ?? `${title} screenshot ${i + 1}`}
          src={shot.url}
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
          style={{
            objectFit: "cover",
            objectPosition: "top center",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
          priority={i === 0}
        />
      ))}

      {count > 1 && (
        <>
          <NavButton side="left" onClick={() => go(-1)} />
          <NavButton side="right" onClick={() => go(1)} />
        </>
      )}

      <IconButton
        aria-label="View full size"
        onClick={() => setZoomed(true)}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.palette.common.white,
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.black, 0.75),
          },
        }}
      >
        <ZoomOutMap fontSize="small" />
      </IconButton>

      {count > 1 && (
        <Typography
          variant="codeLike"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 12,
            px: 1,
            py: 0.25,
            fontSize: "0.75rem",
            borderRadius: 1,
            color: theme.palette.common.white,
            backgroundColor: alpha(theme.palette.common.black, 0.6),
          }}
        >
          {index + 1} / {count}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box>
      {frame}

      {current.caption && (
        <Typography
          variant="professional"
          sx={{
            display: "block",
            mt: 1.5,
            fontSize: "0.95rem",
            color: alpha(theme.palette.text.primary, 0.75),
          }}
        >
          {current.caption}
        </Typography>
      )}

      {count > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 2, overflowX: "auto", pb: 1 }}
        >
          {shots.map((shot, i) => (
            <Box
              key={shot.url}
              onClick={() => setIndex(i)}
              role="button"
              aria-label={shot.caption ?? `Screenshot ${i + 1}`}
              sx={{
                position: "relative",
                flex: "0 0 auto",
                width: 104,
                height: 66,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                opacity: i === index ? 1 : 0.5,
                outline:
                  i === index
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                outlineOffset: i === index ? -2 : -1,
                transition: "opacity 0.2s, transform 0.2s",
                "&:hover": { opacity: 1, transform: "translateY(-2px)" },
              }}
            >
              <Image
                alt=""
                src={shot.url}
                fill
                sizes="104px"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            </Box>
          ))}
        </Stack>
      )}

      {zoomed && (
        <Box
          onClick={() => setZoomed(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: theme.zIndex.modal,
            backgroundColor: alpha(theme.palette.common.black, 0.92),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, md: 6 },
            cursor: "zoom-out",
          }}
        >
          <IconButton
            aria-label="Close"
            onClick={() => setZoomed(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: theme.palette.common.white,
            }}
          >
            <Close />
          </IconButton>
          <Box
            sx={{ position: "relative", width: "100%", height: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              alt={current.caption ?? title}
              src={current.url}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const NavButton = ({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) => {
  const theme = useTheme();
  return (
    <IconButton
      aria-label={side === "left" ? "Previous screenshot" : "Next screenshot"}
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [side]: 8,
        color: theme.palette.common.white,
        backgroundColor: alpha(theme.palette.common.black, 0.5),
        "&:hover": { backgroundColor: alpha(theme.palette.common.black, 0.75) },
      }}
    >
      {side === "left" ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  );
};

export default ProjectGallery;
