"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import useProjects from "@/hooks/useProjects";
import { Grid, Skeleton, Stack, Typography } from "@mui/material";
import ProjectDisplay from "./ProjectDisplay";

const Project = () => {
  const theme = useAppTheme();

  const { data: projectsList, error, isLoading } = useProjects();

  if (error) return <div>Error: {error}</div>;

  return (
    <Grid
      container
      spacing={5}
      pt={15}
      pb={10}
      sx={{
        justifyContent: "flex-center",
        alignItems: "center",
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
                <Stack
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                  border={1}
                >
                  <Skeleton variant="rectangular" width={200} height={200} />
                  <Typography variant="handWritten">
                    Cool Projects Loading...
                  </Typography>
                  <Skeleton variant="rounded" width={300} height={20} />
                  <Skeleton variant="rounded" width={300} height={20} />
                  <Skeleton variant="rounded" width={300} height={20} />
                </Stack>
              </Grid>
            ))
        : projectsList.map((project, index) => {
            const potraitUrl = `url(${project.potrait})`;
            return (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
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
