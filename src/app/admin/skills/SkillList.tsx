import {
  Box,
  Button,
  Chip,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { ISkill, ISkillView } from "../../../../data/data.type";

const ITEMS_PER_PAGE = 8;

interface Props {
  skills: (ISkill & { id: string })[];
  views: (ISkillView & { id: string })[];
  startEdit: (skill: ISkill & { id: string }) => void;
  handleDelete: (id: string) => void;
}

const SkillList = ({ skills, views, startEdit, handleDelete }: Props) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? skills.filter(
          (s) =>
            s.label.toLowerCase().includes(q) ||
            s.key.toLowerCase().includes(q) ||
            Object.values(s.categories ?? {}).some((v) =>
              v.toLowerCase().includes(q)
            )
        )
      : skills;
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [skills, query]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Existing Skills ({skills.length})
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Search skills"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      />

      <Stack spacing={1.5}>
        {paged.map((skill) => (
          <Paper key={skill.id} variant="outlined" sx={{ p: 1.5 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {skill.iconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={skill.iconUrl}
                    alt={skill.label}
                    width={22}
                    height={22}
                    style={{ opacity: skill.active === false ? 0.35 : 0.85 }}
                  />
                )}
                <Box>
                  <Typography variant="professional">
                    {skill.label}
                    {skill.active === false && " (hidden)"}
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
                    {views.map((v) =>
                      skill.categories?.[v.key] ? (
                        <Chip
                          key={v.key}
                          size="small"
                          label={`${v.title}: ${skill.categories[v.key]}`}
                        />
                      ) : null
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => startEdit(skill)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(skill.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}
    </Box>
  );
};

export default SkillList;
