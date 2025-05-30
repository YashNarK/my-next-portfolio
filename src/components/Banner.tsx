"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppSelector } from "@/hooks/useReduxCustom";
import {
  bounceUp,
  mirrorAndRevert,
  pulseSpin,
  rotate,
  slideRightToLeft,
  zoomOutFade,
} from "@/lib/animation";
import {
  Box,
  Theme,
  Typography,
  TypographyPropsVariantOverrides,
  TypographyVariant,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { ResponsiveStyleValue } from "@mui/system";
import { OverridableStringUnion } from "@mui/types";
import { Property } from "csstype";
import { ReactNode, useEffect, useState } from "react";
import ImageIntro from "./ImageIntro";
import InfinityTypingText from "./InfinityTypingText";
import { SvgImage } from "./SvgImage";

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
        fontSize: { xs: "1.1rem", sm: "1.5rem" },
      }}
    >
      {children}
      {!noRuler && <hr />}
    </Typography>
  );
};
type variantType =
  | "playful"
  | "handWritten"
  | "caligraphy"
  | "codeLike"
  | "professional";
const Banner = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  const { textColor } = getTheme();
  const [nameVariant, setNameVariant] = useState<variantType>("codeLike");
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const variantList: variantType[] = [
    "playful",
    "professional",
    "handWritten",
    "caligraphy",
    "codeLike",
  ];
  useEffect(() => {
    const nextVariant = async () => {
      await setTimeout(() => {
        setVariantIndex((prev) => (prev + 1) % variantList.length);
        setNameVariant(variantList[variantIndex as number]);
      }, 3000);
    };
    nextVariant();
  }, [variantIndex, nameVariant]);
  return (
    <Stack
      className="banner-intro-area"
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      height={"100%"}
      sx={{
        overflow: "hidden",
        m: 0,
        py: 10,
        px: 2,
        background: "transparent",
      }}
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
            variant={nameVariant}
            color={textColor}
            sx={{
              fontSize: { xs: "1.5rem", sm: "2.5rem" },
              fontWeight: "bold",
            }}
          >
            Narendran
          </Typography>
        </CodeLikeTypography>
        <CodeLikeTypography>
          I am a <InfinityTypingText />
        </CodeLikeTypography>
        <CodeLikeTypography>Tools of My Trade:</CodeLikeTypography>
        <CodeLikeTypography>
          <SvgImage
            src={"/svg/react" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="React"
            animation={rotate}
          />
          1. React JS
          <Typography variant="handWritten"> (With TypeScript)</Typography>
        </CodeLikeTypography>
        <CodeLikeTypography>
          <SvgImage
            src={"/svg/express" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="Express"
            animation={slideRightToLeft}
          />
          2. Express JS
        </CodeLikeTypography>
        <CodeLikeTypography>
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

        <CodeLikeTypography>
          <SvgImage
            src={"/svg/nextjs" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="NextJS"
            animation={mirrorAndRevert}
          />
          4. Next JS
        </CodeLikeTypography>
        <CodeLikeTypography>
          <SvgImage
            src={"/svg/redux" + (mode === "dark" ? "-dark" : "") + ".svg"}
            alt="Redux"
            animation={pulseSpin}
          />
          5. Redux{" "}
          <Typography variant="handWritten"> (react-redux toolkit)</Typography>
        </CodeLikeTypography>
        <CodeLikeTypography>
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
