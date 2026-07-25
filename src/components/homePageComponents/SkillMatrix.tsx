"use client";

import {
  Box,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useSkills from "@/hooks/useSkills";
import useSkillViews from "@/hooks/useSkillViews";
import {
  deriveGroups,
  sortViews,
  DerivedGroup,
  DerivedSkill,
} from "@/lib/skills/deriveViews";

const SkillChip = ({
  skill,
  accent,
}: {
  skill: DerivedSkill;
  accent: string;
}) => (
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
    {skill.iconUrl && (
      <Box
        aria-hidden
        sx={{
          width: 16,
          height: 16,
          flexShrink: 0,
          backgroundColor: accent,
          maskImage: `url("${skill.iconUrl}")`,
          WebkitMaskImage: `url("${skill.iconUrl}")`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    )}
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

const GroupRow = ({ group }: { group: DerivedGroup }) => (
  <Box
    sx={{
      borderLeft: "3px solid",
      borderColor: group.accent,
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
        color: group.accent,
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
        <SkillChip key={s.key} skill={s} accent={group.accent} />
      ))}
    </Box>
  </Box>
);

const MatrixSkeleton = () => (
  <Stack gap={2} sx={{ mt: 2, width: "100%" }}>
    <Skeleton variant="rounded" width={220} height={34} />
    {[0, 1, 2].map((i) => (
      <Box key={i} sx={{ borderLeft: "3px solid", borderColor: "divider", pl: 1.75, py: 0.5 }}>
        <Skeleton variant="text" width={180} height={18} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {[0, 1, 2, 3, 4].map((j) => (
            <Skeleton key={j} variant="rounded" width={92} height={30} sx={{ borderRadius: "999px" }} />
          ))}
        </Box>
      </Box>
    ))}
  </Stack>
);

const SkillMatrix = () => {
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: rawViews, isLoading: viewsLoading } = useSkillViews();

  const views = useMemo(() => (rawViews ? sortViews(rawViews) : []), [rawViews]);
  const [viewKey, setViewKey] = useState<string | null>(null);

  // Default to the first view once views arrive; keep selection valid if the
  // set changes (e.g. a view is added/removed via the admin dashboard).
  useEffect(() => {
    if (!views.length) return;
    setViewKey((prev) =>
      prev && views.some((v) => v.key === prev) ? prev : views[0].key
    );
  }, [views]);

  const activeView = views.find((v) => v.key === viewKey) ?? views[0];

  const groups = useMemo(
    () => (skills && activeView ? deriveGroups(skills, activeView) : []),
    [skills, activeView]
  );

  if (skillsLoading || viewsLoading) return <MatrixSkeleton />;

  if (!views.length || !skills?.length) {
    return (
      <Typography variant="professional" sx={{ mt: 2, opacity: 0.7 }}>
        No skills to show yet.
      </Typography>
    );
  }

  return (
    <Stack gap={2} sx={{ mt: 2, width: "100%" }}>
      {views.length > 1 && (
        <ToggleButtonGroup
          value={activeView?.key ?? null}
          exclusive
          size="small"
          onChange={(_, next: string | null) => next && setViewKey(next)}
          aria-label="skill grouping"
          sx={{
            alignSelf: { xs: "stretch", sm: "flex-start" },
            flexWrap: "wrap",
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
          {views.map((v) => (
            <ToggleButton key={v.key} value={v.key} aria-label={v.title}>
              {v.title}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      <Stack
        key={activeView?.key}
        gap={{ xs: 1.75, sm: 2 }}
        sx={{
          animation: "skillFade 320ms ease",
          "@keyframes skillFade": {
            from: { opacity: 0, transform: "translateY(6px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {groups.map((group) => (
          <GroupRow key={group.title} group={group} />
        ))}
      </Stack>
    </Stack>
  );
};

export default SkillMatrix;
