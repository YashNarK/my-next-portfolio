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
import { SvgImage } from "./SvgImage";
import {
  bounceUp,
  mirrorAndRevert,
  pulseSpin,
  rotate,
  slideRightToLeft,
  zoomOutFade,
} from "@/lib/animation";
import { useAppSelector } from "@/hooks/useReduxCustom";

const getTheme = () => {
  const theme = useAppTheme();
  const textColor = theme.palette.text.primary;
  const paperColor = theme.palette.background.paper;
  const backgroundColor = theme.palette.background.default;
  const holeColor = theme.palette.secondary.main;
  const defaultColor = theme.palette.background.default;
  return {
    theme,
    textColor,
    paperColor,
    backgroundColor,
    holeColor,
    defaultColor,
  };
};

type codePropsType = {
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
}: codePropsType) => {
  const { textColor } = getTheme();
  return (
    <Typography
      variant={variant}
      sx={{
        display: display,
        color: textColor,
        fontSize: { xs: "1.2rem", sm: "1.8rem" },
      }}
    >
      {addTab && <>&nbsp;&nbsp;&nbsp;&nbsp;</>}
      {children}
      {!noRuler && <hr />}
    </Typography>
  );
};

const Banner = () => {
  const mode = useAppSelector((state) => state.theme.mode);
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
        <CodeLikeTypography>
          Hello, I'm{" "}
          <Typography
            variant="playful"
            sx={{
              fontSize: { xs: "2rem", sm: "3rem" },
            }}
          >
            Narendran
          </Typography>
        </CodeLikeTypography>
        <CodeLikeTypography>
          I am a <InfinityTypingText />
        </CodeLikeTypography>
        <CodeLikeTypography>Tools of My Trade:</CodeLikeTypography>
        <CodeLikeTypography addTab={true}>
          <SvgImage
            src={"/svg/react" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="React"
            animation={rotate}
          />
          1. React JS
          <Typography variant="handWritten"> (With TypeScript)</Typography>
        </CodeLikeTypography>
        <CodeLikeTypography addTab={true}>
          <SvgImage
            src={"/svg/express" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="Express"
            animation={slideRightToLeft}
          />
          2. Express JS
        </CodeLikeTypography>
        <CodeLikeTypography addTab={true}>
          <SvgImage
            src={"/svg/typescript" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="TypeScript"
            animation={zoomOutFade}
          />
          3.{" "}
          <Typography
            variant="handWritten"
            sx={{
              textDecoration: "line-through",
              textDecorationColor: "red",
              textDecorationThickness: "4px",
            }}
          >
            JavaScript{" "}
          </Typography>
          TypeScript
        </CodeLikeTypography>

        <CodeLikeTypography addTab={true}>
          <SvgImage
            src={"/svg/nextjs" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="NextJS"
            animation={mirrorAndRevert}
          />
          4. Next JS
        </CodeLikeTypography>
        <CodeLikeTypography addTab={true}>
          <SvgImage
            src={"/svg/redux" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="Redux"
            animation={pulseSpin}
          />
          5. Redux{" "}
          <Typography variant="handWritten"> (react-redux toolkit)</Typography>
        </CodeLikeTypography>
        <CodeLikeTypography addTab={true}>
          <SvgImage
            src={"/svg/bitcoin" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="Bitcoin"
            animation={bounceUp}
          />
          6. Blockchain
        </CodeLikeTypography>
      </Box>
    </Stack>
  );
};

export default Banner;
