"use client";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import MovingStars from "./MovingStars";
// LiquidEther kept for future use
// import LiquidEther from "./LiquidEther";
import ConstellationBackground from "./ConstellationBackground";

function getNodeCount(width: number) {
  if (width < 768) return 15;   // mobile
  if (width < 1024) return 20;  // tablet
  return 40;                    // laptop+
}

export default function SceneBackground() {
  const theme = useAppTheme();
  const mode = theme.palette.mode;

  const [nodeCount, setNodeCount] = useState(() =>
    typeof window === "undefined" ? 40 : getNodeCount(window.innerWidth)
  );

  useEffect(() => {
    const update = () => setNodeCount(getNodeCount(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
      lineColor="rgb(233, 11, 48)"
      count={nodeCount}
      connectionDistance={250}
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
