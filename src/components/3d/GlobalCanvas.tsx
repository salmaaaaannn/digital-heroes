"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, Component, ReactNode } from "react";

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("GlobalCanvas caught WebGL/R3F error:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function GlobalCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <CanvasErrorBoundary>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {children}
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
