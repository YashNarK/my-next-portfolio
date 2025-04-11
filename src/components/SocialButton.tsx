"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button, Palette } from "@mui/material";
import { ReactNode } from "react";

interface ISocialButtonProps {
  icon: ReactNode;
  text: string;
  href: string;
  mode?: "full" | "iconOnly";
  themeSelector: keyof Palette["social"];
}

const SocialButton = ({
  icon,
  text,
  href,
  mode = "full",
  themeSelector,
}: ISocialButtonProps) => {
  const theme = useAppTheme();
  return (
    <>
      {mode === "full" ? (
        <Button
          variant="outlined"
          startIcon={icon}
          onClick={() => window.open(href, "_blank")}
          sx={{
            width: "100%",
            color: theme.palette.social[themeSelector].color,
            backgroundColor:
              theme.palette.social[themeSelector].backgroundColor,
          }}
        >
          {text}
        </Button>
      ) : (
        <Button
          size="small"
          sx={{
            minWidth: 0,
            color: theme.palette.social[themeSelector].iconColor,
            width: 40,
            height: 40,
            p: 0,
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
