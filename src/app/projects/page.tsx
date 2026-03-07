"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import useProjects from "@/hooks/useProjects";
import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ProjectDisplay from "./ProjectDisplay";
import ProjectSkeleton from "./ProjectSkeleton";

const Project = () => {
  const theme = useAppTheme();

  const { data: projectsList, error, isLoading } = useProjects();
  const [loadedPortraits, setLoadedPortraits] = useState<
    Record<string, boolean>
  >({});

  const projectLoadKeys = useMemo(
    () =>
      projectsList?.map((project, index) => {
        const imageUrl =
          typeof project.potrait === "string" ? project.potrait : "";
        return `${index}-${project.title}-${imageUrl}`;
      }) ?? [],
    [projectsList],
  );

  useEffect(() => {
    if (!projectsList) {
      setLoadedPortraits({});
      return;
    }

    let isActive = true;
    const preloads: HTMLImageElement[] = [];

    setLoadedPortraits({});

    projectsList.forEach((project, index) => {
      const imageUrl =
        typeof project.potrait === "string" ? project.potrait : "";
      const key = `${index}-${project.title}-${imageUrl}`;

      if (!imageUrl) {
        setLoadedPortraits((prev) => ({ ...prev, [key]: true }));
        return;
      }

      const preload = new window.Image();
      preloads.push(preload);

      const markLoaded = () => {
        if (!isActive) return;
        setLoadedPortraits((prev) => {
          if (prev[key]) return prev;
          return { ...prev, [key]: true };
        });
      };

      preload.src = imageUrl;

      if (preload.complete) {
        markLoaded();
      } else {
        preload.onload = markLoaded;
        preload.onerror = markLoaded;
      }
    });

    return () => {
      isActive = false;
      preloads.forEach((preload) => {
        preload.onload = null;
        preload.onerror = null;
      });
    };
  }, [projectsList]);

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
            const imageUrl =
              typeof project.potrait === "string" ? project.potrait : "";
            const loadKey = `${index}-${project.title}-${imageUrl}`;
            const isPortraitLoaded = loadedPortraits[loadKey] ?? false;
            const potraitUrl = imageUrl ? `url(${imageUrl})` : "none";
            return (
              <Grid
                size={{ xs: 12, md: 6 }}
                key={projectLoadKeys[index] ?? index}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {isPortraitLoaded ? (
                  <ProjectDisplay
                    bgImageUrl={potraitUrl}
                    theme={theme}
                    project={project}
                  />
                ) : (
                  <ProjectSkeleton />
                )}
              </Grid>
            );
          })}
    </Grid>
  );
};

export default Project;
