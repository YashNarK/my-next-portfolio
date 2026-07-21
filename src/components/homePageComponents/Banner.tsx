"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Box, Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useEffect, useState, useMemo } from "react";
import CodeLikeTypography from "./CodeLikeTypography";
import ImageIntro from "./ImageIntro";
import InfinityTypingText from "./InfinityTypingText";
import SkillMatrix from "./SkillMatrix";
import { calculateExperience } from "@/utils/dateFunctions";
import { useResumeConfig } from "@/hooks/useResumeConfig";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ForestEffect from "./ForestEffect";

type variantType =
  | "playful"
  | "handWritten"
  | "caligraphy"
  | "codeLike"
  | "professional";

const Banner = () => {
  const theme = useAppTheme();
  const { resumeConfig } = useResumeConfig();
  const resumeUrl = resumeConfig?.urls?.[resumeConfig.activeIndex];
  const textColor = theme.palette.text.primary;
  const [nameVariant, setNameVariant] = useState<variantType>("codeLike");
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const variantList = useMemo<variantType[]>(
    () => ["playful", "professional", "handWritten", "caligraphy", "codeLike"],
    [],
  );
  useEffect(() => {
    const nextVariant = async () => {
      await setTimeout(() => {
        setVariantIndex((prev) => (prev + 1) % variantList.length);
        setNameVariant(variantList[variantIndex as number]);
      }, 3000);
    };
    nextVariant();
  }, [variantIndex, nameVariant, variantList]);

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
        pt: 10,
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
        <CodeLikeTypography noRuler>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Keep the greeting a step below the name at every width:
                name is 1.5rem (xs) / 2.5rem (sm+). */}
            <ForestEffect text="Hello, I'm" color={textColor} fontSize="clamp(1.1rem, 4vw, 2rem)" />
            <Typography
              variant={nameVariant}
              color={textColor}
              sx={{
                fontSize: { xs: "1.5rem", sm: "2.5rem" },
                fontWeight: "bold",
                ml: 1,
              }}
            >
              Narendran
            </Typography>
          </span>
        </CodeLikeTypography>

        <CodeLikeTypography noRuler>
          I am a <InfinityTypingText />
        </CodeLikeTypography>

        <Typography
          variant="professional"
          sx={{
            display: "block",
            mt: 1,
            opacity: 0.75,
            fontSize: { xs: "0.85rem", sm: "1rem" },
            lineHeight: 1.6,
          }}
        >
          {calculateExperience()} building microservices, event-driven systems
          &amp; multi-frontend architectures.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 2.5, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            startIcon={<DownloadOutlinedIcon />}
            disabled={!resumeUrl}
            onClick={() =>
              resumeUrl &&
              window.open(resumeUrl, "_blank", "noopener,noreferrer")
            }
            sx={{ textTransform: "none", borderRadius: "999px", px: 2.5 }}
          >
            Download Résumé
          </Button>
          <Button
            variant="outlined"
            startIcon={<MailOutlineIcon />}
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              px: 2.5,
              color: "text.primary",
              borderColor: "text.primary",
              "&:hover": {
                borderColor: "text.primary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Get in touch
          </Button>
        </Stack>

        <SkillMatrix />
      </Box>
    </Stack>
  );
};

export default Banner;
