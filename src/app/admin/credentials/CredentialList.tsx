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
import { ICredential } from "../../../../data/data.type";

const ITEMS_PER_PAGE = 2;

interface CredentialListProps {
  credentials: (ICredential & { id: string })[];
  startEdit: (credential: ICredential & { id: string }) => void;
  handleDelete: (id: string) => void;
}

const CredentialList = ({
  credentials,
  startEdit,
  handleDelete,
}: CredentialListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and paginated credentials
  const filteredCredentials = useMemo(() => {
    return credentials.filter((credential) => {
      const q = searchQuery.toLowerCase();
      return (
        credential.title.toLowerCase().includes(q) ||
        credential.description.toLowerCase().includes(q)
      );
    });
  }, [credentials, searchQuery]);

  const totalPages = Math.ceil(filteredCredentials.length / ITEMS_PER_PAGE);
  const paginatedCredentials = filteredCredentials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Existing Credentials
      </Typography>

      <TextField
        label="Search Credentials"
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
        {paginatedCredentials.map((credential) => {
          return (
            <Paper
              key={credential.id}
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
                  {credential.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {credential.description}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => startEdit(credential)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(credential.id)}
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

export default CredentialList;
