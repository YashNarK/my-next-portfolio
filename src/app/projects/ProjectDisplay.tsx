import { Box, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { IProject } from "../../../data/data.type";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
const ProjectDisplay = ({
  bgImageUrl,
  theme,
  project,
}: {
  bgImageUrl: string;
  theme: Theme;
  project: IProject;
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const visibleTechCount = isMobile ? 3 : 6;
  const hiddenCount = project.technologiesUsed.length - visibleTechCount;
  const projectSlug = slugify(project.title);
  return (
    <Link href={`/projects/${projectSlug}`} style={{ textDecoration: "none" }}>
      <Box
        width={300}
        height={450}
        position="relative"
        m={0}
        p={0}
        sx={{
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: 6,
            zIndex: 10,
            cursor: "pointer",
          },
        }}
      >
        {/* Actual Potrait Image of project */}
        <Box
          width={300}
          height={450}
          mx="auto"
          sx={{
            position: "absolute",
            backgroundImage: bgImageUrl,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(1px)",
            zIndex: 3,
          }}
        />
        {/* A paper over the image that provides highlight to the text above */}
        <Box
          width={300}
          height={450}
          mx="auto"
          sx={{
            position: "absolute",
            backgroundColor: theme.palette.text.secondary,
            zIndex: 4,
            opacity: 0.3,
          }}
        />

        {/* The Title and One Liner Box */}
        <Box
          border={2}
          borderColor={theme.palette.text.primary}
          p={2}
          sx={{
            backgroundColor: {
              xs: alpha(theme.palette.background.paper, 0.8),
              md: alpha(theme.palette.background.paper, 0.6),
            },
            position: "relative",
            top: "30%",
            left: "0%",
            zIndex: 5,
            transform: {
              xs: "none", // no transform on small devices
              md: "translate(-50%, -50%)", // apply transform only from md and above
            },
          }}
        >
          <Typography
            variant="codeLike"
            sx={{
              color: theme.palette.text.primary,
              fontSize: "32px",
              textAlign: "center",
              fontWeight: 900,
            }}
          >
            {project.title}
          </Typography>
          <Typography
            variant="handWritten"
            sx={{
              color: theme.palette.text.primary,
              fontSize: "20px",
              textAlign: "end",
              fontWeight: {
                xs: 400,
                md: 900,
              },
              display: "block",
            }}
          >
            {project.oneLiner}
          </Typography>
        </Box>
        {/* Tags for technologies used */}
        <Stack
          direction="row"
          spacing={1}
          gap={1}
          flexWrap="wrap"
          p={2}
          sx={{
            position: "relative",
            top: "30%",
            left: "0%",
            zIndex: 5,
          }}
        >
          {project.technologiesUsed.slice(0, visibleTechCount).map((tech) => (
            <Typography
              key={tech}
              variant="codeLike"
              sx={{
                px: 1,
                py: 0.5,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 1,
                mr: 1,
                my: 1,
                fontWeight: 900,
                fontSize: "0.9rem",
              }}
            >
              {tech}
            </Typography>
          ))}

          {hiddenCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                bgcolor: "grey.600",
                color: "common.white",
                borderRadius: 1,
                mr: 1,
                my: 1,
              }}
            >
              +{hiddenCount}
            </Typography>
          )}
        </Stack>
      </Box>
    </Link>
  );
};

export default ProjectDisplay;
