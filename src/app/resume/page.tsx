"use client";

import { useResumeConfig } from "@/hooks/useResumeConfig";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ResumeRedirectPage() {
  const { resumeConfig, isLoading } = useResumeConfig();

  useEffect(() => {
    if (!isLoading && resumeConfig) {
      const url = resumeConfig.urls[resumeConfig.activeIndex];
      if (url) {
        window.open(url, "_blank");
      }
    }
  }, [resumeConfig, isLoading]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={2}
    >
      {isLoading ? (
        <>
          <CircularProgress />
          <Typography variant="body1">Opening resume…</Typography>
        </>
      ) : (
        <Typography variant="body1" color="text.secondary">
          {resumeConfig?.urls[resumeConfig.activeIndex]
            ? "Resume opened in a new tab."
            : "No resume URL configured yet."}
        </Typography>
      )}
    </Box>
  );
}
