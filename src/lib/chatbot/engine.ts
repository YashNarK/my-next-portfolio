// The retrieval engine. Deliberately NOT generative: every branch below
// resolves to a template in responses.ts that only reads fields already
// present on the KnowledgeBase. There is no external model call, so there
// is no hallucination surface — a wrong answer here can only mean "matched
// the wrong intent," never "invented a fact."
import { BotAnswer, KnowledgeBase } from "./types";
import { normalize, sanitizeUserInput } from "./textUtils";
import {
  GenericIntentId,
  hasSkillQuestionTrigger,
  scoreGenericIntents,
} from "./intentPatterns";
import { findUsagesOfSkill, matchBestEntity, matchSkills } from "./entityMatching";
import * as R from "./responses";

const CONTROL_INTENTS: GenericIntentId[] = ["greeting", "thanks", "goodbye", "help"];

function controlResponse(id: GenericIntentId, kb: KnowledgeBase): string {
  switch (id) {
    case "greeting":
      return R.greetingResponse(kb);
    case "thanks":
      return R.thanksResponse();
    case "goodbye":
      return R.goodbyeResponse(kb);
    case "help":
      return R.helpResponse();
    default:
      return R.fallbackResponse();
  }
}

function skillHitsResponse(
  query: string,
  kb: KnowledgeBase
): string {
  const hits = matchSkills(query);
  const lines = hits.map((hit) => {
    const usage = findUsagesOfSkill(hit.skill.label, kb.projects, kb.experiences);
    return R.skillConfirmResponse(hit.skill.label, usage);
  });
  return lines.join("\n");
}

function listResponseWithLoadingGuard(
  kb: KnowledgeBase,
  collectionLength: number,
  buildResponse: () => string
): string {
  if (kb.isDataLoading && collectionLength === 0) {
    return R.loadingNoticeResponse();
  }
  return buildResponse();
}

function currentRoleResponse(kb: KnowledgeBase): string {
  if (kb.isDataLoading && kb.experiences.length === 0) {
    return R.loadingNoticeResponse();
  }
  const current = kb.experiences.find(
    (e) => e.type === "work" && e.isCurrent
  );
  if (!current) {
    return (
      "I don't have a current role flagged on the site right now. " +
      "Ask me for my full work history instead — I can list everything I've got."
    );
  }
  return R.experienceDetailResponse(current);
}

function genericIntentResponse(id: GenericIntentId, kb: KnowledgeBase): string {
  switch (id) {
    case "currentRole":
      return currentRoleResponse(kb);
    case "yearsExperience":
      return R.yearsExperienceResponse(kb);
    case "availability":
      return R.availabilityResponse(kb);
    case "resume":
      return R.resumeResponse(kb);
    case "location":
      return R.locationResponse(kb);
    case "contact":
      return R.contactResponse(kb);
    case "credentialsList":
      return listResponseWithLoadingGuard(kb, kb.credentials.length, () =>
        R.credentialsListResponse(kb)
      );
    case "publicationsList":
      return listResponseWithLoadingGuard(kb, kb.publications.length, () =>
        R.publicationsListResponse(kb)
      );
    case "projectsList":
      return listResponseWithLoadingGuard(kb, kb.projects.length, () =>
        R.projectsListResponse(kb)
      );
    case "skillsList":
      return R.skillsListResponse(kb);
    case "educationList":
      return listResponseWithLoadingGuard(kb, kb.experiences.length, () =>
        R.educationListResponse(kb)
      );
    case "experienceList":
      return listResponseWithLoadingGuard(kb, kb.experiences.length, () =>
        R.experienceListResponse(kb)
      );
    case "about":
      return R.aboutResponse(kb);
    default:
      return R.fallbackResponse();
  }
}

function entityMatchResponse(
  query: string,
  kb: KnowledgeBase
): string | null {
  const match = matchBestEntity(query, {
    projects: kb.projects,
    experiences: kb.experiences,
    credentials: kb.credentials,
    publications: kb.publications,
  });
  if (!match) return null;

  if (match.project) return R.projectDetailResponse(match.project);
  if (match.experience) return R.experienceDetailResponse(match.experience);
  if (match.credential) return R.credentialDetailResponse(match.credential);
  if (match.publication) return R.publicationDetailResponse(match.publication);
  return null;
}

/**
 * Resolves a user query to a deterministic answer. Order of resolution:
 *   1. Empty input guard.
 *   2. Control intents (greeting / thanks / goodbye / help) — rarely
 *      ambiguous, so they always win outright.
 *   3. Explicit skill questions ("do you know Docker?") resolve against the
 *      skill list before anything else, since that phrasing is unambiguous.
 *   4. Named-entity lookups (a specific project, role, credential or
 *      publication) — the query mentions something that exists in the live
 *      Firestore data.
 *   5. Bare skill mentions ("Python?") as a fallback if nothing named matched.
 *   6. Broad topical intents (experience list, skills list, contact, etc.)
 *      via keyword scoring.
 *   7. Fallback — the bot admits it doesn't know rather than guessing.
 */
export function getBotAnswer(rawInput: string, kb: KnowledgeBase): BotAnswer {
  const query = normalize(sanitizeUserInput(rawInput));

  if (!query) {
    return { text: R.emptyInputResponse(), intentId: "emptyInput" };
  }

  const controlId = scoreGenericIntents(query, CONTROL_INTENTS);
  if (controlId) {
    return { text: controlResponse(controlId, kb), intentId: controlId };
  }

  if (hasSkillQuestionTrigger(query)) {
    const skillText = skillHitsResponse(query, kb);
    if (skillText) return { text: skillText, intentId: "skillConfirm" };
  }

  const entityText = entityMatchResponse(query, kb);
  if (entityText) {
    return { text: entityText, intentId: "entityDetail" };
  }

  const bareSkillText = skillHitsResponse(query, kb);
  if (bareSkillText) {
    return { text: bareSkillText, intentId: "skillConfirm" };
  }

  const genericId = scoreGenericIntents(query);
  if (genericId) {
    return { text: genericIntentResponse(genericId, kb), intentId: genericId };
  }

  return { text: R.fallbackResponse(), intentId: "fallback" };
}
