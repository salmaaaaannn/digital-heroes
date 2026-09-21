"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function NumberObject({ number, position, delay }: { number: number, position: [number, number, number], delay: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <Html transform center className="pointer-events-none">
        <div className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-500 drop-shadow-[0_0_20px_rgba(79,70,229,0.5)]">
          {number.toString().padStart(2, '0')}
        </div>
      </Html>
    </Float>
  );
}

export function DrawNumbers({ numbers }: { numbers: number[] }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      
      <group position={[-6, 0, 0]}>
        {numbers.map((num, i) => (
          <NumberObject key={i} number={num} position={[i * 3, 0, 0]} delay={i} />
        ))}
      </group>
    </Canvas>
  );
}
