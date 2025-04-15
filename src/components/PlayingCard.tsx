"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Box, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import { IProject } from "../../data/data.type";
type playingCardProps = {
  index: number;
  project: IProject;
  numberOfProjects: number;
  cardColor: string;
};
const PlayingCard = ({
  index,
  project,
  numberOfProjects,
  cardColor,
}: playingCardProps) => {
  const theme = useAppTheme();
  return (
    <Card
      style={{
        width: "265px",
        height: "442px",
        borderRadius: "20px",
        backgroundColor: cardColor,
        backgroundImage: `url('/img/card.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        position: "absolute",
        zIndex: numberOfProjects - index,
        left: index * 20,
        top: index * 20,
      }}
    >
      <Box position={"absolute"} top={"20%"} left={10}>
        <CardMedia
          sx={{ height: 140, width: 140, mx: "auto" }}
          image={project.logo}
          title={project.title}
        />
        <CardContent
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="professional">{project.title}</Typography>
          <Stack direction={"row"} flexWrap={"wrap"} justifyContent={"center"}>
            {/* First Three Techs will be shown */}
            {project.technologiesUsed.map(
              (technology, index) =>
                index < 3 && (
                  <Typography
                    key={index}
                    variant="professional"
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: "5px",
                      padding: "2px 5px",
                      margin: "2px",
                    }}
                  >
                    {technology}
                  </Typography>
                )
            )}
            {project.technologiesUsed.length > 3 && (
              <Typography
                key={index}
                variant="professional"
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "5px",
                  padding: "2px 5px",
                  margin: "2px",
                }}
              >
                +{project.technologiesUsed.length - 3}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PlayingCard;
