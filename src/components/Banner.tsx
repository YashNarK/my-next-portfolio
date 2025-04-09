"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import {
  Box,
  Theme,
  Typography,
  TypographyPropsVariantOverrides,
  TypographyVariant,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import React, { ReactNode } from "react";
import ImageIntro from "./ImageIntro";
import InfinityTypingText from "./InfinityTypingText";
import { OverridableStringUnion } from "@mui/types";
import { ResponsiveStyleValue } from "@mui/system";
import { Property } from "csstype";
type propsType = {
  children: ReactNode;
  addTab?: boolean;
  noRuler?: boolean;
  variant?: OverridableStringUnion<
    TypographyVariant | "inherit",
    TypographyPropsVariantOverrides
  >;
  display?:
    | ResponsiveStyleValue<Property.Display | readonly string[] | undefined>
    | ((
        theme: Theme
      ) => ResponsiveStyleValue<
        Property.Display | readonly string[] | undefined
      >)
    | null;
};

const CodeLikeTypography = ({
  children,
  addTab,
  noRuler,
  variant = "codeLike",
  display = "block",
}: propsType) => {
  const theme = useAppTheme();
  const textColor = theme.palette.text.primary;
  return (
    <Typography
      variant={variant}
      sx={{
        display: { display },
        color: textColor,
        fontSize: { xs: "1.2rem", sm: "1.8rem" },
      }}
    >
      {addTab && (
        <>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      {children}
      {!noRuler && <hr />}
    </Typography>
  );
};

const Banner = () => {
  return (
    <Stack
      justifyContent={"center"}
      gap={2}
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ padding: 2 }}
    >
      <ImageIntro />
      <Box
        className="banner-intro-text-area"
        sx={{
          width: { xs: "100%", sm: "60%" },
        }}
      >
        <CodeLikeTypography>Hello, I'm Narendran</CodeLikeTypography>{" "}
        <CodeLikeTypography>
          I am a <InfinityTypingText />
        </CodeLikeTypography>
        <CodeLikeTypography>Tools of My Trade:</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>1. React JS</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>2. Express JS</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>3. TypeScript</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>4. Next JS</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>5. Redux</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>6. Blockchain</CodeLikeTypography>
      </Box>
    </Stack>
  );
};

export default Banner;
