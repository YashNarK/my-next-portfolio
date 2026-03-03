"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import useProjects from "@/hooks/useProjects";
import { Grid } from "@mui/material";
import Image from "next/image";
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
        minHeight: "100%",
      }}
    >
      {/* Hidden preload images — kick off Firebase Storage downloads immediately */}
      {projectsList?.map((project) =>
        project.potrait ? (
          <Image
            key={project.title}
            src={project.potrait as string}
            alt=""
            width={1}
            height={1}
            unoptimized
            priority
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          />
        ) : null
      )}

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
