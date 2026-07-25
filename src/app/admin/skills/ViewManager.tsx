import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ISkillCategory, ISkillView } from "../../../../data/data.type";
import {
  addSkillView,
  deleteSkillView,
  updateSkillView,
} from "@/lib/firebase/skill-views-crud";
import { slugify } from "@/lib/skills/slug";

interface Props {
  views: (ISkillView & { id: string })[];
  reload: () => Promise<void>;
}

const emptyCategory = (order: number): ISkillCategory => ({
  value: "",
  caption: "",
  order,
  accent: "",
});

const ViewCard = ({
  view,
  reload,
}: {
  view: ISkillView & { id: string };
  reload: () => Promise<void>;
}) => {
  const [title, setTitle] = useState(view.title);
  const [order, setOrder] = useState(view.order);
  const [categories, setCategories] = useState<ISkillCategory[]>(
    view.categories ?? []
  );

  // Keep local draft in sync when the parent reloads fresh data.
  useEffect(() => {
    setTitle(view.title);
    setOrder(view.order);
    setCategories(view.categories ?? []);
  }, [view]);

  function updateCat(i: number, patch: Partial<ISkillCategory>) {
    setCategories((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c))
    );
  }

  async function save() {
    const cleaned = categories
      .filter((c) => c.value.trim())
      .map((c) => ({
        value: c.value.trim(),
        order: Number(c.order) || 0,
        ...(c.caption?.trim() ? { caption: c.caption.trim() } : {}),
        ...(c.accent?.trim() ? { accent: c.accent.trim() } : {}),
      }));
    await updateSkillView(view.id, {
      title: title.trim(),
      order: Number(order) || 0,
      categories: cleaned,
    });
    await reload();
  }

  async function remove() {
    if (!confirm(`Delete view "${view.title}"?`)) return;
    await deleteSkillView(view.id);
    await reload();
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="View title"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Key"
          size="small"
          value={view.key}
          disabled
          helperText="immutable"
        />
        <TextField
          label="Order"
          type="number"
          size="small"
          sx={{ width: 110 }}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
      </Stack>

      <Typography variant="professional" sx={{ display: "block", mb: 1 }}>
        Categories
      </Typography>
      <Stack spacing={1}>
        {categories.map((c, i) => (
          <Grid container spacing={1} key={i} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Value (group title)"
                value={c.value}
                onChange={(e) => updateCat(i, { value: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Caption"
                value={c.caption ?? ""}
                onChange={(e) => updateCat(i, { caption: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Order"
                type="number"
                value={c.order}
                onChange={(e) => updateCat(i, { order: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Accent"
                value={c.accent ?? ""}
                onChange={(e) => updateCat(i, { accent: e.target.value })}
                placeholder="#5227FF"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1 }}>
              <IconButton
                aria-label="remove category"
                color="error"
                onClick={() =>
                  setCategories((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                ✕
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            setCategories((prev) => [...prev, emptyCategory(prev.length)])
          }
        >
          Add category
        </Button>
        <Button size="small" variant="contained" onClick={save}>
          Save view
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={remove}>
          Delete view
        </Button>
      </Stack>
    </Paper>
  );
};

const ViewManager = ({ views, reload }: Props) => {
  const [newKey, setNewKey] = useState("");
  const [newTitle, setNewTitle] = useState("");

  async function addView(e: React.FormEvent) {
    e.preventDefault();
    const key = (newKey || slugify(newTitle)).trim();
    if (!key || !newTitle.trim()) return;
    if (views.some((v) => v.key === key)) {
      alert(`A view with key "${key}" already exists.`);
      return;
    }
    await addSkillView({
      key,
      title: newTitle.trim(),
      order: views.length,
      categories: [],
    });
    setNewKey("");
    setNewTitle("");
    await reload();
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Views ({views.length})
      </Typography>
      <Typography variant="professional" sx={{ display: "block", mb: 2, opacity: 0.7 }}>
        A view is one way to group skills (e.g. By Language, By Layer). Each
        skill picks a category per view in the form above.
      </Typography>

      <Box component="form" onSubmit={addView} sx={{ mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            size="small"
            label="New view title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="By Domain"
          />
          <TextField
            size="small"
            label="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder={newTitle ? slugify(newTitle) : "auto"}
          />
          <Button type="submit" variant="contained">
            Add view
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2}>
        {views.map((v) => (
          <ViewCard key={v.id} view={v} reload={reload} />
        ))}
      </Stack>
    </Box>
  );
};

export default ViewManager;
