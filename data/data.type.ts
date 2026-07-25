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

interface IProject {
  title: string;
  description: string;
  technologiesUsed: string[];
  image?: string | File;
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

interface INote {
  title: string;
  content: string;
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
  ICredential,
  IPublication,
  IExperience,
  INote,
  ISkill,
  ISkillView,
  ISkillCategory,
};
