import { ICredential, IExperience, IProject, IPublication } from "../../../data/data.type";
import { calculateExperience } from "@/utils/dateFunctions";
import { KnowledgeBase } from "./types";
import {
  buildSkillGroups,
  CAREER_START_DATE,
  PROFILE_AVAILABILITY,
  PROFILE_BIO,
  PROFILE_CONTACT,
  PROFILE_FULL_NAME,
  PROFILE_LOCATION,
  PROFILE_NAME,
  PROFILE_TITLE,
  SKILLS,
} from "./staticProfile";

export interface RawChatData {
  experiences?: (IExperience & { id: string })[];
  projects?: (IProject & { id: string })[];
  credentials?: (ICredential & { id: string })[];
  publications?: (IPublication & { id: string })[];
  resumeUrl?: string | null;
  isDataLoading: boolean;
  hasDataError: boolean;
}

/**
 * Builds the flattened, defensive knowledge base the retrieval engine reads
 * from. Every field is guaranteed to be a concrete value (never undefined)
 * so downstream response builders never need optional chaining gymnastics.
 */
export function buildKnowledgeBase(raw: RawChatData): KnowledgeBase {
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
    skillGroups: buildSkillGroups(),
    allSkillNames: SKILLS.map((s) => s.label),
    experiences: Array.isArray(raw.experiences) ? raw.experiences : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    credentials: Array.isArray(raw.credentials) ? raw.credentials : [],
    publications: Array.isArray(raw.publications) ? raw.publications : [],
    isDataLoading: Boolean(raw.isDataLoading),
    hasDataError: Boolean(raw.hasDataError),
  };
}
