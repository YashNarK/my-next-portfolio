import { Box, Theme, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { IProject } from "../../../data/data.type";
const ProjectDisplay = ({
  bgImageUrl,
  theme,
  project,
}: {
  bgImageUrl: string;
  theme: Theme;
  project: IProject;
}) => {
  return (
    <Box
      width={300}
      height={450}
      position="relative"
      m={0}
      p={0}
      sx={{
        left: "50%",
        transform: "translate(-50%, 0%)",
      }}
    >
      {/* Actual Potrait Image of project */}
      <Box
        width={300}
        height={450}
        mx="auto"
        sx={{
          position: "absolute",
          backgroundImage: bgImageUrl,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
          zIndex: 3,
        }}
      />
      {/* A paper over the image that provides highlight to the text above */}
      <Box
        width={300}
        height={450}
        mx="auto"
        sx={{
          position: "absolute",
          backgroundColor: theme.palette.background.paper,
          zIndex: 4,
          opacity: 0.1,
        }}
      />

      <Box
        border={2}
        borderColor={theme.palette.text.primary}
        sx={{
          backgroundColor: {
            xs: alpha(theme.palette.background.paper, 0.8),
            md: alpha(theme.palette.background.paper, 0.6),
          },
          position: "absolute",
          top: "50%",
          left: "0%",
          zIndex: 5,
          transform: {
            xs: "none", // no transform on small devices
            md: "translate(-50%, -50%)", // apply transform only from md and above
          },
        }}
      >
        <Typography
          variant="codeLike"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "32px",
            textAlign: "center",
            fontWeight: 900,
          }}
        >
          {project.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectDisplay;
