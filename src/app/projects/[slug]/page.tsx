// src/app/projects/[slug]/page.tsx
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { GitHub, ImportantDevices } from "@mui/icons-material";
import { getAllProjects } from "@/lib/firebase/projects-crud";

interface Props {
  params: { slug: string };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const projects = await getAllProjects();
  const project = projects.find((p) => slugify(p.title) === slug);

  if (!project) return notFound();

  return (
    <Box p={5} mt={10} width={"100vw"}>
      <Grid
        container
        direction={"row-reverse"}
        spacing={2}
        alignItems={"center"}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box>
            {typeof project.image === "string" && (
              <img src={project.image} width={"100%"} height={"auto"} />
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box>
            <Box my={2}>
              <Typography variant="codeLike" gutterBottom>
                {project.title}
              </Typography>

              <Typography
                variant="professional"
                fontSize={"1.2rem"}
                mt={2}
                sx={{
                  display: "block",
                }}
              >
                {project.description}
              </Typography>
            </Box>
            <Divider />
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent={"space-evenly"}
              spacing={1}
              my={3}
            >
              <Button
                variant="contained"
                color="secondary"
                LinkComponent={"a"}
                target="_blank"
                href={project.sourceLink}
              >
                <GitHub
                  fontSize="small"
                  sx={{
                    mx: 0.5,
                  }}
                />
                Go to Source
              </Button>
              <Button
                variant="contained"
                color="info"
                LinkComponent={"a"}
                target="_blank"
                href={project.demoLink}
              >
                <ImportantDevices
                  fontSize="small"
                  sx={{
                    mx: 0.5,
                  }}
                />
                Go to Project
              </Button>
            </Stack>
            <Divider />
            <Typography variant="codeLike">Technologies Used</Typography>
            <Stack
              direction={"row"}
              sx={{ flexWrap: "wrap" }}
              gap={3}
              justifyContent={"flex-start"}
              mt={4}
            >
              {project.technologiesUsed.map((tech, index) => (
                <Box key={index}>
                  <Button variant="outlined" color="secondary">
                    <Typography variant="professional">{tech}</Typography>
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
