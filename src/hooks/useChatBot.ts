"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import useExperiences from "./useExperiences";
import useProjects from "./useProjects";
import useCredentials from "./useCredentials";
import usePublications from "./usePublications";
import { useResumeConfig } from "./useResumeConfig";
import useSkills from "./useSkills";
import useSkillViews from "./useSkillViews";
import { buildKnowledgeBase } from "@/lib/chatbot/knowledgeBase";
import { getBotAnswer } from "@/lib/chatbot/engine";
import { greetingResponse } from "@/lib/chatbot/responses";
import { ChatMessage } from "@/lib/chatbot/types";

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

export function useChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasGreetedRef = useRef(false);

  const { data: experiences, isLoading: experiencesLoading, error: experiencesError } = useExperiences();
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: credentials, isLoading: credentialsLoading, error: credentialsError } = useCredentials();
  const { data: publications, isLoading: publicationsLoading, error: publicationsError } = usePublications();
  const { resumeConfig, isLoading: resumeLoading } = useResumeConfig();
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useSkills();
  const { data: skillViews, isLoading: skillViewsLoading, error: skillViewsError } = useSkillViews();

  const isDataLoading =
    experiencesLoading ||
    projectsLoading ||
    credentialsLoading ||
    publicationsLoading ||
    resumeLoading ||
    skillsLoading ||
    skillViewsLoading;
  const hasDataError = Boolean(
    experiencesError ||
      projectsError ||
      credentialsError ||
      publicationsError ||
      skillsError ||
      skillViewsError
  );

  const knowledgeBase = useMemo(
    () =>
      buildKnowledgeBase({
        experiences,
        projects,
        credentials,
        publications,
        skills,
        skillViews,
        resumeUrl: resumeConfig?.urls?.[resumeConfig.activeIndex] ?? null,
        isDataLoading,
        hasDataError,
      }),
    [
      experiences,
      projects,
      credentials,
      publications,
      skills,
      skillViews,
      resumeConfig,
      isDataLoading,
      hasDataError,
    ]
  );

  const appendMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role, text, createdAt: Date.now() }]);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    if (!hasGreetedRef.current) {
      hasGreetedRef.current = true;
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          text: greetingResponse(knowledgeBase),
          createdAt: Date.now(),
        },
      ]);
    }
  }, [knowledgeBase]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const sendMessage = useCallback(
    (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;
      appendMessage("user", trimmed);
      const answer = getBotAnswer(trimmed, knowledgeBase);
      appendMessage("bot", answer.text);
    },
    [appendMessage, knowledgeBase]
  );

  const reset = useCallback(() => {
    setMessages([]);
    hasGreetedRef.current = false;
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    messages,
    sendMessage,
    reset,
    isDataLoading,
    hasDataError,
  };
}

export default useChatBot;
