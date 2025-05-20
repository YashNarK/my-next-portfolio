import { Skeleton, Stack, Typography } from "@mui/material";
import React from "react";

const ProjectSkeleton = () => {
  return (
    <Stack
      spacing={1}
      justifyContent="center"
      alignItems="center"
      border={1}
      p={2}
    >
      <Skeleton variant="rectangular" width={200} height={200} />
      <Typography variant="handWritten">Cool Projects Loading...</Typography>
      <Skeleton variant="rounded" width={300} height={20} />
      <Skeleton variant="rounded" width={300} height={20} />
      <Skeleton variant="rounded" width={300} height={20} />
    </Stack>
  );
};

export default ProjectSkeleton;
