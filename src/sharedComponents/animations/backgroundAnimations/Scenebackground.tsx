"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MovingStars from "./MovingStars";
// LiquidEther kept for future use
// import LiquidEther from "./LiquidEther";
import ConstellationBackground from "./ConstellationBackground";

export default function SceneBackground() {
  const theme = useAppTheme();
  const mode = theme.palette.mode;

  // Dark mode: R3F Canvas with star field
  if (mode === "dark") {
    return (
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          background: "#000000",
        }}
        camera={{ position: [0, 0, 1], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <MovingStars />
        </Suspense>
      </Canvas>
    );
  }

  // Light mode: Constellation animation (white background, violet nodes & lines)
  return (
    <ConstellationBackground
      nodeColor="rgba(139, 92, 246, 1)"
      lineColor="rgba(139, 92, 246, 0.25)"
      count={100}
      connectionDistance={160}
      mouseRadius={120}
      glow
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}


