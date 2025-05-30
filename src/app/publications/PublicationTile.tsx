"use client";
import localeDate from "@/utils/localeDate";
import { useTheme } from "@emotion/react";
import {
  Card,
  Box,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import { useState, useRef } from "react";
import { IPublication } from "../../../data/data.type";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
type PublicationTileProps = { publication: IPublication };

const PublicationTile = ({ publication }: PublicationTileProps) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<Boolean>(false);

  const fullDescription = publication.description;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl =
    typeof publication.audio === "string" ? publication.audio : "";
  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying((prev) => {
      !prev ? audio.play() : audio.pause();
      return !prev;
    });
  };
  return (
    <Card
      sx={{
        display: "flex",
        background: "transparent",
        width: "100%",
        minheight: "11cm",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="codeLike" sx={{ fontSize: "1.8rem" }}>
            {publication.title}
          </Typography>
          <Box>
            <Typography variant="professional">
              {isDescriptionExpanded
                ? fullDescription
                : fullDescription.slice(0, 350)}
            </Typography>
            {fullDescription.length > 350 && (
              <Typography
                component={"div"}
                color="success"
                onClick={() => {
                  setIsDescriptionExpanded((prev) => !prev);
                }}
                variant="professional"
                sx={{
                  display: "inline",
                  cursor: "pointer",
                }}
              >
                {isDescriptionExpanded ? " ^ see less" : "... See more"}
              </Typography>
            )}
          </Box>
          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play/Pause Button */}

          <Stack
            justifyContent={"center"}
            direction={"column"}
            alignItems={"center"}
          >
            <Box
              sx={{
                display: "flex",
                direction: {
                  xs: "column",
                  sm: "row",
                },
                width: "100%",
                border: "1px solid gray",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                gap: 3,
                my: 2,
                p: 1,
              }}
            >
              <Typography variant="handWritten" sx={{ fontSize: "2rem" }}>
                Listen to the blog
              </Typography>
              <IconButton aria-label="play/pause" onClick={handleTogglePlay}>
                <Box
                  sx={{
                    height: 60,
                    width: 60,
                    border: "3px solid gray",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.8)",
                    },
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </Box>
              </IconButton>
            </Box>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Box>
                <Typography variant="professional">
                  Published on: {localeDate(publication.date)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="professional">
                  Publisher: {publication.publisher}
                </Typography>
              </Box>
            </Stack>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              p={3}
              width={"100%"}
            >
              <Button
                sx={{
                  width: "100%",
                }}
                variant="outlined"
                color="secondary"
                LinkComponent={"a"}
                href={publication.link}
                target="_blank"
              >
                Click to open blog
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};
export default PublicationTile;
