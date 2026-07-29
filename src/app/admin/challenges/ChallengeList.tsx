"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { IChallenge } from "../../../../data/data.type";

type StoredChallenge = IChallenge & { id: string };

interface ChallengeListProps {
  challenges: StoredChallenge[];
  startEdit: (challenge: StoredChallenge) => void;
  handleDelete: (id: string) => void;
}

const ALL = "All";

/**
 * Renders a code snippet.
 *
 * Deliberately a plain <pre> rather than a syntax highlighter: these
 * snippets are short, the admin view is not the portfolio's shop window,
 * and a highlighter would add a dependency plus a client bundle for a
 * handful of blocks nobody but the author sees.
 */
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title={copied ? "Copied" : "Copy"}>
        <Button
          size="small"
          onClick={copy}
          sx={{ position: "absolute", top: 8, right: 8, minWidth: 0, zIndex: 1 }}
        >
          {copied ? "✓" : "Copy"}
        </Button>
      </Tooltip>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          pr: 9,
          borderRadius: 2,
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          // long lines scroll inside the block instead of stretching the card
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: 12.5,
          lineHeight: 1.6,
        }}
      >
        <code>{code}</code>
      </Box>
    </Box>
  );
}

const ChallengeList = ({
  challenges,
  startEdit,
  handleDelete,
}: ChallengeListProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(challenges.map((c) => c.category))).sort()],
    [challenges],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return challenges.filter((c) => {
      if (category !== ALL && c.category !== category) return false;
      if (!q) return true;
      // search across the fields someone would actually recall a challenge by
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.subCategory.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [challenges, search, category]);

  // grouped so related problems read together rather than as a flat list
  const grouped = useMemo(() => {
    const map = new Map<string, StoredChallenge[]>();
    for (const c of filtered) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" sx={{ flex: 1 }}>
          Saved Challenges
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filtered.length} of {challenges.length}
        </Typography>
      </Stack>

      <TextField
        label="Search title, description or category"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  ✕
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
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

      {filtered.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No challenges found.
        </Typography>
      )}

      <Stack spacing={4}>
        {grouped.map(([cat, items]) => (
          <Box key={cat}>
            <Typography variant="overline" color="text.secondary">
              {cat} · {items.length}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.5}>
              {items.map((challenge) => (
                <Accordion
                  key={challenge.id}
                  disableGutters
                  elevation={0}
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary>
                    <Box sx={{ width: "100%" }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mb: 0.5 }}
                      >
                        <Chip
                          label={challenge.subCategory}
                          size="small"
                          variant="outlined"
                        />
                        {challenge.codeExample ? (
                          <Chip label="code" size="small" color="secondary" />
                        ) : null}
                        {challenge.referenceUrls?.length ? (
                          <Chip
                            label={`${challenge.referenceUrls.length} ref`}
                            size="small"
                            variant="outlined"
                          />
                        ) : null}
                      </Stack>
                      <Typography
                        variant="subtitle1"
                        sx={{ wordBreak: "break-word", fontWeight: 600 }}
                      >
                        {challenge.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        // the description is authored with meaningful line
                        // breaks; collapsing them would destroy its structure
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        mb: challenge.codeExample ? 3 : 2,
                      }}
                    >
                      {challenge.description}
                    </Typography>

                    {challenge.codeExample ? (
                      <Box sx={{ mb: 3 }}>
                        <CodeBlock code={challenge.codeExample} />
                      </Box>
                    ) : null}

                    {challenge.referenceUrls?.length ? (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          References
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          {challenge.referenceUrls.map((url) => (
                            <Link
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="body2"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {url}
                            </Link>
                          ))}
                        </Stack>
                      </Box>
                    ) : null}

                    <Divider sx={{ mb: 2 }} />

                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Typography variant="caption" color="text.secondary">
                        Updated{" "}
                        {challenge.updatedAt
                          ? new Date(challenge.updatedAt).toLocaleDateString()
                          : "—"}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => startEdit(challenge)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(challenge.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ChallengeList;
