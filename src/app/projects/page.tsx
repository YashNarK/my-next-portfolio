"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import useProjects from "@/hooks/useProjects";
import { Grid } from "@mui/material";
import ProjectDisplay from "./ProjectDisplay";
import ProjectSkeleton from "./ProjectSkeleton";
import { IProject } from "../../../data/data.type";

/**
 * The card is landscape, so the wide demo screenshot is the right art for it;
 * `potrait` remains the fallback for projects not yet re-captured.
 */
const cardImage = (project: IProject) =>
  typeof project.image === "string" && project.image
    ? project.image
    : typeof project.potrait === "string"
      ? project.potrait
      : "";

const Project = () => {
  const theme = useAppTheme();
  const { data: projectsList, error, isLoading } = useProjects();

  if (error) throw new Error(error);

  return (
    <Grid
      className="projects-main-grid"
      container
      spacing={{ xs: 3, md: 4 }}
      pt={15}
      pb={10}
      sx={{
        // Grid's negative margins sit flush against the viewport without this,
        // so cards ran edge-to-edge on phones.
        px: { xs: 2, sm: 3, md: 4 },
        justifyContent: "center",
        alignItems: "stretch",
        background: "transparent",
        minHeight: "100%",
        // Without a cap the two columns drift to the screen edges on wide
        // monitors and the grid reads as two disconnected lists.
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {isLoading || !projectsList
        ? Array.from({ length: 4 }, (_, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index} display="flex">
              <ProjectSkeleton />
            </Grid>
          ))
        : projectsList.map((project, index) => (
            <Grid
              size={{ xs: 12, md: 6 }}
              key={project.id ?? index}
              display="flex"
              justifyContent="center"
            >
              {/* The card reserves the image box via aspect-ratio, so there is
                  no layout shift to guard against while the shot decodes. */}
              <ProjectDisplay
                bgImageUrl={cardImage(project)}
                theme={theme}
                project={project}
                priority={index < 2}
              />
            </Grid>
          ))}
    </Grid>
  );
};

export default Project;
