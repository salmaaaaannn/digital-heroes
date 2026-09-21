"use client";

import React from "react";

interface CubeLoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

export function CubeLoader({ size = 75, className = "", text }: CubeLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div
        className="cube-container"
        style={{
          width: `${size * 1.5}px`,
          height: `${size * 1.5}px`,
        }}
      >
        <div
          className="cube-box"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            "--cube-size": `${size}px`,
          } as React.CSSProperties}
        >
          <div className="cube-top" />
          <span className="cube-side" style={{ "--i": 0 } as React.CSSProperties} />
          <span className="cube-side" style={{ "--i": 1 } as React.CSSProperties} />
          <span className="cube-side" style={{ "--i": 2 } as React.CSSProperties} />
          <span className="cube-side" style={{ "--i": 3 } as React.CSSProperties} />
          <div className="cube-bottom" />
        </div>
      </div>
      {text && (
        <p className="text-sm font-medium text-emerald-400 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
