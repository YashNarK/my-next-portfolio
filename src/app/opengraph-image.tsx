import { ImageResponse } from "next/og";

export const alt = "Narendran A I — Senior Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated 1200x630 social card, matching the site's dark cosmic theme.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          background:
            "radial-gradient(1100px 700px at 82% 18%, #2a1e57 0%, #120f26 45%, #08060f 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 26,
              letterSpacing: 4,
              color: "#B19EEF",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#5227FF",
              }}
            />
            PORTFOLIO
          </div>
          <div
            style={{
              fontSize: 98,
              fontWeight: 800,
              marginTop: 28,
              lineHeight: 1.02,
            }}
          >
            Narendran A I
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              marginTop: 14,
              color: "#e7e1ff",
            }}
          >
            Senior Full Stack Developer
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#88ecd0" }}>
            React · Next.js · Node.js · Python · FastAPI · Docker
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8a8aa6" }}>
            www.narendranai.work
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
