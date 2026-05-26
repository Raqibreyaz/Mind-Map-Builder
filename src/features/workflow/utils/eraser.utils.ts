import { Edge, Node } from "@xyflow/react";
import { Point } from "@/features/workflow/components/EraserOverlay";

const ERASER_RADIUS = 24; // in flow units

// Distance between two points
const distance = (p1: Point, p2: Point): number => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};

// Check if node intersects with eraser trail (using expanded bounding box)
export const checkNodeIntersection = (node: Node, trail: Point[]): boolean => {
  const nodeWidth = (node.measured?.width as number | undefined) ?? node.width ?? 120;
  const nodeHeight = (node.measured?.height as number | undefined) ?? node.height ?? 80;

  const bounds = {
    x: node.position.x - ERASER_RADIUS,
    y: node.position.y - ERASER_RADIUS,
    width: nodeWidth + ERASER_RADIUS * 2,
    height: nodeHeight + ERASER_RADIUS * 2,
  };

  return trail.some((p) =>
    p.x >= bounds.x &&
    p.x <= bounds.x + bounds.width &&
    p.y >= bounds.y &&
    p.y <= bounds.y + bounds.height
  );
};

// Sample points along a straight line between two points
const sampleLinePoints = (
  start: Point,
  end: Point,
  sampleDistance: number
): Point[] => {
  const points: Point[] = [start];
  const length = distance(start, end);
  const steps = Math.max(1, Math.ceil(length / sampleDistance));

  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    points.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    });
  }

  points.push(end);
  return points;
};

// Check if edge intersects with eraser trail by sampling along the edge
export const checkEdgeIntersection = (
  edge: Edge,
  trail: Point[],
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) return false;

  const sourceWidth = (sourceNode.measured?.width as number | undefined) ?? sourceNode.width ?? 120;
  const sourceHeight = (sourceNode.measured?.height as number | undefined) ?? sourceNode.height ?? 80;
  const targetWidth = (targetNode.measured?.width as number | undefined) ?? targetNode.width ?? 120;
  const targetHeight = (targetNode.measured?.height as number | undefined) ?? targetNode.height ?? 80;

  const sourceCenter: Point = {
    x: sourceNode.position.x + sourceWidth / 2,
    y: sourceNode.position.y + sourceHeight / 2,
  };

  const targetCenter: Point = {
    x: targetNode.position.x + targetWidth / 2,
    y: targetNode.position.y + targetHeight / 2,
  };

  const edgePoints = sampleLinePoints(sourceCenter, targetCenter, 16);

  return trail.some((trailPoint) =>
    edgePoints.some((edgePoint) => distance(trailPoint, edgePoint) <= ERASER_RADIUS)
  );
};
