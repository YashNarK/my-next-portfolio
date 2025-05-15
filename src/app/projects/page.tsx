"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Grid } from "@mui/material";
import ProjectDisplay from "./ProjectDisplay";
import data from "../../../data/data";

const Project = () => {
  const theme = useAppTheme();
  const projectsList = data.projects;
  return (
    <Grid
      container
      spacing={2}
      pt={15}
      pb={10}
      sx={{
        justifyContent: "flex-center",
        alignItems: "center",
      }}
    >
      {projectsList.map((project, index) => {
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
