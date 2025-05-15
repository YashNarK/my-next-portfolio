"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { getAllProjects } from "@/lib/firebase/firestore-crud";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { IProject } from "../../../data/data.type";
import ProjectDisplay from "./ProjectDisplay";

const Project = () => {
  const theme = useAppTheme();
  const [projectsList, setProjectsList] = useState<
    (IProject & {
      id: string;
    })[]
  >([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await getAllProjects();
      setProjectsList(res);
    };

    fetchProjects();
  }, []);

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
