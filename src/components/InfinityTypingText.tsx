"use client";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const titles = [
  "Full-Stack Web Developer ",
  "MERN Stack Engineer",
  "Blockchain Solutions Architect",
  "Smart Contract & DeFi Developer",
];

export default function InfinityTypingText() {
  const [text, setText] = useState(""); // Stores the currently typed text
  const [index, setIndex] = useState(0); // Tracks the current title
  const [isDeleting, setIsDeleting] = useState(false); // Determines if deleting or typing
  const [charIndex, setCharIndex] = useState(0); // Tracks character position in current title
  const theme = useAppTheme();

  useEffect(() => {
    const currentTitle = titles[index];

    const typingSpeed = isDeleting ? 30 : 60; // Speed up deleting, slow down typing
    const delayBeforeDeleting = 1000; // Delay before starting to delete

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing logic
        setText(currentTitle.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex + 1 === currentTitle.length) {
          setTimeout(() => setIsDeleting(true), delayBeforeDeleting); // Pause before deleting
        }
      } else {
        // Deleting logic
        setText(currentTitle.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % titles.length); // Move to next title
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout); // Cleanup function to avoid memory leaks
  }, [charIndex, isDeleting, index]);

  return (
    <Box
      sx={{
        border: `2px solid ${theme.palette.secondary.main}`, // Border color from theme
        borderRadius: "12px", // Rounded corners
        padding: 2, // Add some padding for better appearance
        display: "inline-block", // Prevent full-width stretching
        width: { xs: "100%", md: "50%" },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "20px", sm: "24px", md: "32px" }, // Responsive font size
          fontWeight: "medium",
        }}
      >
        I am a{" "}
      </Typography>
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "28px", sm: "36px", md: "48px" }, // Responsive font size
          fontWeight: "bold",
        }}
      >
        {text}
        <span style={{ color: "#ff5733" }}>|</span> {/* Blinking cursor */}
      </Typography>
    </Box>
  );
}
