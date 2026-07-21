"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { ChatMessage } from "@/lib/chatbot/types";

const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const theme = useTheme();
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        px: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "82%",
          px: 1.5,
          py: 1,
          borderRadius: 2,
          borderTopRightRadius: isUser ? 4 : 2,
          borderTopLeftRadius: isUser ? 2 : 4,
          backgroundColor: isUser
            ? theme.palette.secondary.main
            : theme.palette.background.paper,
          color: isUser
            ? theme.palette.getContrastText(theme.palette.secondary.main)
            : theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="professional"
          sx={{
            display: "block",
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            fontSize: "0.88rem",
            lineHeight: 1.55,
          }}
        >
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatMessageBubble;
