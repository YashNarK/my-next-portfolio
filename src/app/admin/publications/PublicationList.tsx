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
import { IPublication } from "../../../../data/data.type";
import { useMediaQuery, useTheme } from "@mui/material";
import { localeDate } from "@/utils/dateFunctions";

const ITEMS_PER_PAGE = 2;

interface PublicationListProps {
  publications: (IPublication & { id: string })[];
  startEdit: (publication: IPublication & { id: string }) => void;
  handleDelete: (id: string) => void;
}

const PublicationList = ({
  publications,
  startEdit,
  handleDelete,
}: PublicationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and paginated publications
  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      const q = searchQuery.toLowerCase();
      return (
        publication.title.toLowerCase().includes(q) ||
        publication.description.toLowerCase().includes(q)
      );
    });
  }, [publications, searchQuery]);

  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Existing Publications
      </Typography>

      <TextField
        label="Search Publications"
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
        {paginatedPublications.map((publication) => {
          return (
            <Paper
              key={publication.id}
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
                  {publication.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {publication.description}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  sx={{ border: "1px solid gray" }}
                  p={2}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    {publication.publisher}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {localeDate(publication.date)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => startEdit(publication)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(publication.id)}
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

export default PublicationList;
