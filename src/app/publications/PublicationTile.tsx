"use client";
import formatTime from "@/utils/formatTime";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { IPublication } from "../../../data/data.type";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppTheme } from "@/hooks/useAppTheme";
import { localeDate } from "@/utils/dateFunctions";
type PublicationTileProps = { publication: IPublication };

const PublicationTile = ({ publication }: PublicationTileProps) => {
  const theme = useAppTheme();
  const [isPlaying, setIsPlaying] = useState<Boolean>(false);
  const [progress, setProgress] = useState(0); // 0 to 100

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
  const handleRestartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset time
      audioRef.current.pause(); // Optional: play immediately
      setIsPlaying(false); // Reset playing state
    }
  };

  // Update progress bar while audio is playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);
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
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              minHeight: "3cm",
              p: 2,
            }}
          >
            <Typography variant="codeLike" sx={{ fontSize: "1.8rem" }}>
              {publication.title}
            </Typography>
          </Box>
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
                flexDirection: {
                  xs: "column", // stacked on mobile
                  sm: "row", // side-by-side on larger screens
                },
                width: "100%",
                border: "1px solid gray",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                gap: 3,
                my: 2,
                p: 1,
                flexWrap: "wrap", // ensures new lines if needed
              }}
            >
              <Typography variant="handWritten" sx={{ fontSize: "2rem" }}>
                Listen to the blog
              </Typography>
              <Box className="play-pause-restart-button-group">
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
                <IconButton aria-label="restart" onClick={handleRestartAudio}>
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
                    {<RestartAltIcon />}
                  </Box>
                </IconButton>
              </Box>
              {Boolean(audioRef.current?.currentTime) && (
                <Box width="100%" className="progress-bar">
                  <Typography>
                    {formatTime(audioRef.current?.currentTime || 0)} /{" "}
                    {formatTime(audioRef.current?.duration || 0)}
                  </Typography>
                  <input
                    style={{ width: "100%" }}
                    type="range"
                    value={progress}
                    onChange={(e) => {
                      const percent = Number(e.target.value);
                      setProgress(percent);

                      const audio = audioRef.current;
                      if (audio && audio.duration) {
                        audio.currentTime = (percent / 100) * audio.duration;
                      }
                    }}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </Box>
              )}
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
                size="large"
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
