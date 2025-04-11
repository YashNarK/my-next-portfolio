"use client";
import { Button } from "@mui/material";
import { ReactNode } from "react";

interface ISocialButtonProps {
  icon: ReactNode;
  text: string;
  color: string;
  backgroundColor: string;
  href: string;
}

const SocialButton = ({
  icon,
  text,
  color,
  backgroundColor,
  href,
}: ISocialButtonProps) => {
  return (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={() => window.open(href, "_blank")}
      sx={{
        width: "100%",
        color: { color },
        backgroundColor: { backgroundColor },
      }}
    >
      {text}
    </Button>
  );
};

export default SocialButton;
