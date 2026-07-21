// Pure string-template builders. Every function here reads ONLY from the
// KnowledgeBase (or an entity pulled from it) — nothing is invented, so the
// bot can never say something that isn't backed by real profile data.
import { ICredential, IExperience, IProject, IPublication } from "../../../data/data.type";
import { localeDate } from "@/utils/dateFunctions";
import { KnowledgeBase } from "./types";

function safeDate(value?: string): string {
  if (!value) return "an unspecified date";
  try {
    const formatted = localeDate(value, "MMMM, YYYY");
    return formatted && formatted !== "Invalid Date" ? formatted : value;
  } catch {
    return value;
  }
}

function formatDateRange(exp: IExperience): string {
  const start = safeDate(exp.startDate);
  if (exp.isCurrent) return `${start} – Present`;
  if (exp.endDate) return `${start} – ${safeDate(exp.endDate)}`;
  return start;
}

export function greetingResponse(kb: KnowledgeBase): string {
  return (
    `Hey! I'm ${kb.name}'s portfolio assistant. Ask me about my experience, ` +
    `projects, skills, credentials, publications, or how to get in touch. ` +
    `Type "help" any time to see everything I can answer.`
  );
}

export function aboutResponse(kb: KnowledgeBase): string {
  return (
    `${kb.bio} I'm based in ${kb.location}, with ${kb.yearsOfExperience} of ` +
    `professional experience as a ${kb.title}.`
  );
}

export function yearsExperienceResponse(kb: KnowledgeBase): string {
  return `I have ${kb.yearsOfExperience} of professional experience.`;
}

export function locationResponse(kb: KnowledgeBase): string {
  return `I'm based in ${kb.location}.`;
}

export function availabilityResponse(kb: KnowledgeBase): string {
  return kb.availability;
}

export function contactResponse(kb: KnowledgeBase): string {
  return (
    `You can reach me at:\n` +
    `• Email: ${kb.contact.email}\n` +
    `• LinkedIn: ${kb.contact.linkedin}\n` +
    `• GitHub: ${kb.contact.github}\n` +
    `• Instagram: ${kb.contact.instagram}\n` +
    `• Location: ${kb.location}`
  );
}

export function resumeResponse(kb: KnowledgeBase): string {
  if (kb.resumeUrl) {
    return `Here's my résumé: ${kb.resumeUrl}`;
  }
  return (
    `A résumé link isn't configured on the site right now — email me at ` +
    `${kb.contact.email} and I'll send it straight over.`
  );
}

export function skillsListResponse(kb: KnowledgeBase): string {
  const lines = kb.skillGroups.map(
    (g) => `• ${g.title}: ${g.items.join(", ")}`
  );
  return `Here's my toolkit, grouped by area:\n${lines.join("\n")}`;
}

export function skillConfirmResponse(
  skillLabel: string,
  usage: { projectTitles: string[]; experienceTitles: string[] }
): string {
  const parts: string[] = [`Yes — ${skillLabel} is part of my toolkit.`];
  if (usage.experienceTitles.length > 0) {
    parts.push(`I've used it professionally in: ${usage.experienceTitles.join(", ")}.`);
  }
  if (usage.projectTitles.length > 0) {
    parts.push(`It also shows up in these projects: ${usage.projectTitles.join(", ")}.`);
  }
  return parts.join(" ");
}

function experienceLine(exp: IExperience): string {
  return `• ${exp.title} — ${exp.companyOrInstitution}, ${exp.location} (${formatDateRange(exp)})`;
}

export function experienceListResponse(kb: KnowledgeBase): string {
  const work = kb.experiences
    .filter((e) => e.type === "work")
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  if (work.length === 0) {
    return "I don't have any work experience listed on the site yet — ask me again soon, or reach out directly.";
  }
  const lines = work.map(experienceLine);
  return `Here's my work history, most recent first:\n${lines.join("\n")}\n\nAsk me about any company by name for more detail.`;
}

export function educationListResponse(kb: KnowledgeBase): string {
  const education = kb.experiences
    .filter((e) => e.type === "education")
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  if (education.length === 0) {
    return "I don't have education details listed on the site yet.";
  }
  const lines = education.map((e) => {
    const cgpa = typeof e.cgpa === "number" ? ` — CGPA: ${e.cgpa}` : "";
    return `• ${e.title}, ${e.companyOrInstitution} (${formatDateRange(e)})${cgpa}`;
  });
  return `Here's my education:\n${lines.join("\n")}`;
}

export function experienceDetailResponse(exp: IExperience): string {
  const cgpa = typeof exp.cgpa === "number" ? `\nCGPA: ${exp.cgpa}` : "";
  return (
    `${exp.title} — ${exp.companyOrInstitution}, ${exp.location}\n` +
    `${formatDateRange(exp)}${cgpa}\n\n${exp.description}`
  );
}

export function projectsListResponse(kb: KnowledgeBase): string {
  if (kb.projects.length === 0) {
    return "No projects are published on the site yet — check back soon.";
  }
  const lines = kb.projects.map((p) => `• ${p.title} — ${p.oneLiner}`);
  return `Here's what I've built:\n${lines.join("\n")}\n\nAsk me about any project by name for more detail.`;
}

export function projectDetailResponse(project: IProject): string {
  const tech =
    project.technologiesUsed && project.technologiesUsed.length > 0
      ? `\nTech: ${project.technologiesUsed.join(", ")}`
      : "";
  const links = [
    project.demoLink ? `Demo: ${project.demoLink}` : null,
    project.sourceLink ? `Source: ${project.sourceLink}` : null,
  ].filter(Boolean);
  const linkLine = links.length > 0 ? `\n${links.join(" | ")}` : "";
  return `${project.title} — ${project.oneLiner}\n\n${project.description}${tech}${linkLine}`;
}

export function credentialsListResponse(kb: KnowledgeBase): string {
  if (kb.credentials.length === 0) {
    return "No credentials are published on the site yet.";
  }
  const lines = kb.credentials.map(
    (c) => `• ${c.title} — issued by ${c.issuedBy} (${safeDate(c.issuedDate)})`
  );
  return `Here are my certifications:\n${lines.join("\n")}\n\nAsk me about any of these by name for more detail.`;
}

export function credentialDetailResponse(credential: ICredential): string {
  const idLine = credential.credentialID
    ? `\nCredential ID: ${credential.credentialID}`
    : "";
  const linkLine = credential.link ? `\nVerify: ${credential.link}` : "";
  return (
    `${credential.title} — issued by ${credential.issuedBy} on ${safeDate(credential.issuedDate)}\n\n` +
    `${credential.description}${idLine}${linkLine}`
  );
}

export function publicationsListResponse(kb: KnowledgeBase): string {
  if (kb.publications.length === 0) {
    return "No publications are listed on the site yet.";
  }
  const lines = kb.publications.map(
    (p) => `• ${p.title} — ${p.publisher} (${safeDate(p.date)})`
  );
  return `Here are my publications:\n${lines.join("\n")}\n\nAsk me about any of these by name for more detail.`;
}

export function publicationDetailResponse(publication: IPublication): string {
  const linkLine = publication.link ? `\nLink: ${publication.link}` : "";
  return (
    `${publication.title} — ${publication.publisher} (${safeDate(publication.date)})\n\n` +
    `${publication.description}${linkLine}`
  );
}

export function helpResponse(): string {
  return (
    `I can answer questions about:\n` +
    `• My background & summary\n` +
    `• Work experience & education\n` +
    `• Skills & tech stack (ask about a specific one, e.g. "do you know Docker?")\n` +
    `• Projects (ask about one by name)\n` +
    `• Credentials & certifications\n` +
    `• Publications\n` +
    `• Contact info, résumé, location & availability\n\n` +
    `Just ask naturally — e.g. "What have you worked on at Accenture?" or "Show me your projects."`
  );
}

export function fallbackResponse(): string {
  return (
    `I couldn't find anything about that in my profile. Try asking about my ` +
    `experience, projects, skills, credentials, publications, or how to reach me. ` +
    `Type "help" any time to see the full list of topics.`
  );
}

export function loadingNoticeResponse(): string {
  return "I'm still syncing the latest data from the site — give me a second and ask again.";
}

export function thanksResponse(): string {
  return "You're welcome! Let me know if there's anything else you'd like to know.";
}

export function goodbyeResponse(kb: KnowledgeBase): string {
  return `Thanks for stopping by! Feel free to reach out at ${kb.contact.email} anytime.`;
}

export function emptyInputResponse(): string {
  return "Go ahead and type a question — I'm listening.";
}
