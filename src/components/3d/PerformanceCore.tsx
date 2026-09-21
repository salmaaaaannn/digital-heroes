"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

interface ScoreNodeProps {
  score: number;
  position: [number, number, number];
  index: number;
}

function Node({ score, position, index }: ScoreNodeProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.getElapsedTime();
      mesh.current.rotation.x = time * 0.5 + index;
      mesh.current.rotation.y = time * 0.3;
    }
  });

  const normalizedScore = score / 45;
  const color = new THREE.Color().lerpColors(
    new THREE.Color("#0f172a"), // dark blue
    new THREE.Color("#10B981"), // emerald
    normalizedScore
  );
  
  const scale = 0.4 + (normalizedScore * 0.4);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={mesh} position={position} args={[scale, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={3}
        />
      </Sphere>
    </Float>
  );
}

export function PerformanceCore({ scores }: { scores: number[] }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      // Position slightly right for dashboard composition
      group.current.position.x = 2;
      group.current.position.y = -1;
    }
  });

  // If no scores, show empty core placeholder
  const displayScores = scores.length > 0 ? scores : [0, 0, 0, 0, 0];

  return (
    <group ref={group}>
      {displayScores.map((score, idx) => {
        const angle = (idx / 5) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.5;
        
        return (
          <Node
            key={idx}
            index={idx}
            score={score || 10} // default appearance for 0
            position={[x, y, z]}
          />
        );
      })}
      
      {/* Central Energy Core */}
      <Sphere args={[0.2, 16, 16]}>
        <meshStandardMaterial color="#ffffff" emissive="#10B981" emissiveIntensity={2} />
      </Sphere>
    </group>
  );
}
