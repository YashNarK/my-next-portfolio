import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import { useState, useMemo } from "react";
import { IProject } from "../../../../data/data.type";
import { useMediaQuery, useTheme } from "@mui/material";

const ITEMS_PER_PAGE = 2;

interface ProjectListProps {
  projects: (IProject & { id: string })[];
  startEdit: (project: IProject & { id: string }) => void;
  handleDelete: (id: string) => void;
}

const ProjectList = ({
  projects,
  startEdit,
  handleDelete,
}: ProjectListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and paginated projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.technologiesUsed.some((tech) => tech.toLowerCase().includes(q))
      );
    });
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Existing Projects
      </Typography>

      <TextField
        label="Search Projects"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // reset page when searching
        }}
        sx={{ mb: 3 }}
      />

      <Stack spacing={2}>
        {paginatedProjects.map((project) => {
          const visibleTechCount = isMobile ? 3 : 6;
          const hiddenCount =
            project.technologiesUsed.length - visibleTechCount;
          return (
            <Paper
              key={project.id}
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: "background.paper",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.01)",
                  transition: "0.2s",
                },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h6" fontWeight={600}>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.oneLiner}
                </Typography>
                {/* Tags for technologies used */}
                <Stack
                  direction="row"
                  spacing={1}
                  gap={1}
                  flexWrap="wrap"
                  sx={{
                    position: "relative",
                    top: "40%",
                    left: "0%",
                    zIndex: 5,
                  }}
                >
                  {project.technologiesUsed
                    .slice(0, visibleTechCount)
                    .map((tech) => (
                      <Typography
                        key={tech}
                        variant="codeLike"
                        sx={{
                          px: 1,
                          py: 0.5,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          borderRadius: 1,
                          mr: 1,
                          my: 1,
                          fontWeight: 800,
                          fontSize: "0.8rem",
                        }}
                      >
                        {tech}
                      </Typography>
                    ))}

                  {hiddenCount > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: "grey.600",
                        color: "common.white",
                        borderRadius: 1,
                        mr: 1,
                        my: 1,
                      }}
                    >
                      +{hiddenCount}
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => startEdit(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjectList;
