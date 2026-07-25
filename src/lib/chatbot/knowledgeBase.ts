import {
  ICredential,
  IExperience,
  IProject,
  IPublication,
  ISkill,
  ISkillView,
} from "../../../data/data.type";
import { calculateExperience } from "@/utils/dateFunctions";
import { KnowledgeBase, SkillGroup } from "./types";
import { deriveGroups, sortViews } from "@/lib/skills/deriveViews";
import {
  CAREER_START_DATE,
  PROFILE_AVAILABILITY,
  PROFILE_BIO,
  PROFILE_CONTACT,
  PROFILE_FULL_NAME,
  PROFILE_LOCATION,
  PROFILE_NAME,
  PROFILE_TITLE,
} from "./staticProfile";

export interface RawChatData {
  experiences?: (IExperience & { id: string })[];
  projects?: (IProject & { id: string })[];
  credentials?: (ICredential & { id: string })[];
  publications?: (IPublication & { id: string })[];
  skills?: (ISkill & { id: string })[];
  skillViews?: (ISkillView & { id: string })[];
  resumeUrl?: string | null;
  isDataLoading: boolean;
  hasDataError: boolean;
}

// The chatbot presents skills grouped like the homepage's primary view: the
// one keyed "language" if present, otherwise the lowest-ordered view.
function primaryView(views: ISkillView[]): ISkillView | null {
  if (!views.length) return null;
  return views.find((v) => v.key === "language") ?? sortViews(views)[0];
}

/**
 * Builds the flattened, defensive knowledge base the retrieval engine reads
 * from. Every field is guaranteed to be a concrete value (never undefined)
 * so downstream response builders never need optional chaining gymnastics.
 */
export function buildKnowledgeBase(raw: RawChatData): KnowledgeBase {
  const skills = Array.isArray(raw.skills) ? raw.skills : [];
  const views = Array.isArray(raw.skillViews) ? raw.skillViews : [];
  const view = primaryView(views);

  const skillGroups: SkillGroup[] = view
    ? deriveGroups(skills, view).map((g) => ({
        title: g.title,
        caption: g.caption,
        items: g.items.map((s) => s.label),
      }))
    : [];

  const activeSkills = skills.filter((s) => s.active !== false);

  return {
    name: PROFILE_NAME,
    fullName: PROFILE_FULL_NAME,
    title: PROFILE_TITLE,
    bio: PROFILE_BIO,
    location: PROFILE_LOCATION,
    yearsOfExperience: calculateExperience(CAREER_START_DATE),
    availability: PROFILE_AVAILABILITY,
    contact: PROFILE_CONTACT,
    resumeUrl: raw.resumeUrl ?? null,
    skillGroups,
    allSkillNames: activeSkills.map((s) => s.label),
    skills: activeSkills.map((s) => ({
      label: s.label,
      aliases: Array.isArray(s.aliases) ? s.aliases : [],
    })),
    experiences: Array.isArray(raw.experiences) ? raw.experiences : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    credentials: Array.isArray(raw.credentials) ? raw.credentials : [],
    publications: Array.isArray(raw.publications) ? raw.publications : [],
    isDataLoading: Boolean(raw.isDataLoading),
    hasDataError: Boolean(raw.hasDataError),
  };
}
