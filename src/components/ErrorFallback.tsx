// components/ErrorFallback.tsx
"use client";

import { Box, Button, Typography } from "@mui/material";
import { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <Box
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h6" color="error">
        Something went wrong:
      </Typography>
      <Typography color="error">{error.message}</Typography>
      <Button variant="outlined" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </Box>
  );
}
