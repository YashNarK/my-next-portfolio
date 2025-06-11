"use client";

import usePublications from "@/hooks/usePublications";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import PublicationTile from "./PublicationTile";
import PublicationTileSkeleton from "./PublicationTileSkeleton";

const Publications = () => {
  const { data: publicationsList, error, isLoading } = usePublications();

  return (
    <Box minHeight={"100%"} px={4}>
      <Grid container mt={10} spacing={3} gap={3}>
        {isLoading
          ? [0, 1, 2, 3].map((_, index) => (
              <PublicationTileSkeleton key={index} />
            ))
          : (publicationsList || []).map((publication, index) => (
              <Grid
                size={{ xs: 12, sm: 6 }}
                key={index}
                border={"2px solid gray"}
                borderRadius={"10px"}
              >
                <PublicationTile publication={publication} />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default Publications;
