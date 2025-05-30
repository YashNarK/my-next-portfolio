"use client";
import { useRef, useState, useEffect, createRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

const BUBBLE_COUNT = 5;
const RADIUS = 0.8;
const BOUNDARY = 3; // X and Y limits for simplicity
const VELOCITY_FACTOR = 0.01; // Adjust for speed
const colors = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6FCF",
  "#845EC2",
  "#00C9A7",
  "#FFC75F",
  "#F9F871",
  "#FF9671",
];

type Bubble = {
  position: [number, number];
  velocity: [number, number];
  color: string;
};

export const FloatingBubbles = () => {
  const meshRefs = useRef<React.RefObject<Mesh | null>[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    meshRefs.current = Array.from({ length: BUBBLE_COUNT }, () =>
      createRef<Mesh>()
    );

    const initialBubbles = Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      position: [
        Math.random() * BOUNDARY * 2 - BOUNDARY,
        Math.random() * BOUNDARY * 2 - BOUNDARY,
      ] as [number, number],
      velocity: [
        Math.random() * VELOCITY_FACTOR,
        Math.random() * VELOCITY_FACTOR,
      ] as [number, number],
      color: colors[i % colors.length],
    }));

    setBubbles(initialBubbles);
  }, []);

  useFrame(() => {
    setBubbles((prev) =>
      prev.map((bubble, i) => {
        let [x, y] = bubble.position;
        let [vx, vy] = bubble.velocity;

        // Update position
        x += vx;
        y += vy;

        // Bounce off X and Y boundaries
        if (x > BOUNDARY || x < -BOUNDARY) vx *= -1;
        if (y > BOUNDARY || y < -BOUNDARY) vy *= -1;

        // Update mesh position
        meshRefs.current[i]?.current?.position.set(x, y, 0);

        return {
          ...bubble,
          position: [x, y],
          velocity: [vx, vy],
        };
      })
    );
  });

  return (
    <>
      <color attach="background" args={["#FFFFFF"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {bubbles.map((bubble, i) => (
        <mesh
          key={i}
          ref={meshRefs.current[i]}
          position={[...bubble.position, 0]}
        >
          <sphereGeometry args={[RADIUS, 32, 32]} />
          <meshStandardMaterial
            color={bubble.color}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
};

export default FloatingBubbles;
