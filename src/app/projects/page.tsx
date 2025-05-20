"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import useProjects from "@/hooks/useProjects";
import { Grid, Skeleton, Stack, Typography } from "@mui/material";
import ProjectDisplay from "./ProjectDisplay";
import ProjectSkeleton from "./ProjectSkeleton";

const Project = () => {
  const theme = useAppTheme();

  const { data: projectsList, error, isLoading } = useProjects();

  if (error) throw new Error(error);

  return (
    <Grid
      className="projects-main-grid"
      container
      spacing={5}
      pt={15}
      pb={10}
      sx={{
        justifyContent: "flex-center",
        alignItems: "center",
        background: "transparent",
      }}
    >
      {isLoading || !projectsList
        ? Array(6)
            .fill(true)
            .map((_, index) => (
              <Grid
                size={{ xs: 12, md: 6 }}
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <ProjectSkeleton />
              </Grid>
            ))
        : projectsList.map((project, index) => {
            const potraitUrl = `url(${project.potrait})`;
            return (
              <Grid
                size={{ xs: 12, md: 6 }}
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <ProjectDisplay
                  bgImageUrl={potraitUrl}
                  theme={theme}
                  project={project}
                />
              </Grid>
            );
          })}
    </Grid>
  );
};

export default Project;
