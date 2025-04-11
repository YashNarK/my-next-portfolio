"use client";

import { useAppSelector } from "@/hooks/useReduxCustom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Mouse = { x: number; y: number };

const Star = ({ radiusX, radiusY, speed, color, centerRef }: any) => {
  const starRef = useRef<THREE.Mesh>(null!);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    if (!centerRef.current) return;

    angleRef.current += speed;
    const angle = angleRef.current;
    const center = centerRef.current.position;

    starRef.current.position.set(
      center.x + radiusX * Math.cos(angle),
      center.y + radiusY * Math.sin(angle),
      0
    );
  });

  return (
    <mesh ref={starRef}>
      <circleGeometry args={[0.05, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const BlackHoleScene = ({ mouse }: { mouse: Mouse }) => {
  const blackHoleRef = useRef<THREE.Mesh>(null!);
  const { size, camera } = useThree();
  const mode = useAppSelector((state) => state.theme.mode);

  useFrame(() => {
    if (!blackHoleRef.current) return;

    const ndcX = (mouse.x / size.width) * 2 - 1;
    const ndcY = -(mouse.y / size.height) * 2 + 1;
    const vector = new THREE.Vector3(ndcX, ndcY, 0).unproject(camera);
    blackHoleRef.current.position.lerp(vector, 0.3);
  });

  return (
    <>
      <mesh ref={blackHoleRef}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Orbiting stars */}
      <Star
        radiusX={0.4}
        radiusY={0.2}
        speed={0.05}
        color={mode === "dark" ? "yellow" : "orange"}
        centerRef={blackHoleRef}
      />
      <Star
        radiusX={0.3}
        radiusY={0.4}
        speed={0.03}
        color={mode === "dark" ? "white" : "darkgreen"}
        centerRef={blackHoleRef}
      />
      <Star
        radiusX={0.5}
        radiusY={0.3}
        speed={0.07}
        color={mode === "dark" ? "skyblue" : "blue"}
        centerRef={blackHoleRef}
      />
    </>
  );
};

const BlackHoleCursor = () => {
  const [mouse, setMouse] = useState<Mouse>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    const detectTouch = () => {
      if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        setIsTouchDevice(true);
      }
    };

    window.addEventListener("mousemove", updateMouse);
    detectTouch();

    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      className="blackhole-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // This allows clicks to pass through
      }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 100, position: [0, 0, 10] }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <BlackHoleScene mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default BlackHoleCursor;
