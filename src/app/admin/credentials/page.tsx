"use client";

import { useEffect, useRef, useState } from "react";
import { ICredential } from "../../../../data/data.type";
import { uploadImage } from "@/lib/firebase/uploadFiles";
import {
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
  Paper,
} from "@mui/material";
import Link from "next/link";
import { useAppTheme } from "@/hooks/useAppTheme";
import CredentialList from "./CredentialList";

import {
  addCredential,
  deleteCredential,
  getAllCredentials,
  updateCredential,
} from "@/lib/firebase/credentials-crud";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const emptyCredential: ICredential = {
  title: "",
  description: "",
  image: "",
  link: "",
  issuedDate: "",
  issuedBy: "",
  credentialID: "",
};

export default function Admin() {
  const [credentials, setCredentials] = useState<
    (ICredential & { id: string })[]
  >([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyCredential);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const theme = useAppTheme();

  useEffect(() => {
    loadCredentials();
  }, []);

  async function loadCredentials() {
    const data = await getAllCredentials();
    setCredentials(data);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(project: ICredential & { id: string }) {
    setEditingId(project.id);
    setFormData({ ...project });
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteCredential(id);
      loadCredentials();
    }
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageURL = "";

    if (formData.image instanceof File) {
      imageURL = await uploadImage(
        formData.image,
        `${formData.title}/cred-image`
      );
    } else if (typeof formData.image === "string") {
      imageURL = formData.image;
    }

    const dataToSave = {
      ...formData,
      image: imageURL,
    };

    delete (dataToSave as any).id; // in case id was carried over

    if (editingId) {
      await updateCredential(editingId, dataToSave);
    } else {
      await addCredential(dataToSave);
    }

    setFormData(emptyCredential);
    setEditingId(null);
    imageInputRef.current!.value = "";
    await loadCredentials();
  }

  const handleDateChange = (dateValue: Dayjs | null) => {
    const dateString = dateValue?.toISOString() ?? "";
    setFormData((prev) => ({ ...prev, issuedDate: dateString }));
  };
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
          Admin CRUD for Credentials
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
                label="Credential Link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <InputLabel>Select Credential Image</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                name="image"
                ref={imageInputRef}
              />
              {formData.image && typeof formData.image === "string" && (
                <FormHelperText>
                  <Link href={formData.image} target="_blank">
                    Link to current crednetial image
                  </Link>
                </FormHelperText>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Issued By"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleChange}
                rows={2}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Issued Date"
                  name="issuedDate"
                  value={
                    formData.issuedDate ? dayjs(formData.issuedDate) : null
                  }
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

            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingId ? "Update" : "Add"} Credential
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData(emptyCredential);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <CredentialList
          credentials={credentials}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />
      </Container>
    </Paper>
  );
}
