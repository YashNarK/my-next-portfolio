import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Points } from "three";

function MovingStars() {
  const points = useRef<Points>(null);

  // Create random positions once
  const starPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 400;
      const y = (Math.random() - 0.5) * 400;
      const z = Math.random() * -500;
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, []);
  useFrame(() => {
    if (!points.current) return;

    const positions = points.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] += 1;
      if (positions[i + 2] > 10) {
        positions[i + 2] = -500;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]} // ✅ Pass `args` instead of individual props
        />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.5} sizeAttenuation />
    </points>
  );
}

export default MovingStars;
