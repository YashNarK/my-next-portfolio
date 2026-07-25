// Single source of truth for the facts about Narendran that are NOT stored
// in Firestore. These mirror the copy already shown elsewhere on the site
// (Banner, Contact, layout metadata) so the chatbot never contradicts the
// page it's floating on top of. Keep this in sync if that copy changes.
import { SkillGroup, ContactInfo } from "./types";

export const PROFILE_NAME = "Narendran";
export const PROFILE_FULL_NAME = "Narendran Anbalagan Indumathi";
export const PROFILE_TITLE = "Senior Full Stack Developer";

export const PROFILE_BIO =
  "Senior Full Stack Developer with 5+ years building microservices, " +
  "event-driven systems and multi-frontend architectures across the " +
  "JavaScript/TypeScript and Python ecosystems.";

export const PROFILE_LOCATION = "Chennai, Tamil Nadu, India";

export const PROFILE_AVAILABILITY =
  "Open to senior full-stack, backend & platform engineering roles. " +
  "Reach out for collaborations, freelance work, or a chat about system design.";

export const PROFILE_CONTACT: ContactInfo = {
  email: "ai.narendran@gmail.com",
  linkedin: "https://www.linkedin.com/in/narendranai/",
  github: "https://github.com/YashNarK",
  instagram: "https://www.instagram.com/narendran.a.i/",
};

/** Default start date used across the site's "years of experience" calc. */
export const CAREER_START_DATE = "2020-10-28";

export interface SkillEntry {
  label: string;
  group: string;
  /** Extra normalized phrases that should also resolve to this skill. */
  aliases: string[];
}

// Mirrors src/components/homePageComponents/SkillMatrix.tsx's `byLanguage`
// grouping — the canonical skill list shown on the homepage.
export const SKILLS: SkillEntry[] = [
  { label: "TypeScript", group: "JavaScript / TypeScript", aliases: ["typescript", "ts"] },
  { label: "JavaScript", group: "JavaScript / TypeScript", aliases: ["javascript", "js", "ecmascript", "es6"] },
  { label: "React", group: "JavaScript / TypeScript", aliases: ["react", "reactjs", "react.js"] },
  { label: "Next.js", group: "JavaScript / TypeScript", aliases: ["next.js", "nextjs", "next"] },
  { label: "Redux", group: "JavaScript / TypeScript", aliases: ["redux", "redux toolkit"] },
  { label: "Node.js", group: "JavaScript / TypeScript", aliases: ["node.js", "nodejs", "node"] },
  { label: "Express", group: "JavaScript / TypeScript", aliases: ["express", "express.js", "expressjs"] },
  { label: "GraphQL", group: "JavaScript / TypeScript", aliases: ["graphql", "graph ql"] },
  { label: "REST API", group: "JavaScript / TypeScript", aliases: ["rest api", "restapi", "rest"] },
  { label: "BullMQ", group: "JavaScript / TypeScript", aliases: ["bullmq", "bull mq", "bull queue"] },
  { label: "Python", group: "Python", aliases: ["python", "py"] },
  { label: "FastAPI", group: "Python", aliases: ["fastapi", "fast api"] },
  { label: "LLM", group: "AI / GenAI", aliases: ["llm", "llms", "large language model", "large language models", "gpt", "language model"] },
  { label: "LangChain", group: "AI / GenAI", aliases: ["langchain", "lang chain"] },
  { label: "LangGraph", group: "AI / GenAI", aliases: ["langgraph", "lang graph"] },
  { label: "RAG", group: "AI / GenAI", aliases: ["rag", "retrieval augmented generation", "retrieval-augmented generation"] },
  { label: "PostgreSQL", group: "Databases & Cloud", aliases: ["postgresql", "postgres", "psql"] },
  { label: "SQL Server", group: "Databases & Cloud", aliases: ["sql server", "sqlserver", "mssql", "ms sql"] },
  { label: "MongoDB", group: "Databases & Cloud", aliases: ["mongodb", "mongo"] },
  { label: "BigQuery", group: "Databases & Cloud", aliases: ["bigquery", "big query"] },
  { label: "Redis", group: "Databases & Cloud", aliases: ["redis"] },
  { label: "Docker", group: "Databases & Cloud", aliases: ["docker", "dockerized", "containerization"] },
  { label: "Azure", group: "Databases & Cloud", aliases: ["azure", "azure devops", "microsoft azure"] },
  { label: "GCP", group: "Databases & Cloud", aliases: ["gcp", "google cloud", "google cloud platform"] },
  { label: "Apache AGE", group: "Databases & Cloud", aliases: ["apache age", "age", "apacheage", "a graph extension"] },
];

export function buildSkillGroups(): SkillGroup[] {
  const order: string[] = [];
  const byGroup = new Map<string, string[]>();
  for (const skill of SKILLS) {
    if (!byGroup.has(skill.group)) {
      byGroup.set(skill.group, []);
      order.push(skill.group);
    }
    byGroup.get(skill.group)!.push(skill.label);
  }
  return order.map((title) => ({ title, items: byGroup.get(title)! }));
}
