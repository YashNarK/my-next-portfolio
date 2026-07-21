"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChatMessageBubble from "./ChatMessageBubble";
import { ChatMessage } from "@/lib/chatbot/types";
import { sanitizeUserInput } from "@/lib/chatbot/textUtils";

const MAX_INPUT_LENGTH = 400;

const SUGGESTIONS: { label: string; query: string }[] = [
  { label: "Experience", query: "work experience" },
  { label: "Projects", query: "projects" },
  { label: "Skills", query: "skills" },
  { label: "Credentials", query: "certifications" },
  { label: "Contact", query: "contact" },
  { label: "Résumé", query: "resume" },
];

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
  isDataLoading: boolean;
  titleId: string;
}

const ChatWindow = ({ messages, onSend, onClose, isDataLoading, titleId }: ChatWindowProps) => {
  const theme = useTheme();
  const [draft, setDraft] = useState("");
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const clean = sanitizeUserInput(draft, MAX_INPUT_LENGTH);
    if (!clean) return;
    onSend(clean);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <Box
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <SmartToyOutlinedIcon fontSize="small" />
          <Typography id={titleId} variant="professional" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
            Ask about Narendran
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} aria-label="Close chat">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        <div ref={listEndRef} />
      </Box>

      {showSuggestions && (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.75}
          sx={{ px: 1.5, py: 1, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          {SUGGESTIONS.map((s) => (
            <Chip
              key={s.label}
              label={s.label}
              size="small"
              onClick={() => onSend(s.query)}
              sx={{ fontFamily: "var(--font-dm-mono), monospace" }}
            />
          ))}
        </Stack>
      )}

      {isDataLoading && (
        <Typography
          variant="professional"
          sx={{ px: 1.5, pt: 0.5, fontSize: "0.7rem", opacity: 0.6 }}
        >
          Syncing latest portfolio data…
        </Typography>
      )}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ p: 1.25, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <TextField
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_INPUT_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { maxLength: MAX_INPUT_LENGTH, "aria-label": "Chat message" } }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!draft.trim()}
          aria-label="Send message"
        >
          <SendRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ChatWindow;
