import React, { useState, useCallback } from "react";

export type Point = { x: number; y: number };

interface EraserOverlayProps {
  onStrokeEnd: (trail: Point[]) => void;
  containerBounds: DOMRect | null;
  eraserWidth?: number;
}

export const EraserOverlay: React.FC<EraserOverlayProps> = ({
  onStrokeEnd,
  containerBounds,
  eraserWidth = 24,
}) => {
  const [trail, setTrail] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const startStroke = useCallback(
    (e: React.MouseEvent) => {
      if (!containerBounds) return;
      e.preventDefault();
      e.stopPropagation();
      const point = { x: e.clientX, y: e.clientY };
      setIsDrawing(true);
      setTrail([point]);
    },
    [containerBounds]
  );

  const moveStroke = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !containerBounds) return;
      const point = { x: e.clientX, y: e.clientY };
      setTrail((prev) => {
        if (prev.length === 0) return [point];
        const last = prev[prev.length - 1];
        const dx = point.x - last.x;
        const dy = point.y - last.y;
        if (dx * dx + dy * dy < 16) return prev; // downsample: 4px threshold
        return [...prev, point];
      });
    },
    [isDrawing, containerBounds]
  );

  const finishStroke = useCallback(() => {
    if (!isDrawing) {
      setTrail([]);
      return;
    }
    setIsDrawing(false);
    if (trail.length > 0) {
      onStrokeEnd(trail);
    }
    setTrail([]);
  }, [isDrawing, trail, onStrokeEnd]);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      finishStroke();
    },
    [finishStroke]
  );

  const handleMouseLeave = useCallback(() => {
    finishStroke();
  }, [finishStroke]);

  if (!containerBounds) return null;

  const pathD = trail.length
    ? `M ${trail[0].x - containerBounds.left} ${trail[0].y - containerBounds.top} ` +
      trail
        .slice(1)
        .map((p) => `L ${p.x - containerBounds.left} ${p.y - containerBounds.top}`)
        .join(" ")
    : "";

  const lastPoint = trail[trail.length - 1];

  return (
    <div
      className="absolute inset-0 z-40"
      onMouseDown={startStroke}
      onMouseMove={moveStroke}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {trail.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none">
          <path
            d={pathD}
            stroke="#ef4444"
            strokeWidth={eraserWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.5}
          />
        </svg>
      )}
      {isDrawing && lastPoint && (
        <div
          className="absolute rounded-full bg-red-500 opacity-60 pointer-events-none"
          style={{
            width: eraserWidth,
            height: eraserWidth,
            left: lastPoint.x - containerBounds.left - eraserWidth / 2,
            top: lastPoint.y - containerBounds.top - eraserWidth / 2,
          }}
        />
      )}
    </div>
  );
};
