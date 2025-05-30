"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  addPublication,
  deletePublciation,
  getAllPublications,
  updatePublication,
} from "@/lib/firebase/firestore-crud";
import {
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { IPublication } from "../../../../data/data.type";
import PublicationList from "./PublicationList";
import dayjs, { Dayjs } from "dayjs";

const emptyPublication: IPublication = {
  title: "",
  description: "",
  date: "",
  link: "",
  publisher: "",
};

export default function Admin() {
  const [publications, setPublications] = useState<
    (IPublication & { id: string })[]
  >([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyPublication);

  const theme = useAppTheme();

  useEffect(() => {
    loadPublications();
  }, []);

  async function loadPublications() {
    const data = await getAllPublications();
    setPublications(data);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  const handleDateChange = (dateValue: Dayjs | null) => {
    const dateString = dateValue?.toISOString() ?? "";
    setFormData((prev) => ({ ...prev, date: dateString }));
  };

  function startEdit(publication: IPublication & { id: string }) {
    setEditingId(publication.id);
    setFormData({ ...publication });
    console.log(publication.date);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deletePublciation(id);
      loadPublications();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dataToSave = {
      ...formData,
    };

    delete (dataToSave as any).id; // in case id was carried over

    if (editingId) {
      await updatePublication(editingId, dataToSave);
    } else {
      await addPublication(dataToSave);
    }

    setFormData(emptyPublication);
    setEditingId(null);
    await loadPublications();
  }

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: 4,
        maxWidth: 800,
        margin: "auto",
      }}
    >
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" gutterBottom>
          Admin CRUD for Publications
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Publication Link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Published Date"
                  value={formData.date ? dayjs(formData.date) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingId ? "Update" : "Add"} Publication
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData(emptyPublication);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <PublicationList
          publications={publications}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />
      </Container>
    </Paper>
  );
}
