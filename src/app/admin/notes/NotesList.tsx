"use client";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import {
  assignableCategories,
  noteCategory,
  noteFileName,
  noteToPlainText,
  UNCATEGORIZED,
} from "@/lib/notes";

type StoredNote = INote & { id: string };

interface NotesListProps {
  notes: StoredNote[];
  startEdit: (note: StoredNote) => void;
  handleDelete: (id: string) => void;
  /** Applies a category to many notes at once; `""` clears it. */
  bulkSetCategory: (ids: string[], category: string) => Promise<void>;
}

const ALL = "All";

const NotesList = ({
  notes,
  startEdit,
  handleDelete,
  bulkSetCategory,
}: NotesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkPending, setBulkPending] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      ALL,
      ...Array.from(new Set(notes.map(noteCategory))).sort((a, b) =>
        a.localeCompare(b),
      ),
    ],
    [notes],
  );

  // Suggestions for the bulk combobox: real categories only, so retagging
  // reuses an existing label instead of inventing a variant spelling.
  const assignable = useMemo(() => assignableCategories(notes), [notes]);

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

  // Selection is derived against the current notes rather than synced to them,
  // so ids left behind by a delete or a reload can never linger in a bulk write.
  const selection = useMemo(() => {
    const live = new Set(notes.map((note) => note.id));
    return selectedIds.filter((id) => live.has(id));
  }, [selectedIds, notes]);

  const selected = useMemo(() => new Set(selection), [selection]);
  const shownSelectedCount = filteredNotes.filter((note) =>
    selected.has(note.id),
  ).length;
  const allShownSelected =
    filteredNotes.length > 0 && shownSelectedCount === filteredNotes.length;

  function toggleNote(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  /** Select-all acts on what is on screen, never on notes hidden by a filter. */
  function toggleAllShown() {
    const shownIds = filteredNotes.map((note) => note.id);
    setSelectedIds((prev) =>
      allShownSelected
        ? prev.filter((id) => !shownIds.includes(id))
        : Array.from(new Set([...prev, ...shownIds])),
    );
  }

  async function applyBulkCategory(next: string) {
    if (!selection.length) return;
    setBulkPending(true);
    setBulkError(null);
    try {
      await bulkSetCategory(selection, next);
      setSelectedIds([]);
      setBulkCategory("");
    } catch (error) {
      setBulkError(
        error instanceof Error ? error.message : "Could not update the notes.",
      );
    } finally {
      setBulkPending(false);
    }
  }

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

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          mb: 3,
          borderRadius: 2,
          // lit up only while a selection is live, so the bar reads as an
          // active mode rather than permanent chrome
          bgcolor: selection.length ? "action.selected" : "transparent",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ md: "center" }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Checkbox
              size="small"
              checked={allShownSelected}
              indeterminate={shownSelectedCount > 0 && !allShownSelected}
              onChange={toggleAllShown}
              disabled={filteredNotes.length === 0 || bulkPending}
              slotProps={{ input: { "aria-label": "Select all shown notes" } }}
            />
            <Typography variant="body2" color="text.secondary">
              {selection.length
                ? `${selection.length} selected`
                : "Select notes to categorize"}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
            sx={{ flex: 1 }}
          >
            <Autocomplete
              freeSolo
              size="small"
              options={assignable}
              // inputValue, not value: a freeSolo combobox whose `value`
              // always equals its text makes MUI skip option filtering, so
              // typing would list every category instead of narrowing.
              inputValue={bulkCategory}
              onInputChange={(_, value) => setBulkCategory(value)}
              disabled={!selection.length || bulkPending}
              sx={{ minWidth: 200, flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category for selected"
                  placeholder="Snippets"
                />
              )}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => applyBulkCategory(bulkCategory.trim())}
              disabled={
                !selection.length || !bulkCategory.trim() || bulkPending
              }
            >
              {bulkPending ? "Working…" : "Apply"}
            </Button>
            <Tooltip
              title={`Remove the category from the selected notes — they move to "${UNCATEGORIZED}"`}
            >
              {/* span keeps the tooltip alive while the button is disabled */}
              <span>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => applyBulkCategory("")}
                  disabled={!selection.length || bulkPending}
                >
                  Clear category
                </Button>
              </span>
            </Tooltip>
            {selection.length > 0 && (
              <Button
                size="small"
                onClick={() => setSelectedIds([])}
                disabled={bulkPending}
              >
                Deselect
              </Button>
            )}
          </Stack>
        </Stack>

        {bulkError && (
          <Alert severity="error" sx={{ mt: 1.5 }} onClose={() => setBulkError(null)}>
            {bulkError}
          </Alert>
        )}
      </Paper>

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
                    outline: selected.has(note.id) ? "2px solid" : "none",
                    outlineColor: "primary.main",
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
                    <Checkbox
                      size="small"
                      checked={selected.has(note.id)}
                      onChange={() => toggleNote(note.id)}
                      disabled={bulkPending}
                      sx={{ mt: -0.5, ml: -1 }}
                      slotProps={{
                        input: { "aria-label": `Select ${note.title}` },
                      }}
                    />
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
