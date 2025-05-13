"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  const currentYear: number = new Date().getFullYear();
  const theme = useAppTheme();

  return (
    <Box
      justifyContent="center"
      textAlign="center"
      fontSize="lg"
      mx="auto"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        padding: "20px",
        boxShadow: `0 4px 8px ${theme.palette.text.secondary}`,
      }}
    >
      <Typography variant="professional">
        © {currentYear} YashNarK. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
