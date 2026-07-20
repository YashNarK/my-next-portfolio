"use client";

import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

type Skill = { label: string; icon: string };
type Group = { title: string; caption?: string; items: Skill[] };
type View = "language" | "layer";

// Single source of truth. `icon` maps to /public/svg/skills/<icon>.svg
// (monochrome silhouettes rendered via CSS mask, tinted per group accent).
const S = {
  react: { label: "React", icon: "react" },
  next: { label: "Next.js", icon: "next" },
  redux: { label: "Redux", icon: "redux" },
  ts: { label: "TypeScript", icon: "ts" },
  js: { label: "JavaScript", icon: "js" },
  node: { label: "Node.js", icon: "node" },
  express: { label: "Express", icon: "express" },
  fastapi: { label: "FastAPI", icon: "fastapi" },
  python: { label: "Python", icon: "python" },
  bullmq: { label: "BullMQ", icon: "bullmq" },
  graphql: { label: "GraphQL", icon: "graphql" },
  rest: { label: "REST API", icon: "rest" },
  postgres: { label: "PostgreSQL", icon: "postgres" },
  sqlserver: { label: "SQL Server", icon: "sqlserver" },
  mongo: { label: "MongoDB", icon: "mongo" },
  bigquery: { label: "BigQuery", icon: "bigquery" },
  redis: { label: "Redis", icon: "redis" },
  docker: { label: "Docker", icon: "docker" },
  azure: { label: "Azure", icon: "azure" },
  gcp: { label: "GCP", icon: "gcp" },
} satisfies Record<string, Skill>;

// View 1 — by language ecosystem (the "full-stack track" framing).
const byLanguage: Group[] = [
  {
    title: "JavaScript / TypeScript",
    caption: "full-stack",
    items: [
      S.ts,
      S.js,
      S.react,
      S.next,
      S.redux,
      S.node,
      S.express,
      S.graphql,
      S.rest,
      S.bullmq,
    ],
  },
  {
    title: "Python",
    caption: "full-stack",
    items: [S.python, S.fastapi, S.rest],
  },
  {
    title: "Databases & Cloud",
    caption: "polyglot",
    items: [
      S.postgres,
      S.sqlserver,
      S.mongo,
      S.bigquery,
      S.redis,
      S.docker,
      S.azure,
      S.gcp,
    ],
  },
];

// View 2 — by architectural layer (top-down through the stack).
const byLayer: Group[] = [
  { title: "UI / Frontend", items: [S.react, S.next, S.redux, S.ts] },
  {
    title: "API / Services",
    items: [S.node, S.express, S.fastapi, S.python, S.graphql, S.rest],
  },
  { title: "Databases", items: [S.postgres, S.sqlserver, S.mongo, S.bigquery] },
  { title: "Cache & Messaging", items: [S.redis, S.bullmq] },
  { title: "Containerization", items: [S.docker] },
  { title: "Cloud", items: [S.azure, S.gcp] },
];

// Vibrant mid-tone accents that read on both light and dark backgrounds.
const accents = [
  "#5227FF",
  "#00C2A8",
  "#FF7AC6",
  "#F5A524",
  "#3B82F6",
  "#EF4444",
];

const SkillChip = ({ skill, accent }: { skill: Skill; accent: string }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      px: 1.25,
      py: 0.5,
      borderRadius: "999px",
      border: 1,
      borderColor: "divider",
      backgroundColor: "action.hover",
      transition:
        "transform 160ms ease, border-color 160ms ease, background-color 160ms ease",
      cursor: "default",
      "&:hover": {
        transform: "translateY(-2px)",
        borderColor: accent,
        backgroundColor: "action.selected",
      },
    }}
  >
    <Box
      aria-hidden
      sx={{
        width: 16,
        height: 16,
        flexShrink: 0,
        backgroundColor: accent,
        maskImage: `url(/svg/skills/${skill.icon}.svg)`,
        WebkitMaskImage: `url(/svg/skills/${skill.icon}.svg)`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
    <Typography
      variant="professional"
      component="span"
      sx={{
        fontSize: { xs: "0.78rem", sm: "0.9rem" },
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {skill.label}
    </Typography>
  </Box>
);

const GroupRow = ({ group, accent }: { group: Group; accent: string }) => (
  <Box
    sx={{
      borderLeft: "3px solid",
      borderColor: accent,
      pl: { xs: 1.25, sm: 1.75 },
      py: 0.5,
    }}
  >
    <Typography
      variant="professional"
      sx={{
        display: "block",
        mb: 1,
        fontSize: { xs: "0.72rem", sm: "0.8rem" },
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: accent,
      }}
    >
      {group.title}
      {group.caption && (
        <Box
          component="span"
          sx={{ opacity: 0.55, textTransform: "none", ml: 0.75 }}
        >
          {`// ${group.caption}`}
        </Box>
      )}
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 0.75, sm: 1 } }}>
      {group.items.map((s) => (
        <SkillChip key={s.label} skill={s} accent={accent} />
      ))}
    </Box>
  </Box>
);

const SkillMatrix = () => {
  const [view, setView] = useState<View>("language");
  const groups = view === "language" ? byLanguage : byLayer;

  return (
    <Stack gap={2} sx={{ mt: 2, width: "100%" }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        size="small"
        onChange={(_, next: View | null) => next && setView(next)}
        aria-label="skill grouping"
        sx={{
          alignSelf: { xs: "stretch", sm: "flex-start" },
          "& .MuiToggleButton-root": {
            flex: { xs: 1, sm: "initial" },
            px: { xs: 1.5, sm: 2 },
            py: 0.5,
            textTransform: "none",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: { xs: "0.72rem", sm: "0.8rem" },
            letterSpacing: 0.5,
          },
        }}
      >
        <ToggleButton value="language" aria-label="group by language">
          By Language
        </ToggleButton>
        <ToggleButton value="layer" aria-label="group by layer">
          By Layer
        </ToggleButton>
      </ToggleButtonGroup>

      <Stack
        key={view}
        gap={{ xs: 1.75, sm: 2 }}
        sx={{
          animation: "skillFade 320ms ease",
          "@keyframes skillFade": {
            from: { opacity: 0, transform: "translateY(6px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {groups.map((group, i) => (
          <GroupRow
            key={group.title}
            group={group}
            accent={accents[i % accents.length]}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default SkillMatrix;
