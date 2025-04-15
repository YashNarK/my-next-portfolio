"use client";

import PlayingCard from "@/components/PlayingCard";
import { Box } from "@mui/material";
import { useState } from "react";
import data from "../../../data/data";
import { motion, AnimatePresence } from "framer-motion";
import { useAppTheme } from "@/hooks/useAppTheme";

const Projects = () => {
  const [projects, setProjects] = useState(data.projects);
  const theme = useAppTheme();

  const lightColors = ["#87CEFA", "#DAFDBA", "#F0E68C", "#FFB6C1", "#98FB98"];
  const darkColors = ["#71ABCA", "#1D2B33", "#F50575", "#38444B", "#38444B"];
  const [lightThemeColors, setLightThemeColors] = useState(lightColors);
  const [darkThemeColors, setDarkThemeColors] = useState(darkColors);

  const currentTheme =
    theme.palette.mode === "dark" ? darkThemeColors : lightThemeColors;

  function shuffleArrayItem<T>(inputArray: T[]) {
    const removed = inputArray.shift();
    if (removed !== undefined) inputArray.push(removed);
  }
  const handleSwipe = (index: number, info: any) => {
    if (Math.abs(info.offset.x) > 100 && index === 0) {
      setProjects((prev) => {
        const newList = [...prev];
        shuffleArrayItem(newList);
        return newList;
      });

      setLightThemeColors((prev) => {
        const updated = [...prev];
        shuffleArrayItem(updated);
        return updated;
      });

      setDarkThemeColors((prev) => {
        const updated = [...prev];
        shuffleArrayItem(updated);
        return updated;
      });
    }
  };

  return (
    <Box
      mt={10}
      mb={10}
      position="relative"
      left={20}
      height="500px"
      width="100vw"
    >
      <AnimatePresence>
        {projects.map((project, index) => {
          const isTop = index === 0;
          const offset = index * 10;

          return (
            <motion.div
              key={index}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => handleSwipe(index, info)}
              initial={{ scale: 0.9 + index * 0.02, y: offset, opacity: 0 }}
              animate={{ scale: 1 - index * 0.02, y: offset, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.5, x: 200 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
              }}
              style={{
                position: "absolute",
                left: 0,
                zIndex: projects.length - index,
                width: "265px",
                height: "442px",
                cursor: isTop ? "grab" : "default",
              }}
            >
              <PlayingCard
                index={index}
                project={project}
                numberOfProjects={projects.length}
                cardColor={currentTheme[index]}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Box>
  );
};

export default Projects;
