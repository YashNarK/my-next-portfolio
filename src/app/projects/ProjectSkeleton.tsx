import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

/** Placeholder shaped like ProjectDisplay so the grid does not jump on load. */
const ProjectSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 560,
        borderRadius: 2,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", aspectRatio: "7 / 3", height: "auto" }}
      />
      <Stack spacing={1.5} sx={{ p: 2.5 }}>
        <Skeleton variant="rounded" width="55%" height={26} />
        <Skeleton variant="rounded" width="100%" height={18} />
        <Skeleton variant="rounded" width="80%" height={18} />
        <Stack direction="row" gap={0.75} sx={{ pt: 0.5 }}>
          {[64, 52, 72, 48].map((w) => (
            <Skeleton key={w} variant="rounded" width={w} height={22} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProjectSkeleton;
