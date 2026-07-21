import { includesWord } from "./textUtils";

export type GenericIntentId =
  | "greeting"
  | "thanks"
  | "goodbye"
  | "help"
  | "about"
  | "currentRole"
  | "experienceList"
  | "educationList"
  | "skillsList"
  | "projectsList"
  | "credentialsList"
  | "publicationsList"
  | "contact"
  | "resume"
  | "location"
  | "yearsExperience"
  | "availability";

interface GenericIntent {
  id: GenericIntentId;
  /** Ordered, most specific first — used to break ties. */
  phrases: string[];
}

// Order matters only for tie-breaking (first declared wins on equal score),
// so the more specific / narrower intents are declared before broader ones.
export const GENERIC_INTENTS: GenericIntent[] = [
  {
    id: "currentRole",
    phrases: [
      "current job", "current role", "current company", "current employer",
      "where do you work now", "what do you do now", "present role",
      "working now", "right now", "currently do", "currently doing",
      "currently working", "doing now", "currently",
    ],
  },
  {
    id: "yearsExperience",
    phrases: [
      "how many years", "years of experience", "how long have you been",
      "how experienced", "total experience",
    ],
  },
  {
    id: "availability",
    phrases: [
      "available", "open to work", "hiring", "freelance",
      "looking for a job", "open to opportunities", "open for work",
      "available for hire", "for hire",
    ],
  },
  {
    id: "resume",
    phrases: [
      "resume", "résumé", "cv", "download resume", "download cv",
      "resume link", "curriculum vitae",
    ],
  },
  {
    id: "help",
    phrases: ["help", "what can you do", "what can i ask", "options", "menu", "commands", "capabilities"],
  },
  {
    id: "goodbye",
    phrases: ["bye", "goodbye", "see ya", "see you", "exit", "close chat", "later"],
  },
  {
    id: "thanks",
    phrases: ["thanks", "thank you", "appreciate it", "cheers", "ty"],
  },
  {
    id: "location",
    phrases: [
      "where are you based", "location", "which city", "based in",
      "where do you live", "where are you from", "where are you located",
      "your location", "located",
    ],
  },
  {
    id: "contact",
    phrases: [
      "contact", "email", "reach you", "get in touch", "hire you",
      "social media", "connect with you", "how to contact",
      "how can i reach", "phone number", "talk to you",
    ],
  },
  {
    id: "credentialsList",
    phrases: [
      "certifications", "certificates", "credentials", "certified",
      "badges", "professional certifications",
    ],
  },
  {
    id: "publicationsList",
    phrases: [
      "publications", "articles", "blog posts", "papers",
      "written anything", "published anything", "talks",
    ],
  },
  {
    id: "projectsList",
    phrases: [
      "projects", "portfolio projects", "what have you built",
      "show me your work", "side projects", "built anything",
      "github projects", "things you've built", "work samples",
    ],
  },
  {
    id: "skillsList",
    phrases: [
      "skills", "tech stack", "technologies", "technology stack", "tools",
      "programming languages", "what languages", "what frameworks", "stack",
      "tools of the trade", "what do you know", "expertise",
      "proficient in", "tech you use",
    ],
  },
  {
    id: "educationList",
    phrases: [
      "education", "educational background", "educational", "academic background",
      "degree", "college", "university", "studied", "qualification",
      "academic qualification", "school", "alma mater",
    ],
  },
  {
    id: "experienceList",
    phrases: [
      "experience", "work experience", "work history", "job history",
      "career history", "professional background", "previous jobs",
      "past roles", "previous companies", "where have you worked",
      "employment history", "career journey", "professional journey", "career",
    ],
  },
  {
    id: "about",
    phrases: [
      "who are you", "about you", "about yourself", "tell me about yourself",
      "introduce yourself", "who is narendran", "what do you do",
      "your background", "give me a summary", "summary", "bio",
      "tell me about narendran", "tell me more about you", "about narendran",
    ],
  },
  {
    id: "greeting",
    phrases: [
      "hi", "hello", "hey", "yo", "sup", "howdy", "good morning",
      "good afternoon", "good evening", "greetings",
    ],
  },
];

/** Phrases that signal "am I able to do X" — used to prioritize skill lookups. */
export const SKILL_QUESTION_TRIGGERS = [
  "do you know", "have you used", "worked with", "experience with",
  "familiar with", "know how to use", "proficient in", "skilled in",
  "used before", "ever used", "any experience in", "comfortable with",
  "do you use", "can you use",
];

function phraseWeight(phrase: string): number {
  return phrase.split(" ").length;
}

/** Returns the id of the best-scoring generic intent, or null if nothing matched. */
export function scoreGenericIntents(
  query: string,
  onlyIds?: GenericIntentId[]
): GenericIntentId | null {
  let bestId: GenericIntentId | null = null;
  let bestScore = 0;
  const pool = onlyIds
    ? GENERIC_INTENTS.filter((i) => onlyIds.includes(i.id))
    : GENERIC_INTENTS;

  for (const intent of pool) {
    let score = 0;
    for (const phrase of intent.phrases) {
      if (includesWord(query, phrase)) score += phraseWeight(phrase);
    }
    if (score > bestScore) {
      bestScore = score;
      bestId = intent.id;
    }
  }
  return bestId;
}

export function hasSkillQuestionTrigger(query: string): boolean {
  return SKILL_QUESTION_TRIGGERS.some((trigger) => includesWord(query, trigger));
}
