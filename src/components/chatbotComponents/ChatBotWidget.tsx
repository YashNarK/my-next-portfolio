"use client";

import { useEffect } from "react";
import { Badge, Box, Fab, Paper, useMediaQuery, useTheme, Zoom } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useChatBot from "@/hooks/useChatBot";
import ChatWindow from "./ChatWindow";

const TITLE_ID = "chatbot-window-title";

const ChatBotWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isOpen, toggle, close, messages, sendMessage, isDataLoading } = useChatBot();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 16, sm: 24 },
        bottom: { xs: 16, sm: 24 },
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1.5,
      }}
    >
      <Zoom in={isOpen} unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            width: isMobile ? "min(92vw, 360px)" : 360,
            height: isMobile ? "min(70vh, 520px)" : 480,
            overflow: "hidden",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            onClose={close}
            isDataLoading={isDataLoading}
            titleId={TITLE_ID}
          />
        </Paper>
      </Zoom>

      <Badge color="secondary" variant="dot" invisible={isOpen || messages.length > 0}>
        <Fab
          color="primary"
          onClick={toggle}
          aria-label={isOpen ? "Close chat" : "Chat with Narendran's portfolio assistant"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {isOpen ? <CloseRoundedIcon /> : <ChatBubbleOutlineRoundedIcon />}
        </Fab>
      </Badge>
    </Box>
  );
};

export default ChatBotWidget;
