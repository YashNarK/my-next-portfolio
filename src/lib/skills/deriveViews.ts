import { ISkill, ISkillView } from "../../../data/data.type";

// Vibrant mid-tone accents that read on both light and dark backgrounds.
// Used as a fallback when a category has no explicit `accent`.
export const SKILL_ACCENTS = [
  "#5227FF",
  "#00C2A8",
  "#FF7AC6",
  "#F5A524",
  "#3B82F6",
  "#EF4444",
];

export interface DerivedSkill {
  key: string;
  label: string;
  iconUrl: string;
}

export interface DerivedGroup {
  title: string;
  caption?: string;
  accent: string;
  items: DerivedSkill[];
}

const isActive = (s: ISkill) => s.active !== false;

const rankWithin = (s: ISkill, viewKey: string) => {
  const co = s.categoryOrder?.[viewKey];
  if (typeof co === "number") return co;
  if (typeof s.order === "number") return s.order;
  return Number.POSITIVE_INFINITY;
};

/**
 * Derives the ordered, grouped skills for a single view. Pure and
 * framework-agnostic so every visual (chips today, graph/3D later) and the
 * chatbot share one grouping source of truth.
 *
 * - Categories are ordered by `ISkillCategory.order`.
 * - A skill joins a group when `skill.categories[view.key] === category.value`.
 * - Skills sort by `categoryOrder[view.key]` -> global `order` -> label.
 * - Empty groups are dropped; inactive skills are excluded.
 */
export function deriveGroups(
  skills: ISkill[],
  view: ISkillView
): DerivedGroup[] {
  const categories = [...view.categories].sort((a, b) => a.order - b.order);

  return categories
    .map((category, index) => {
      const items = skills
        .filter(
          (s) => isActive(s) && s.categories?.[view.key] === category.value
        )
        .sort((a, b) => {
          const ra = rankWithin(a, view.key);
          const rb = rankWithin(b, view.key);
          if (ra !== rb) return ra - rb;
          return a.label.localeCompare(b.label);
        })
        .map<DerivedSkill>((s) => ({
          key: s.key,
          label: s.label,
          iconUrl: s.iconUrl,
        }));

      return {
        title: category.value,
        caption: category.caption,
        accent:
          category.accent ?? SKILL_ACCENTS[index % SKILL_ACCENTS.length],
        items,
      };
    })
    .filter((g) => g.items.length > 0);
}

/** Views sorted by their `order` for stable toggle rendering. */
export const sortViews = (views: ISkillView[]) =>
  [...views].sort((a, b) => a.order - b.order);
