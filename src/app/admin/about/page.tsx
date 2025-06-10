"use client";

import { useEffect, useRef, useState } from "react";
import { IExperience } from "../../../../data/data.type";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  addExperience,
  deleteExperience,
  getAllExperiences,
  updateExperience,
} from "@/lib/firebase/experiences-crud";
import {
  Paper,
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  InputLabel,
  FormHelperText,
  Button,
  Stack,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExperienceList from "./ExperienceList";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const emptyExperience: IExperience = {
  description: "",
  title: "",
  type: "work",
  isCurrent: true,
  companyOrInstitution: "",
  location: "",
  startDate: "",
  endDate: "",
  order: 0,
  cgpa: undefined,
};

export default function Admin() {
  const [experiences, setExperiences] = useState<
    (IExperience & { id: string })[]
  >([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyExperience);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const potraitInputRef = useRef<HTMLInputElement>(null);
  const theme = useAppTheme();

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    const data = await getAllExperiences();
    setExperiences(data);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(experience: IExperience & { id: string }) {
    setEditingId(experience.id);
    setFormData({ ...experience });
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteExperience(id);
      loadExperiences();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dataToSave = {
      ...formData,
    };

    delete (dataToSave as any).id; // in case id was carried over

    if (editingId) {
      await updateExperience(editingId, dataToSave);
    } else {
      await addExperience(dataToSave);
    }

    setFormData(emptyExperience);
    setEditingId(null);
    imageInputRef.current!.value = "";
    potraitInputRef.current!.value = "";
    await loadExperiences();
  }

  const handleDateChange = (dateValue: Dayjs | null, dateName: string) => {
    const dateString = dateValue?.toISOString() ?? "";
    setFormData((prev) => ({ ...prev, [dateName]: dateString }));
  };
  function handleCheckboxChange(
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) {
    const target = event.target as HTMLInputElement;
    const { name } = target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
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
          Admin CRUD for Experiences
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
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
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={formData.type === "work" ? "Company" : "Institution"}
                name="companyOrInstitution"
                value={formData.companyOrInstitution}
                onChange={handleChange}
                rows={4}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                rows={4}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={(e) => {
                    handleDateChange(e, "startDate");
                  }}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={formData.isCurrent}
                  label="End Date"
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={(e) => {
                    handleDateChange(e, "endDate");
                  }}
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
              <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={
                  (formData.type === "work"
                    ? "Currently Working Here"
                    : "Currently Studying Here") + "?"
                }
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleCheckboxChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingId ? "Update" : "Add"} Experience
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData(emptyExperience);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <ExperienceList
          experiences={experiences}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />
      </Container>
    </Paper>
  );
}
