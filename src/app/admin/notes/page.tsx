"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import {
  addNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "@/lib/firebase/notes-crud";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { INote } from "../../../../data/data.type";
import NotesList from "./NotesList";

const emptyNote: INote = {
  title: "",
  content: "",
  createdAt: "",
  updatedAt: "",
};

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<(INote & { id: string })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<INote>(emptyNote);
  const theme = useAppTheme();

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const data = await getAllNotes();
    // Sort newest first
    data.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    setNotes(data);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(note: INote & { id: string }) {
    setEditingId(note.id);
    setFormData({ ...note });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this note?")) {
      await deleteNote(id);
      loadNotes();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();

    if (editingId) {
      await updateNote(editingId, {
        title: formData.title,
        content: formData.content,
        updatedAt: now,
      });
    } else {
      await addNote({
        title: formData.title,
        content: formData.content,
        createdAt: now,
        updatedAt: now,
      });
    }

    setFormData(emptyNote);
    setEditingId(null);
    await loadNotes();
  }

  function handleCancel() {
    setFormData(emptyNote);
    setEditingId(null);
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
          Notes Clipboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Save and retrieve text notes. Use the copy button to instantly copy
          content to clipboard.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 6 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Short label to identify this note"
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              multiline
              minRows={6}
              placeholder="Paste your note content here..."
              slotProps={{
                input: { style: { fontFamily: "monospace", fontSize: 14 } },
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? "Update Note" : "Save Note"}
              </Button>
              {editingId && (
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <NotesList
          notes={notes}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />
      </Container>
    </Paper>
  );
}
