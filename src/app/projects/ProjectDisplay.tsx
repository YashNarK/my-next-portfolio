import { Box, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { IProject } from "../../../data/data.type";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/utils/slugify";

/**
 * Listing card for a single project. The card leads with a landscape
 * screenshot of the running product rather than decorative art — an
 * interviewer should be able to tell what the thing does before clicking.
 */
const ProjectDisplay = ({
  bgImageUrl,
  theme,
  project,
  priority = false,
}: {
  /** Card image URL, already resolved by the listing (screenshot preferred). */
  bgImageUrl: string;
  theme: Theme;
  project: IProject;
  /** Set on the cards above the fold so the screenshot is not lazy-loaded. */
  priority?: boolean;
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const visibleTechCount = isMobile ? 3 : 5;
  const hiddenCount = project.technologiesUsed.length - visibleTechCount;
  const projectSlug = slugify(project.title);
  const border = alpha(theme.palette.text.primary, 0.15);

  return (
    <Link
      href={`/projects/${projectSlug}`}
      style={{ textDecoration: "none", width: "100%", maxWidth: 560 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${border}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.55),
          backdropFilter: "blur(6px)",
          transition:
            "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            borderColor: alpha(theme.palette.primary.main, 0.6),
            boxShadow: `0 20px 45px ${alpha(theme.palette.common.black, 0.5)}`,
          },
          "&:hover .project-shot": { transform: "scale(1.04)" },
          "&:hover .project-cta": {
            color: theme.palette.secondary.main,
            transform: "translateX(3px)",
          },
        }}
      >
        {/* Screenshot of the running app, anchored to the top so headers and
            primary content survive the crop at every card width. */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            // Matches the widescreen aspect the demo screenshots are captured
            // at, so the frame crops almost nothing off the sides.
            aspectRatio: "7 / 3",
            overflow: "hidden",
            backgroundColor: alpha(theme.palette.common.black, 0.4),
            borderBottom: `1px solid ${border}`,
          }}
        >
          {bgImageUrl && (
            <Image
              className="project-shot"
              alt={`${project.title} screenshot`}
              src={bgImageUrl}
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              priority={priority}
              style={{
                objectFit: "cover",
                objectPosition: "top center",
                transition: "transform 0.35s ease",
              }}
            />
          )}
        </Box>

        <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1 }}>
          <Typography
            variant="codeLike"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: "1.25rem", md: "1.4rem" },
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </Typography>

          <Typography
            variant="professional"
            sx={{
              color: alpha(theme.palette.text.primary, 0.7),
              fontSize: "0.95rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.oneLiner}
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ pt: 0.5 }}>
            {project.technologiesUsed.slice(0, visibleTechCount).map((tech) => (
              <Typography
                key={tech}
                variant="codeLike"
                sx={{
                  px: 1,
                  py: 0.35,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: theme.palette.primary.contrastText,
                  backgroundColor: alpha(theme.palette.primary.main, 0.9),
                }}
              >
                {tech}
              </Typography>
            ))}

            {hiddenCount > 0 && (
              <Typography
                variant="codeLike"
                sx={{
                  px: 1,
                  py: 0.35,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: alpha(theme.palette.text.primary, 0.8),
                  border: `1px solid ${border}`,
                }}
              >
                +{hiddenCount}
              </Typography>
            )}
          </Stack>

          {/* `primary.main` is a surface colour in this palette (near-black in
              dark mode, pale mint in light), so it is unreadable as text in
              both. Text colours are the only ones guaranteed to contrast. */}
          <Typography
            className="project-cta"
            variant="codeLike"
            sx={{
              pt: 0.5,
              mt: "auto",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: theme.palette.text.primary,
              transition: "color 0.25s ease, transform 0.25s ease",
            }}
          >
            View case study →
          </Typography>
        </Stack>
      </Box>
    </Link>
  );
};

export default ProjectDisplay;
