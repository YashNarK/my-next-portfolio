"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { uploadSkillIcon } from "@/lib/firebase/uploadFiles";
import { slugify } from "@/lib/skills/slug";
import {
  addSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "@/lib/firebase/skills-crud";
import { getAllSkillViews } from "@/lib/firebase/skill-views-crud";
import { ISkill, ISkillView } from "../../../../data/data.type";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SkillList from "./SkillList";
import ViewManager from "./ViewManager";

const NONE = "__none__";

const emptySkill: ISkill = {
  key: "",
  label: "",
  iconUrl: "",
  categories: {},
  categoryOrder: {},
  order: 0,
  aliases: [],
  active: true,
};

export default function AdminSkills() {
  const theme = useAppTheme();
  const [skills, setSkills] = useState<(ISkill & { id: string })[]>([]);
  const [views, setViews] = useState<(ISkillView & { id: string })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ISkill>(emptySkill);
  const [aliasesText, setAliasesText] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);

  async function loadAll() {
    const [s, v] = await Promise.all([getAllSkills(), getAllSkillViews()]);
    setSkills(s);
    setViews([...v].sort((a, b) => a.order - b.order));
  }

  useEffect(() => {
    loadAll();
  }, []);

  function resetForm() {
    setForm(emptySkill);
    setAliasesText("");
    setIconFile(null);
    setEditingId(null);
    if (iconInputRef.current) iconInputRef.current.value = "";
  }

  function startEdit(skill: ISkill & { id: string }) {
    setEditingId(skill.id);
    setForm({
      key: skill.key,
      label: skill.label,
      iconUrl: skill.iconUrl,
      categories: { ...(skill.categories ?? {}) },
      categoryOrder: { ...(skill.categoryOrder ?? {}) },
      order: skill.order ?? 0,
      aliases: skill.aliases ?? [],
      level: skill.level,
      tags: skill.tags,
      active: skill.active !== false,
    });
    setAliasesText((skill.aliases ?? []).join(", "));
    setIconFile(null);
    if (iconInputRef.current) iconInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    await deleteSkill(id);
    await loadAll();
  }

  function setCategory(viewKey: string, value: string) {
    setForm((prev) => {
      const categories = { ...prev.categories };
      const categoryOrder = { ...(prev.categoryOrder ?? {}) };
      if (value === NONE) {
        delete categories[viewKey];
        delete categoryOrder[viewKey];
      } else {
        categories[viewKey] = value;
      }
      return { ...prev, categories, categoryOrder };
    });
  }

  function setCategoryOrder(viewKey: string, order: number) {
    setForm((prev) => ({
      ...prev,
      categoryOrder: { ...(prev.categoryOrder ?? {}), [viewKey]: order },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const key = (form.key || slugify(form.label)).trim();
      const aliases = aliasesText
        .split(",")
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean);

      let iconUrl = form.iconUrl;
      if (iconFile) iconUrl = await uploadSkillIcon(iconFile, key);

      // Drop categoryOrder entries whose view was deselected.
      const categoryOrder: Record<string, number> = {};
      for (const [vk, val] of Object.entries(form.categoryOrder ?? {})) {
        if (form.categories[vk] !== undefined) categoryOrder[vk] = Number(val);
      }

      const doc: ISkill = {
        key,
        label: form.label.trim(),
        iconUrl,
        categories: form.categories,
        categoryOrder,
        order: Number(form.order) || 0,
        aliases,
        active: form.active !== false,
        ...(form.level !== undefined ? { level: Number(form.level) } : {}),
        ...(form.tags ? { tags: form.tags } : {}),
      };

      if (editingId) await updateSkill(editingId, doc);
      else await addSkill(doc);

      resetForm();
      await loadAll();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: 4,
        maxWidth: 900,
        margin: "auto",
      }}
    >
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" gutterBottom>
          Admin CRUD for Skills
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Label"
                value={form.label}
                onChange={(e) =>
                  setForm((p) => ({ ...p, label: e.target.value }))
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Key (slug)"
                value={form.key}
                onChange={(e) =>
                  setForm((p) => ({ ...p, key: e.target.value }))
                }
                placeholder={form.label ? slugify(form.label) : "auto from label"}
                helperText="Stable id + icon filename. Leave blank to auto-derive."
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <InputLabel>Icon (SVG silhouette)</InputLabel>
              <input
                type="file"
                accept=".svg,image/svg+xml"
                ref={iconInputRef}
                onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
              />
              {form.iconUrl && (
                <FormHelperText>
                  <Link href={form.iconUrl} target="_blank">
                    Current icon
                  </Link>
                </FormHelperText>
              )}
            </Grid>

            {/* One category selector per view — this is what auto-places the
                skill across every visualization. */}
            {views.map((v) => (
              <Grid size={{ xs: 12 }} key={v.key}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id={`cat-${v.key}`}>{v.title}</InputLabel>
                    <Select
                      labelId={`cat-${v.key}`}
                      label={v.title}
                      value={form.categories[v.key] ?? NONE}
                      onChange={(e) => setCategory(v.key, e.target.value)}
                    >
                      <MenuItem value={NONE}>
                        <em>— not in this view —</em>
                      </MenuItem>
                      {[...v.categories]
                        .sort((a, b) => a.order - b.order)
                        .map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            {c.value}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Order in group"
                    type="number"
                    sx={{ width: { xs: "100%", sm: 160 } }}
                    disabled={form.categories[v.key] === undefined}
                    value={form.categoryOrder?.[v.key] ?? ""}
                    onChange={(e) =>
                      setCategoryOrder(v.key, Number(e.target.value))
                    }
                  />
                </Stack>
              </Grid>
            ))}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Global order (fallback)"
                type="number"
                value={form.order ?? 0}
                onChange={(e) =>
                  setForm((p) => ({ ...p, order: Number(e.target.value) }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Proficiency level (optional, 1-5)"
                type="number"
                value={form.level ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    level: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Aliases (comma-separated, for chatbot)"
                value={aliasesText}
                onChange={(e) => setAliasesText(e.target.value)}
                placeholder="react, reactjs, react.js"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.active !== false}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, active: e.target.checked }))
                    }
                  />
                }
                label="Active (visible on the site)"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" disabled={saving}>
                  {editingId ? "Update" : "Add"} Skill
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <SkillList
          skills={skills}
          views={views}
          startEdit={startEdit}
          handleDelete={handleDelete}
        />

        <Divider sx={{ my: 6 }} />

        <ViewManager views={views} reload={loadAll} />
      </Container>
    </Paper>
  );
}
