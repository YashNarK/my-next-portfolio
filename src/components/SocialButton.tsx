"use client";
import { Button } from "@mui/material";
import { ReactNode } from "react";

interface ISocialButtonProps {
  icon: ReactNode;
  text: string;
  color: string;
  backgroundColor: string;
  href: string;
  mode?: "full" | "iconOnly";
}

const SocialButton = ({
  icon,
  text,
  color,
  backgroundColor,
  href,
  mode = "full",
}: ISocialButtonProps) => {
  return (
    <>
      {mode === "full" ? (
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
      ) : (
        <Button
          size="small"
          variant="outlined"
          sx={{
            minWidth: 0,
            color: { color },
            width: 40,
            height: 40,
            p: 0,
            backgroundColor: { backgroundColor },
          }}
          onClick={() => window.open(href, "_blank")}
        >
          {icon}
        </Button>
      )}
    </>
  );
};

export default SocialButton;
