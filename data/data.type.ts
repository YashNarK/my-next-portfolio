type myVersionControlTechnologies = "Git" | "GitHub" | "GitLab";
type myLanguages = "JavaScript" | "TypeScript" | "Python" | "Solidity";
type myFrontEndTechnologies =
  | "React"
  | "Redux"
  | "Next.js"
  | "Tailwind CSS"
  | "Chakra UI"
  | "Material UI"
  | "Zustand"
  | "Vite";
type myBackEndTechnologies = "Node.js" | "Express" | "FastAPI" | "BullMQ";
type myDatabasetechnologies =
  | "MongoDB"
  | "MySQL"
  | "PostgreSQL"
  | "CosmoDB"
  | "SQL Server"
  | "Redis"
  | "BigQuery";
type myDevOpsTechnologies = "Docker" | "Azure DevOps" | "GCP" | "Azure";
type myAPItechnologies = "GraphQL" | "REST API" | "Web3 API";
type myBlockchainTechnologies = "Ethereum" | "Polygon" | "Hyperledger Fabric";
type mySkills = "Web Development" | "Blockchain Development";

type myTechnologies =
  | myLanguages
  | myFrontEndTechnologies
  | myBackEndTechnologies
  | myDatabasetechnologies
  | myAPItechnologies
  | myDevOpsTechnologies
  | myBlockchainTechnologies
  | mySkills
  | myVersionControlTechnologies;

// A single screenshot of the running product. `caption` is what an interviewer
// reads under the image, so it should name the capability on screen rather than
// describe the picture ("Hybrid search over the agronomic KB", not "search page").
interface IProjectShot {
  url: string;
  caption?: string;
}

interface IProject {
  title: string;
  description: string;
  technologiesUsed: string[];
  /** Primary/hero screenshot. Kept for back-compat; also seeds `gallery`. */
  image?: string | File;
  /** Additional screenshots of the working app, captured from `demoLink`. */
  gallery?: IProjectShot[];
  demoLink: string;
  sourceLink: string;
  potrait?: string | File;
  oneLiner: string;
}

interface ICredential {
  title: string;
  description: string;
  image: string | File;
  link: string;
  issuedDate: string;
  issuedBy: string;
  credentialID: string;
  order?: number;
}

interface IPublication {
  title: string;
  description: string;
  date: string;
  link: string;
  publisher: string;
  audio?: string | File;
}

interface IExperience {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  companyOrInstitution: string;
  cgpa?: number;
  location: string;
  type: "work" | "education";
  order?: number;
}

// A scratch note kept in the admin clipboard. `category` is a free-form label
// (e.g. "Snippets", "Credentials") used only to group and filter the list —
// it is optional so notes saved before categories existed keep working, and
// anything without one is surfaced as "Uncategorized".
interface INote {
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// An engineering problem worth remembering: what broke, why it was hard to
// see, and what fixed it. Grouped by `category` (the broad area, e.g.
// "LangGraph") and `subCategory` (the kind of problem within it, e.g.
// "State Management"), so the list can be filtered from either direction.
interface IChallenge {
  category: string;
  subCategory: string;
  title: string;
  description: string; // markdown-ish prose; newlines are preserved on render
  codeExample?: string; // optional snippet — the fix, or the failing shape
  referenceUrls?: string[]; // docs, issues, specs that informed the answer
  order?: number; // manual ordering within a category
  createdAt: string;
  updatedAt: string;
}

// A view/dimension is one way of grouping skills (e.g. "By Language",
// "By Layer"). Each view owns the ordered list of categories skills can
// belong to under that view, plus per-category presentation (caption, accent).
interface ISkillCategory {
  value: string; // group title, referenced by ISkill.categories[viewKey]
  caption?: string; // e.g. "full-stack"
  order: number; // position of this group within the view
  accent?: string; // optional hex accent; falls back to a palette by index
}

interface ISkillView {
  key: string; // stable slug used as ISkill.categories key, e.g. "language"
  title: string; // toggle label, e.g. "By Language"
  order: number; // position of the view in the toggle group
  categories: ISkillCategory[];
}

// A single skill. `categories` maps a view key -> the category value it sits
// in for that view, so one skill auto-places itself across every view. New
// views (graph/3D/...) reuse the same docs; only a new ISkillView is needed.
interface ISkill {
  key: string; // stable slug, e.g. "react"
  label: string; // display label, e.g. "React"
  iconUrl: string; // Firebase Storage URL of the monochrome SVG silhouette
  categories: Record<string, string>; // viewKey -> category value
  categoryOrder?: Record<string, number>; // viewKey -> order within its group
  order?: number; // global fallback ordering
  aliases?: string[]; // extra phrases the chatbot resolves to this skill
  level?: number; // optional proficiency (future visuals)
  tags?: string[]; // freeform, future views
  active?: boolean; // hidden everywhere when false
}

export type {
  myTechnologies,
  IProject,
  IProjectShot,
  ICredential,
  IPublication,
  IExperience,
  INote,
  IChallenge,
  ISkill,
  ISkillView,
  ISkillCategory,
};
