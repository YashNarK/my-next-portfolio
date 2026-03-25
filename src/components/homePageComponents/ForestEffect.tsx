"use client";
import React from "react";

interface ForestEffectProps {
  text: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  fontSize?: string | number;
  letterSpacing?: string | number;
}

/**
 * ForestEffect renders a row of letters with the animated hover scaling effect from the Forest concept.
 * - text: the string to display (each letter is animated)
 * - width/height: container size (default: 100%)
 * - color: text color (default: #fff)
 * - fontSize: font size (default: 60px)
 */
const ForestEffect: React.FC<ForestEffectProps> = ({
  text,
  width,
  height,
  color = "#fff",
  fontSize = 60,
  letterSpacing = "0.12em",
}) => {
  return (
    <span
      className="forest-effect-root"
      style={{
        width,
        height,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: 0,
        background: "transparent",
      }}
    >
      {Array.from(text).map((char, idx) =>
        char === " " ? (
          <span
            key={"space-" + idx}
            style={{
              display: "inline-block",
              minWidth: typeof fontSize === "number" ? fontSize * 0.4 : "0.6em",
              width: typeof fontSize === "number" ? fontSize * 0.4 : "0.6em",
              height: typeof fontSize === "number" ? fontSize : fontSize,
            }}
            aria-hidden="true"
          >
            &nbsp;
          </span>
        ) : (
          <span
            className="forest-hover"
            key={idx}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 0,
              padding: 0,
            }}
          >
            <span
              className="forest-letter"
              style={{
                color,
                fontSize,
                fontWeight: 500,
                fontFamily: "Montserrat, Comfortaa, sans-serif",
                WebkitTextStroke: `2px ${color}`,
                textShadow: "none",
                transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
                userSelect: "none",
                display: "inline-block",
                letterSpacing,
                margin: 0,
                padding: 0,
              }}
            >
              {char}
            </span>
          </span>
        ),
      )}
      <style jsx>{`
        .forest-letter {
          color: transparent;
          -webkit-text-stroke: 2px ${color};
          text-shadow: none;
          transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .forest-hover:hover .forest-letter {
          transform: scale(3) rotate(-9deg);
          color: ${color};
          -webkit-text-stroke: 2px transparent;
          text-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </span>
  );
};

export default ForestEffect;
