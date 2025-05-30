"use client";
import {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/lib/firebase/firestore-crud";
import { useEffect, useRef, useState } from "react";
import { IProject } from "../../../../data/data.type";
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
import ProjectList from "./ProjectList";

const emptyProject: IProject = {
  demoLink: "",
  description: "",
  oneLiner: "",
  sourceLink: "",
  technologiesUsed: [],
  title: "",
  image: "",
  potrait: "",
};

export default function Admin() {
  const [projects, setProjects] = useState<(IProject & { id: string })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyProject);
  const [techInput, setTechInput] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const potraitInputRef = useRef<HTMLInputElement>(null);
  const theme = useAppTheme();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const data = await getAllProjects();
    setProjects(data);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleTechAdd() {
    if (techInput.trim() !== "") {
      setFormData(
        (prev): IProject => ({
          ...prev,
          technologiesUsed: [...prev.technologiesUsed, techInput.trim()],
        })
      );
      setTechInput("");
    }
  }

  function handleTechRemove(tech: string) {
    setFormData((prev) => ({
      ...prev,
      technologiesUsed: prev.technologiesUsed.filter((t) => t !== tech),
    }));
  }

  function startEdit(project: IProject & { id: string }) {
    setEditingId(project.id);
    setFormData({ ...project });
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteProject(id);
      loadProjects();
    }
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  }

  function handlePotraitChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, potrait: file }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageURL = "";
    let potraitURL = "";

    if (formData.image instanceof File) {
      imageURL = await uploadImage(formData.image, `${formData.title}/image`);
    } else if (typeof formData.image === "string") {
      imageURL = formData.image;
    }

    if (formData.potrait instanceof File) {
      potraitURL = await uploadImage(
        formData.potrait,
        `${formData.title}/potrait`
      );
    } else if (typeof formData.potrait === "string") {
      potraitURL = formData.potrait;
    }

    const dataToSave = {
      ...formData,
      image: imageURL,
      potrait: potraitURL,
    };

    delete (dataToSave as any).id; // in case id was carried over

    if (editingId) {
      await updateProject(editingId, dataToSave);
    } else {
      await addProject(dataToSave);
    }

    setFormData(emptyProject);
    setEditingId(null);
    imageInputRef.current!.value = "";
    potraitInputRef.current!.value = "";
    await loadProjects();
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
          Admin CRUD for Projects
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
                label="Demo Link"
                name="demoLink"
                value={formData.demoLink}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Source Link"
                name="sourceLink"
                value={formData.sourceLink}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <InputLabel>Select Demo Image</InputLabel>
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
                    Link to current demo image
                  </Link>
                </FormHelperText>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <InputLabel>Select Portrait/Display Image</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handlePotraitChange}
                name="potrait"
                ref={potraitInputRef}
              />
              {formData.potrait && typeof formData.potrait === "string" && (
                <FormHelperText>
                  <Link href={formData.potrait} target="_blank">
                    Link to current portrait image
                  </Link>
                </FormHelperText>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="One Liner"
                name="oneLiner"
                value={formData.oneLiner}
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Add Technology"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleTechAdd}
                sx={{ height: "100%" }}
              >
                Add Tech
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.technologiesUsed.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    onClick={() => handleTechRemove(tech)}
                    onDelete={() => handleTechRemove(tech)}
                    color="primary"
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingId ? "Update" : "Add"} Project
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData(emptyProject);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <ProjectList
          projects={projects}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />
      </Container>
    </Paper>
  );
}
