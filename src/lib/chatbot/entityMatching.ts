// Dynamic entity resolution against whatever is *actually* in Firestore
// right now (experiences, projects, credentials, publications) plus the
// static skill list. No entity names are hardcoded here — everything is
// derived from the live data so this stays correct even as admin content
// changes, without needing a code change.
import { ICredential, IExperience, IProject, IPublication } from "../../../data/data.type";
import { SkillEntry, SKILLS } from "./staticProfile";
import { includesWord, significantWordOverlapScore } from "./textUtils";

type EntityCategory = "project" | "experience" | "credential" | "publication";

export interface EntityMatch {
  category: EntityCategory;
  project?: IProject & { id: string };
  experience?: IExperience & { id: string };
  credential?: ICredential & { id: string };
  publication?: IPublication & { id: string };
}

interface CategoryBest {
  category: EntityCategory;
  score: number;
  labelLength: number;
}

function bestOfCategory<T>(
  query: string,
  category: EntityCategory,
  items: T[],
  labelFn: (item: T) => string
): { item: T; meta: CategoryBest } | null {
  let bestItem: T | null = null;
  let bestScore = 0;
  let bestLabelLength = 0;
  for (const item of items) {
    const label = labelFn(item);
    if (!label) continue;
    const score = significantWordOverlapScore(query, label);
    if (score < 1) continue;
    const labelLength = label.length;
    if (
      !bestItem ||
      score > bestScore ||
      (score === bestScore && labelLength > bestLabelLength)
    ) {
      bestItem = item;
      bestScore = score;
      bestLabelLength = labelLength;
    }
  }
  if (!bestItem) return null;
  return { item: bestItem, meta: { category, score: bestScore, labelLength: bestLabelLength } };
}

/**
 * Scores every project/experience/credential/publication against the query
 * and returns the single most-specific overall match (if any). Ties break
 * by category priority: project > experience > credential > publication —
 * an arbitrary but documented choice, since a keyword matcher can't fully
 * disambiguate "tell me about X" without more context.
 */
export function matchBestEntity(
  query: string,
  data: {
    projects: (IProject & { id: string })[];
    experiences: (IExperience & { id: string })[];
    credentials: (ICredential & { id: string })[];
    publications: (IPublication & { id: string })[];
  }
): EntityMatch | null {
  const projectBest = bestOfCategory(query, "project", data.projects, (p) => p.title);
  const experienceBest = bestOfCategory(
    query,
    "experience",
    data.experiences,
    (e) => `${e.title} ${e.companyOrInstitution}`
  );
  const credentialBest = bestOfCategory(
    query,
    "credential",
    data.credentials,
    (c) => `${c.title} ${c.issuedBy}`
  );
  const publicationBest = bestOfCategory(
    query,
    "publication",
    data.publications,
    (p) => `${p.title} ${p.publisher}`
  );

  // Declared in category-priority order so the tie-break (strict `>` below)
  // naturally favors project > experience > credential > publication.
  const candidates = [projectBest, experienceBest, credentialBest, publicationBest];

  let winner: (typeof candidates)[number] | null = null;
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (!winner || candidate.meta.score > winner.meta.score) {
      winner = candidate;
    }
  }
  if (!winner) return null;

  const match: EntityMatch = { category: winner.meta.category };
  if (winner.meta.category === "project") match.project = winner.item as IProject & { id: string };
  if (winner.meta.category === "experience") match.experience = winner.item as IExperience & { id: string };
  if (winner.meta.category === "credential") match.credential = winner.item as ICredential & { id: string };
  if (winner.meta.category === "publication") match.publication = winner.item as IPublication & { id: string };
  return match;
}

interface SkillHit {
  skill: SkillEntry;
  matchedAlias: string;
}

/**
 * Returns every distinct skill mentioned in the query, longest/most-specific
 * alias wins when aliases overlap (e.g. "next.js" over the bare "js" that
 * would otherwise also match JavaScript inside it).
 */
export function matchSkills(query: string): SkillHit[] {
  const candidates: SkillHit[] = [];
  for (const skill of SKILLS) {
    let bestAlias = "";
    for (const alias of skill.aliases) {
      if (alias.length > bestAlias.length && includesWord(query, alias)) {
        bestAlias = alias;
      }
    }
    if (bestAlias) candidates.push({ skill, matchedAlias: bestAlias });
  }

  candidates.sort((a, b) => b.matchedAlias.length - a.matchedAlias.length);

  const kept: SkillHit[] = [];
  for (const candidate of candidates) {
    const subsumed = kept.some((k) =>
      k.matchedAlias.includes(candidate.matchedAlias)
    );
    if (!subsumed) kept.push(candidate);
  }
  return kept;
}

/** Finds project titles / experience descriptions that mention a technology. */
export function findUsagesOfSkill(
  skillLabel: string,
  projects: (IProject & { id: string })[],
  experiences: (IExperience & { id: string })[]
): { projectTitles: string[]; experienceTitles: string[] } {
  const projectTitles = projects
    .filter((p) =>
      (p.technologiesUsed ?? []).some(
        (t) => t.toLowerCase() === skillLabel.toLowerCase()
      ) || includesWord(p.description ?? "", skillLabel)
    )
    .map((p) => p.title);

  const experienceTitles = experiences
    .filter((e) => includesWord(e.description ?? "", skillLabel))
    .map((e) => `${e.title} at ${e.companyOrInstitution}`);

  return { projectTitles, experienceTitles };
}
