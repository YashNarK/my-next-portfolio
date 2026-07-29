"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import {
  addChallenge,
  deleteChallenge,
  getAllChallenges,
  updateChallenge,
} from "@/lib/firebase/challenges-crud";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { IChallenge } from "../../../../data/data.type";
import { CHALLENGE_SEEDS } from "../../../../data/challenges.seed";
import ChallengeList from "./ChallengeList";

type StoredChallenge = IChallenge & { id: string };

const emptyChallenge: IChallenge = {
  category: "",
  subCategory: "",
  title: "",
  description: "",
  codeExample: "",
  referenceUrls: [],
  createdAt: "",
  updatedAt: "",
};

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<StoredChallenge[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IChallenge>(emptyChallenge);
  const [urlDraft, setUrlDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const theme = useAppTheme();

  useEffect(() => {
    void loadChallenges();
  }, []);

  async function loadChallenges() {
    const data = await getAllChallenges();
    data.sort(
      (a, b) =>
        a.category.localeCompare(b.category) ||
        (a.order ?? 0) - (b.order ?? 0) ||
        a.title.localeCompare(b.title),
    );
    setChallenges(data);
  }

  // Existing values power the category/sub-category comboboxes, so related
  // entries cluster instead of drifting into "LangGraph" vs "Langgraph".
  const categories = useMemo(
    () => Array.from(new Set(challenges.map((c) => c.category))).sort(),
    [challenges],
  );
  const subCategories = useMemo(
    () => Array.from(new Set(challenges.map((c) => c.subCategory))).sort(),
    [challenges],
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      referenceUrls: [...(prev.referenceUrls ?? []), url],
    }));
    setUrlDraft("");
  }

  function removeUrl(index: number) {
    setFormData((prev) => ({
      ...prev,
      referenceUrls: (prev.referenceUrls ?? []).filter((_, i) => i !== index),
    }));
  }

  function startEdit(challenge: StoredChallenge) {
    setEditingId(challenge.id);
    setFormData({
      ...challenge,
      codeExample: challenge.codeExample ?? "",
      referenceUrls: challenge.referenceUrls ?? [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    const target = challenges.find((c) => c.id === id);
    if (confirm(`Delete "${target?.title ?? "this challenge"}"?`)) {
      await deleteChallenge(id);
      if (editingId === id) handleCancel();
      await loadChallenges();
      setToast("Challenge deleted");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const now = new Date().toISOString();

    // Firestore rejects undefined, so optional fields are normalised rather
    // than passed through as-is.
    const payload = {
      category: formData.category.trim(),
      subCategory: formData.subCategory.trim(),
      title: formData.title.trim(),
      description: formData.description,
      codeExample: formData.codeExample?.trim() ?? "",
      referenceUrls: formData.referenceUrls ?? [],
      order: formData.order ?? 0,
    };

    try {
      if (editingId) {
        await updateChallenge(editingId, { ...payload, updatedAt: now });
        setToast("Challenge updated");
      } else {
        await addChallenge({ ...payload, createdAt: now, updatedAt: now });
        setToast("Challenge added");
      }
      handleCancel();
      await loadChallenges();
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    setFormData(emptyChallenge);
    setUrlDraft("");
    setEditingId(null);
  }

  /**
   * Writes any starter challenge whose title is not already present.
   *
   * Matching on title keeps this idempotent: running it twice adds nothing
   * the second time, and it never overwrites edits made here — so it is
   * safe to press after adding new seeds to the source file.
   */
  async function handleSeed() {
    const existing = new Set(challenges.map((c) => c.title));
    const missing = CHALLENGE_SEEDS.filter((s) => !existing.has(s.title));

    if (missing.length === 0) {
      setToast("Already up to date — nothing to seed");
      return;
    }

    setBusy(true);
    try {
      const now = new Date().toISOString();
      for (const seed of missing) {
        await addChallenge({
          ...seed,
          codeExample: seed.codeExample ?? "",
          referenceUrls: seed.referenceUrls ?? [],
          order: seed.order ?? 0,
          createdAt: now,
          updatedAt: now,
        });
      }
      await loadChallenges();
      setToast(`Seeded ${missing.length} challenge(s)`);
    } finally {
      setBusy(false);
    }
  }

  const pendingSeeds = CHALLENGE_SEEDS.filter(
    (s) => !challenges.some((c) => c.title === s.title),
  ).length;

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: { xs: 2, md: 4 },
        maxWidth: 1100,
        margin: "auto",
      }}
    >
      <Container sx={{ py: { xs: 4, md: 10 } }}>
        <Typography variant="h4" gutterBottom>
          Challenges
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Engineering problems worth remembering — what broke, why it was hard
          to see, and what fixed it.
        </Typography>

        {pendingSeeds > 0 && (
          <Alert
            severity="info"
            sx={{ mb: 4 }}
            action={
              <Button size="small" onClick={handleSeed} disabled={busy}>
                Seed
              </Button>
            }
          >
            {pendingSeeds} starter challenge(s) from the seed file are not in
            the database yet.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 6 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Autocomplete
                freeSolo
                fullWidth
                options={categories}
                value={formData.category}
                onInputChange={(_, value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    required
                    placeholder="LangGraph"
                  />
                )}
              />
              <Autocomplete
                freeSolo
                fullWidth
                options={subCategories}
                value={formData.subCategory}
                onInputChange={(_, value) =>
                  setFormData((prev) => ({ ...prev, subCategory: value }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub category"
                    required
                    placeholder="State Management"
                  />
                )}
              />
            </Stack>

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="What went wrong, in one line"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              minRows={8}
              placeholder="Symptom, root cause, why it was hard to see, and the fix."
            />

            <TextField
              fullWidth
              label="Code example (optional)"
              name="codeExample"
              value={formData.codeExample}
              onChange={handleChange}
              multiline
              minRows={6}
              placeholder="The fix, or the shape that failed."
              slotProps={{
                input: {
                  style: { fontFamily: "monospace", fontSize: 13 },
                },
              }}
            />

            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Reference URL"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => {
                    // a bare Enter here would submit the whole form
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addUrl();
                    }
                  }}
                  placeholder="https://..."
                />
                <Button variant="outlined" onClick={addUrl}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(formData.referenceUrls ?? []).map((url, index) => (
                  <Chip
                    key={`${url}-${index}`}
                    label={url}
                    onDelete={() => removeUrl(index)}
                    size="small"
                    sx={{ maxWidth: 420 }}
                  />
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={busy}
              >
                {editingId ? "Update Challenge" : "Save Challenge"}
              </Button>
              {editingId && (
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <ChallengeList
          challenges={challenges}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />
      </Container>

      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast ?? ""}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Paper>
  );
}
