import React from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

export const ErasableEdge: React.FC<EdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    data,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const toBeDeleted = data?.toBeDeleted === true;

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        opacity: toBeDeleted ? 0.25 : style?.opacity ?? 0.85,
        strokeDasharray: toBeDeleted ? "6,6" : style?.strokeDasharray,
      }}
    />
  );
};
