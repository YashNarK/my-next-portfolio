"use client";

import { useEffect, useRef, useState } from "react";
import { IProject, IProjectShot } from "../../../../data/data.type";
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
import {
  getAllProjects,
  deleteProject,
  updateProject,
  addProject,
} from "@/lib/firebase/projects-crud";

const emptyProject: IProject = {
  demoLink: "",
  description: "",
  oneLiner: "",
  sourceLink: "",
  technologiesUsed: [],
  title: "",
  image: "",
  potrait: "",
  gallery: [],
};

export default function Admin() {
  const [projects, setProjects] = useState<(IProject & { id: string })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyProject);
  const [techInput, setTechInput] = useState("");
  // Newly picked gallery files live outside formData until submit uploads them.
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const potraitInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
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
    setFormData({ ...project, gallery: project.gallery ?? [] });
    setGalleryFiles([]);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
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

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGalleryFiles(Array.from(e.target.files ?? []));
  }

  function handleShotCaption(index: number, caption: string) {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery ?? []).map((shot, i) =>
        i === index ? { ...shot, caption } : shot
      ),
    }));
  }

  function handleShotRemove(index: number) {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery ?? []).filter((_, i) => i !== index),
    }));
  }

  function handleShotMove(index: number, delta: number) {
    setFormData((prev) => {
      const next = [...(prev.gallery ?? [])];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, gallery: next };
    });
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

    // Existing shots keep their URLs; newly picked files upload under a
    // per-project gallery prefix and append in the order they were selected.
    const uploaded: IProjectShot[] = [];
    for (const [i, file] of galleryFiles.entries()) {
      const url = await uploadImage(
        file,
        `${formData.title}/gallery/${Date.now()}-${i}`
      );
      uploaded.push({ url });
    }

    const dataToSave = {
      ...formData,
      image: imageURL,
      potrait: potraitURL,
      gallery: [...(formData.gallery ?? []), ...uploaded],
    };

    delete (dataToSave as Record<string, unknown>).id; // in case id was carried over

    if (editingId) {
      await updateProject(editingId, dataToSave);
    } else {
      await addProject(dataToSave);
    }

    setFormData(emptyProject);
    setEditingId(null);
    setGalleryFiles([]);
    imageInputRef.current!.value = "";
    potraitInputRef.current!.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
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
              <InputLabel>
                Gallery — screenshots of the working app (multi-select)
              </InputLabel>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                name="gallery"
                ref={galleryInputRef}
              />
              {galleryFiles.length > 0 && (
                <FormHelperText>
                  {galleryFiles.length} new image
                  {galleryFiles.length === 1 ? "" : "s"} will be uploaded on
                  save.
                </FormHelperText>
              )}

              <Stack spacing={1} sx={{ mt: 2 }}>
                {(formData.gallery ?? []).map((shot, i) => (
                  <Stack
                    key={shot.url}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.url}
                      alt=""
                      width={72}
                      height={46}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      label={`Caption ${i + 1}`}
                      value={shot.caption ?? ""}
                      onChange={(e) => handleShotCaption(i, e.target.value)}
                    />
                    <Button
                      size="small"
                      onClick={() => handleShotMove(i, -1)}
                      disabled={i === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleShotMove(i, 1)}
                      disabled={i === (formData.gallery ?? []).length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleShotRemove(i)}
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Stack>
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
