// components/ErrorFallback.tsx
"use client";

import { alpha, Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const router = useRouter();
  return (
    <Box
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      sx={{
        backgroundImage: "url('/img/Error.jpeg')",
      }}
    >
      <Box border={1} borderRadius={2} bgcolor={alpha("#808080", 0.5)} p={4}>
        <Typography
          variant="h6"
          color="textPrimary"
          fontWeight={900}
          fontSize={20}
        >
          Something went wrong:
        </Typography>
        <Typography color="textPrimary" fontWeight={900} fontSize={20}>
          {error.message}
        </Typography>
      </Box>
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          color="primary"
        >
          Try Again
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            resetErrorBoundary();
            router.push("/");
          }}
        >
          Go Back to Home
        </Button>
      </Box>
    </Box>
  );
}
