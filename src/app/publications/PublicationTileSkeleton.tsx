import { Grid, Box, Typography, Skeleton } from "@mui/material";
import React from "react";

const PublicationTileSkeleton = () => {
  return (
    <Grid
      size={{ xs: 12, sm: 6 }}
      border={"2px solid gray"}
      borderRadius={"10px"}
    >
      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      <Box
        display="flex"
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Skeleton
          variant="circular"
          width={60}
          height={60}
          sx={{ display: "inline-block", mx: 4 }}
        />
        <Typography
          variant="handWritten"
          sx={{ display: "inline", fontSize: "2rem" }}
        >
          Loading Publications...
        </Typography>
      </Box>
      <Skeleton variant="rectangular" height={60} sx={{ my: 3 }} />
      <Skeleton variant="rounded" height={60} />
    </Grid>
  );
};

export default PublicationTileSkeleton;
