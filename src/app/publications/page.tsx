"use client";

import usePublications from "@/hooks/usePublications";
import { Box, Grid } from "@mui/material";
import PublicationTile from "./PublicationTile";

const Publications = () => {
  const { data: publicationsList, error, isLoading } = usePublications();

  return (
    <Box height={"100%"} px={4}>
      <Grid container mt={10} spacing={3} gap={3}>
        {(publicationsList || []).map((publication, index) => (
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
