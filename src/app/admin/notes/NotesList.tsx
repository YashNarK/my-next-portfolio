"use client";

import {
  Box,
  Button,
  Chip,
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

interface NotesListProps {
  notes: (INote & { id: string })[];
  startEdit: (note: INote & { id: string }) => void;
  handleDelete: (id: string) => void;
}

const NotesList = ({ notes, startEdit, handleDelete }: NotesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return notes.filter((note) => note.title.toLowerCase().includes(q));
  }, [notes, searchQuery]);

  async function handleCopy(note: INote & { id: string }) {
    await navigator.clipboard.writeText(note.content);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Saved Notes
      </Typography>

      <TextField
        label="Search by title"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
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

      {filteredNotes.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No notes found.
        </Typography>
      )}

      <Stack spacing={2}>
        {filteredNotes.map((note) => (
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

            <Stack direction="row" spacing={1}>
              <Tooltip
                title={
                  copiedId === note.id ? "Copied!" : "Copy content to clipboard"
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
  );
};

export default NotesList;
