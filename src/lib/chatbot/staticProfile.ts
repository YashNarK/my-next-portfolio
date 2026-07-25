// Single source of truth for the facts about Narendran that are NOT stored
// in Firestore. These mirror the copy already shown elsewhere on the site
// (Banner, Contact, layout metadata) so the chatbot never contradicts the
// page it's floating on top of. Keep this in sync if that copy changes.
import { ContactInfo } from "./types";

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
