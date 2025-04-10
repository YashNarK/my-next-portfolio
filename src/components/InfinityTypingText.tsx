"use client";
import { useEffect, useState } from "react";

const titles = [
  "MERN Fullstack Developer",
  "Blockchain Solutions Architect",
  "Smart Contract & DeFi Developer",
];

export default function InfinityTypingText() {
  const [text, setText] = useState(""); // Stores the currently typed text
  const [index, setIndex] = useState(0); // Tracks the current title
  const [isDeleting, setIsDeleting] = useState(false); // Determines if deleting or typing
  const [charIndex, setCharIndex] = useState(0); // Tracks character position in current title

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
    <span>
      &nbsp;
      {text}
      <span style={{ color: "#ff5733" }}>|</span>
    </span>
  );
}
