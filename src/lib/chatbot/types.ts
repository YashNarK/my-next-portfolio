import { ICredential, IExperience, IProject, IPublication } from "../../../data/data.type";

export interface SkillGroup {
  title: string;
  caption?: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  instagram: string;
}

export interface KnowledgeBase {
  name: string;
  fullName: string;
  title: string;
  bio: string;
  location: string;
  yearsOfExperience: string;
  availability: string;
  contact: ContactInfo;
  resumeUrl: string | null;
  skillGroups: SkillGroup[];
  allSkillNames: string[];
  experiences: (IExperience & { id: string })[];
  projects: (IProject & { id: string })[];
  credentials: (ICredential & { id: string })[];
  publications: (IPublication & { id: string })[];
  /** True while any of the underlying Firestore collections are still loading. */
  isDataLoading: boolean;
  /** True if any of the underlying Firestore collections failed to load. */
  hasDataError: boolean;
}

export type ChatRole = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
}

export interface BotAnswer {
  text: string;
  intentId: string;
}
