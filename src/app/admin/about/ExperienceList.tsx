import {
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import { IExperience } from "../../../../data/data.type";

const ITEMS_PER_PAGE = 2;

interface ExperienceListProps {
  experiences: (IExperience & { id: string })[];
  startEdit: (experience: IExperience & { id: string }) => void;
  handleDelete: (id: string) => void;
}

const ExperienceList = ({
  experiences,
  startEdit,
  handleDelete,
}: ExperienceListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and paginated experiences
  const filteredExpereinces = useMemo(() => {
    return experiences.filter((experience) => {
      const q = searchQuery.toLowerCase();
      return (
        experience.title.toLowerCase().includes(q) ||
        experience.description.toLowerCase().includes(q)
      );
    });
  }, [experiences, searchQuery]);

  const totalPages = Math.ceil(filteredExpereinces.length / ITEMS_PER_PAGE);
  const paginatedExperiences = filteredExpereinces.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Existing Experiences
      </Typography>

      <TextField
        label="Search Experiences"
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
        {paginatedExperiences.map((experience) => {
          return (
            <Paper
              key={experience.id}
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
                  {experience.title}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {experience.companyOrInstitution} | {experience.location}
                </Typography>
                <Typography variant="body2">
                  {experience.description}
                </Typography>

                {/* Tags for technologies used */}

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => startEdit(experience)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(experience.id)}
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

export default ExperienceList;
