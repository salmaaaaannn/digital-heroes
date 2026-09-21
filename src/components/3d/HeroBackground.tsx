"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==============================================================================
// 1. DATA PIXEL FIELD (Floating matrix of cybernetic data particles)
// ==============================================================================
function DataPixelField({
  count,
  speedFactorRef,
  reducedMotion,
}: {
  count: number;
  speedFactorRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate deterministic pseudo-random particle field
  const [positions, originalPositions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    // Color palette: Emerald (primary), Cyan (predictive), Indigo (ambient depth)
    const colorA = new THREE.Color("#10b981"); // Emerald
    const colorB = new THREE.Color("#06b6d4"); // Cyan
    const colorC = new THREE.Color("#6366f1"); // Indigo
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Spread particles across a wide layered volume
      const x = (Math.random() - 0.5) * 45;
      const y = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 35 - 5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // Color selection based on depth and position
      const t = Math.random();
      if (t < 0.55) {
        tempColor.copy(colorA).lerp(colorB, Math.random() * 0.6);
      } else if (t < 0.85) {
        tempColor.copy(colorB).lerp(colorC, Math.random() * 0.7);
      } else {
        tempColor.copy(colorC);
      }

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      // Random particle scale
      sc[i] = Math.random() * 0.8 + 0.3;
    }

    return [pos, origPos, col, sc];
  }, [count]);

  // Texture generator for soft circular glowing data points
  const particleTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(16, 185, 129, 0.9)");
    gradient.addColorStop(0.6, "rgba(6, 182, 212, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion || !pointsRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    const speed = speedFactorRef.current;
    const t = elapsedTime * 0.15 * speed;

    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    // Gentle fluid mathematical wave across data pixels
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx];
      const oz = originalPositions[idx + 2];

      const wave1 = Math.sin(ox * 0.12 + t * 2.0) * 0.45;
      const wave2 = Math.cos(oz * 0.1 + t * 1.5) * 0.45;

      array[idx + 1] = originalPositions[idx + 1] + wave1 + wave2;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        vertexColors
        transparent
        opacity={0.7}
        map={particleTexture || undefined}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ==============================================================================
// 2. PREDICTIVE FLOWING ARCS (Connected Bezier Curves with Traveling Pulses)
// ==============================================================================
function PredictiveArcs({
  speedFactorRef,
  reducedMotion,
}: {
  speedFactorRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const pulsesGroupRef = useRef<THREE.Group>(null!);

  // Defined 3D network hubs and spline trajectories
  const { curves, pulseNodes } = useMemo(() => {
    const rawTrajectories = [
      [new THREE.Vector3(-14, -6, -4), new THREE.Vector3(-6, 4, 1), new THREE.Vector3(2, 1, -2)],
      [new THREE.Vector3(-8, 5, -3), new THREE.Vector3(0, -3, 3), new THREE.Vector3(12, 3, -1)],
      [new THREE.Vector3(2, 1, -2), new THREE.Vector3(7, -5, 2), new THREE.Vector3(15, -2, -5)],
      [new THREE.Vector3(-12, 2, -6), new THREE.Vector3(-2, 6, -1), new THREE.Vector3(8, 2, -4)],
      [new THREE.Vector3(-4, -5, 2), new THREE.Vector3(4, 2, 4), new THREE.Vector3(14, -4, 0)],
    ];

    const generatedCurves = rawTrajectories.map((points) => {
      return new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
    });

    const nodes = [
      new THREE.Vector3(-14, -6, -4),
      new THREE.Vector3(2, 1, -2),
      new THREE.Vector3(12, 3, -1),
      new THREE.Vector3(-8, 5, -3),
      new THREE.Vector3(15, -2, -5),
      new THREE.Vector3(-4, -5, 2),
    ];

    return { curves: generatedCurves, pulseNodes: nodes };
  }, []);

  // Construct Three.js Line objects
  const arcLines = useMemo(() => {
    return curves.map((curve, i) => {
      const points = curve.getPoints(64);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x10b981 : 0x06b6d4,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Line(geom, mat);
    });
  }, [curves]);

  // Traveling pulses state
  const pulseOffsets = useMemo(() => curves.map((_, i) => (i * 0.22) % 1), [curves]);

  useFrame(({ clock }) => {
    if (reducedMotion || !pulsesGroupRef.current) return;
    const speed = speedFactorRef.current;
    const delta = 0.0025 * speed;

    pulsesGroupRef.current.children.forEach((child, i) => {
      pulseOffsets[i] = (pulseOffsets[i] + delta) % 1;
      const point = curves[i].getPoint(pulseOffsets[i]);
      child.position.copy(point);
    });
  });

  return (
    <group>
      {/* Static glowing spline arcs */}
      {arcLines.map((lineObj, i) => (
        <primitive key={`arc-${i}`} object={lineObj} />
      ))}

      {/* Network hub connection markers */}
      {pulseNodes.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#34d399" : "#38bdf8"}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Animated Traveling Pulses along Arcs */}
      <group ref={pulsesGroupRef}>
        {curves.map((_, i) => (
          <mesh key={`pulse-${i}`}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial
              color="#a7f3d0"
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ==============================================================================
// 3. MAIN SCENE CONTROLLER (Damped Parallax & Initial Speed Acceleration)
// ==============================================================================
function SceneController({
  particleCount,
  reducedMotion,
}: {
  particleCount: number;
  reducedMotion: boolean;
}) {
  const sceneGroupRef = useRef<THREE.Group>(null!);
  const speedFactorRef = useRef<number>(1.55); // Starts faster (1.55x)
  const targetPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetPointer.current.x = x;
      targetPointer.current.y = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    // 1. Initial speed settling: Starts at 1.55x, eases smoothly to 1.0x over ~2 seconds
    const elapsed = state.clock.getElapsedTime();
    if (elapsed < 2.5) {
      speedFactorRef.current = THREE.MathUtils.lerp(speedFactorRef.current, 1.0, delta * 1.4);
    } else {
      speedFactorRef.current = 1.0;
    }

    if (!sceneGroupRef.current) return;

    if (!reducedMotion) {
      // 2. Continuous elegant slow drift
      const driftSpeed = 0.08 * speedFactorRef.current;
      sceneGroupRef.current.rotation.y = Math.sin(elapsed * driftSpeed * 0.5) * 0.08;
      sceneGroupRef.current.rotation.x = Math.cos(elapsed * driftSpeed * 0.4) * 0.04;

      // 3. Damped Mouse Parallax with smooth lerping
      const targetRotY = targetPointer.current.x * 0.12;
      const targetRotX = -targetPointer.current.y * 0.09;
      const targetPosX = targetPointer.current.x * 0.8;
      const targetPosY = targetPointer.current.y * 0.5;

      sceneGroupRef.current.rotation.y = THREE.MathUtils.damp(
        sceneGroupRef.current.rotation.y,
        targetRotY,
        2.5,
        delta
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.damp(
        sceneGroupRef.current.rotation.x,
        targetRotX,
        2.5,
        delta
      );
      sceneGroupRef.current.position.x = THREE.MathUtils.damp(
        sceneGroupRef.current.position.x,
        targetPosX,
        2.0,
        delta
      );
      sceneGroupRef.current.position.y = THREE.MathUtils.damp(
        sceneGroupRef.current.position.y,
        targetPosY,
        2.0,
        delta
      );
    }
  });

  return (
    <group ref={sceneGroupRef}>
      <DataPixelField
        count={particleCount}
        speedFactorRef={speedFactorRef}
        reducedMotion={reducedMotion}
      />
      <PredictiveArcs
        speedFactorRef={speedFactorRef}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

// ==============================================================================
// 4. EXPORTED HERO BACKGROUND (Responsive, Accessible, WebGL Fallback)
// ==============================================================================
export default function HeroBackground() {
  const [particleCount, setParticleCount] = useState<number>(1400);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // 1. Accessibility: Detect prefers-reduced-motion
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionMediaQuery.addEventListener("change", motionListener);

    // 2. Responsiveness: Adjust particle counts by viewport
    const updateParticleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setParticleCount(350); // Mobile
      } else if (width < 1024) {
        setParticleCount(750); // Tablet
      } else {
        setParticleCount(1500); // Desktop
      }
    };

    updateParticleCount();
    window.addEventListener("resize", updateParticleCount, { passive: true });

    return () => {
      motionMediaQuery.removeEventListener("change", motionListener);
      window.removeEventListener("resize", updateParticleCount);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080A0A]"
      style={{
        maskImage: "radial-gradient(ellipse 90% 75% at 50% 40%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 40%, black 40%, transparent 100%)",
      }}
    >
      {/* Ambient Cybernetic Gradient Underlay */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* R3F WebGL Canvas */}
      {mounted && !hasWebGLError && (
        <Canvas
          camera={{ position: [0, 0, 18], fov: 50 }}
          dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            if (!gl) setHasWebGLError(true);
          }}
          className="w-full h-full"
        >
          <SceneController
            particleCount={particleCount}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      )}
    </div>
  );
}
