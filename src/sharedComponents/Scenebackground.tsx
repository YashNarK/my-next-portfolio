"use client";

import { useAppTheme } from "@/hooks/useAppTheme"; // Adjust to your actual theme hook
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MovingStars from "./MovingStars";
import FloatingBubbles from "./FloatingBubbles";

export default function SceneBackground() {
  const theme = useAppTheme(); // Must return 'light' or 'dark'
  const mode = theme.palette.mode;
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        background: "black", // <-- This is critical for Stars to show
      }}
      camera={{ position: [0, 0, 1] }}
    >
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        {mode === "dark" ? <MovingStars /> : <FloatingBubbles />}
      </Suspense>
    </Canvas>
  );
}
