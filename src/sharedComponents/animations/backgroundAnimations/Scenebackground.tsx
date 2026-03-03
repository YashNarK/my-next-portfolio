"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MovingStars from "./MovingStars";
import LiquidEther from "./LiquidEther";

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

  // Light mode: LiquidEther fluid simulation (manages its own Three.js renderer)
  return (
    <LiquidEther
      mouseForce={30}
      cursorSize={150}
      isViscous={false}
      viscous={30}
      colors={["#5227FF", "#FF9FFC", "#B19EEF", "#a1f406"]}
      autoDemo
      autoSpeed={0.5}
      autoIntensity={2.2}
      isBounce
      resolution={0.5}
      autoResumeDelay={2500}
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


