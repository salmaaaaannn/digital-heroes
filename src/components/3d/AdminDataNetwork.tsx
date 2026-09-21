"use client";

import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Node({ position, isActive }: { position: [number, number, number], isActive: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.2;
    }
  });

  return (
    <Sphere ref={mesh} position={position} args={[isActive ? 0.3 : 0.15, 16, 16]}>
      <meshStandardMaterial 
        color={isActive ? "#10B981" : "#4F46E5"} 
        emissive={isActive ? "#10B981" : "#4F46E5"}
        emissiveIntensity={isActive ? 2 : 0.5} 
      />
    </Sphere>
  );
}

export function AdminDataNetwork({ nodesCount, activeNodes }: { nodesCount: number, activeNodes: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const nodes = useMemo(() => {
    const arr = [];
    const count = Math.min(nodesCount, 50); // Cap for performance
    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 8;
      arr.push({
        position: [Math.cos(theta) * radius, y, Math.sin(theta) * radius] as [number, number, number],
        isActive: i < activeNodes
      });
    }
    return arr;
  }, [nodesCount, activeNodes]);

  return (
    <group ref={group} position={[0, 0, -5]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* Core Hub */}
      <Sphere args={[1.5, 32, 32]}>
        <MeshDistortMaterial
          color="#10B981"
          emissive="#4F46E5"
          emissiveIntensity={0.6}
          distort={0.25}
          speed={2}
          roughness={0.2}
        />
      </Sphere>
      
      {nodes.map((node, i) => (
        <Node key={i} position={node.position} isActive={node.isActive} />
      ))}
    </group>
  );
}
