"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { INote } from "../../../../data/data.type";
import { noteCategory, noteFileName, noteToPlainText } from "@/lib/notes";

type StoredNote = INote & { id: string };

interface NotesListProps {
  notes: StoredNote[];
  startEdit: (note: StoredNote) => void;
  handleDelete: (id: string) => void;
}

const ALL = "All";

const NotesList = ({ notes, startEdit, handleDelete }: NotesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      ALL,
      ...Array.from(new Set(notes.map(noteCategory))).sort((a, b) =>
        a.localeCompare(b),
      ),
    ],
    [notes],
  );

  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return notes.filter((note) => {
      if (category !== ALL && noteCategory(note) !== category) return false;
      if (!q) return true;
      return (
        note.title.toLowerCase().includes(q) ||
        noteCategory(note).toLowerCase().includes(q)
      );
    });
  }, [notes, searchQuery, category]);

  // Grouped so notes of a kind read together; with a category selected this
  // collapses to the single group, which is exactly what you want then.
  const grouped = useMemo(() => {
    const map = new Map<string, StoredNote[]>();
    for (const note of filteredNotes) {
      const key = noteCategory(note);
      const list = map.get(key) ?? [];
      list.push(note);
      map.set(key, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredNotes]);

  async function handleCopy(note: StoredNote) {
    await navigator.clipboard.writeText(note.content);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  /**
   * Saves the note as `<title>.txt` via an object URL. Same filename and same
   * body the REST endpoint serves for `?format=txt`, so it makes no difference
   * whether a file came from here or over HTTP.
   */
  function handleDownload(note: StoredNote) {
    const blob = new Blob([noteToPlainText(note)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = noteFileName(note.title);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" sx={{ flex: 1 }}>
          Saved Notes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredNotes.length} of {notes.length}
        </Typography>
      </Stack>

      <TextField
        label="Search by title or category"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  ✕
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 3 }}
      >
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => setCategory(cat)}
            color={category === cat ? "primary" : "default"}
            variant={category === cat ? "filled" : "outlined"}
            size="small"
          />
        ))}
      </Stack>

      {filteredNotes.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No notes found.
        </Typography>
      )}

      <Stack spacing={4}>
        {grouped.map(([cat, items]) => (
          <Box key={cat}>
            <Typography variant="overline" color="text.secondary">
              {cat} · {items.length}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {items.map((note) => (
                <Paper
                  key={note.id}
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "background.paper",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.005)",
                      transition: "0.2s",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    gap={1}
                    mb={1}
                  >
                    <Typography
                      variant="h6"
                      sx={{ wordBreak: "break-word", flex: 1 }}
                    >
                      {note.title}
                    </Typography>
                    <Chip
                      label={new Date(note.updatedAt).toLocaleDateString()}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      maxHeight: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      mb: 2,
                    }}
                  >
                    {note.content}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Tooltip
                      title={
                        copiedId === note.id
                          ? "Copied!"
                          : "Copy content to clipboard"
                      }
                    >
                      <Button
                        variant={copiedId === note.id ? "contained" : "outlined"}
                        color={copiedId === note.id ? "success" : "primary"}
                        size="small"
                        onClick={() => handleCopy(note)}
                      >
                        {copiedId === note.id ? "Copied!" : "Copy"}
                      </Button>
                    </Tooltip>
                    <Tooltip title={`Download ${noteFileName(note.title)}`}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDownload(note)}
                      >
                        Download
                      </Button>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => startEdit(note)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default NotesList;
