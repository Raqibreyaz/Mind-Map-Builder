import React, { useState, useCallback } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import {
  ShapeType,
  getShapeConfig as getNodeShapeConfig,
  getStickerConfig,
} from "@/features/workflow/constants/shape-config";
import { getNodeColor as nodeColor } from "@/features/workflow/utils/nodes.utils";
import { useWorkflowStore } from "../state/use-flow-store";

interface CustomNodeProps {
  data: {
    label: string;
    name: string;
    shapeType?: ShapeType;
    color?: string;
    customColor?: string | null;
    sticker?: string | null;
    borderColor?: string;
  };
  isConnectable: boolean;
  selected?: boolean;
  id: string;
}

/**
 * Shape Rendering Components with Thin Borders (2px)
 */

const CircleShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <circle
      cx={size / 2}
      cy={size / 2}
      r={size / 2 - 2}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const TriangleShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <polygon
      points={`${size / 2},2 ${size - 2},${size - 2} 2,${size - 2}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const DiamondShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <polygon
      points={`${size / 2},2 ${size - 2},${size / 2} ${size / 2},${
        size - 2
      } 2,${size / 2}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const HexagonShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <polygon
      points={`${size * 0.5},${size * 0.05} ${size * 0.95},${size * 0.25} ${
        size * 0.95
      },${size * 0.75} ${size * 0.5},${size * 0.95} ${size * 0.05},${
        size * 0.75
      } ${size * 0.05},${size * 0.25}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const CylinderShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <ellipse
      cx={size / 2}
      cy={size * 0.2}
      rx={size * 0.35}
      ry={size * 0.12}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
    <line
      x1={size * 0.15}
      y1={size * 0.2}
      x2={size * 0.15}
      y2={size * 0.8}
      stroke={color}
      strokeWidth="2"
    />
    <line
      x1={size * 0.85}
      y1={size * 0.2}
      x2={size * 0.85}
      y2={size * 0.8}
      stroke={color}
      strokeWidth="2"
    />
    <ellipse
      cx={size / 2}
      cy={size * 0.8}
      rx={size * 0.35}
      ry={size * 0.12}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const RectangleShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <rect
      x="2"
      y="2"
      width={size - 4}
      height={size - 4}
      rx="8"
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const ParallelogramShape: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
    <polygon
      points={`${size * 0.2},2 ${size - 2},2 ${size * 0.8},${size - 2} 2,${
        size - 2
      }`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const ShapeRenderer: React.FC<{
  shapeType: ShapeType;
  color: string;
  size?: number;
}> = ({ shapeType, color, size = 120 }) => {
  switch (shapeType) {
    case "circle":
      return <CircleShape color={color} size={size} />;
    case "triangle":
      return <TriangleShape color={color} size={size} />;
    case "diamond":
      return <DiamondShape color={color} size={size} />;
    case "hexagon":
      return <HexagonShape color={color} size={size} />;
    case "cylinder":
      return <CylinderShape color={color} size={size} />;
    case "rectangle":
      return <RectangleShape color={color} size={size} />;
    case "parallelogram":
      return <ParallelogramShape color={color} size={size} />;
    default:
      return <RectangleShape color={color} size={size} />;
  }
};

const COLOR_PALETTE = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

export const WorkflowNode: React.FC<CustomNodeProps> = ({
  data,
  isConnectable,
  selected,
  id,
}) => {
  const shapeType = (data.shapeType || "rectangle") as ShapeType;
  const color = nodeColor(data);
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.name);

  const handleTextClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setEditValue(data.name);
      setIsEditing(true);
    },
    [data.name]
  );

  const handleEditSubmit = useCallback(() => {
    updateNode(id, { name: editValue });
    setIsEditing(false);
  }, [id, editValue, updateNode]);

  const handleColorChange = useCallback(
    (newColor: string) => {
      updateNode(id, { customColor: newColor });
    },
    [id, updateNode]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        transition: "all 0.2s ease",
        filter: selected ? `drop-shadow(0 0 10px ${color}60)` : "none",
        minWidth: "100px",
        minHeight: "100px",
      }}
    >
      {/* NODE RESIZER */}
      <NodeResizer
        color={color}
        isVisible={selected}
        minWidth={80}
        minHeight={80}
        maxWidth={400}
        maxHeight={400}
      />

      {/* INLINE COLOR PICKER (WHEN SELECTED) */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: "-32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "4px",
            padding: "2px 4px",
            background: "rgba(17,24,39,0.9)",
            borderRadius: "999px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            zIndex: 20,
          }}
        >
          {COLOR_PALETTE.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(c);
              }}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                border: c === color ? "2px solid white" : "1px solid #e5e7eb",
                background: c,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* Shape Outline - fills entire resizable box */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <ShapeRenderer shapeType={shapeType} color={color} />
      </div>

      {/* TEXT / INLINE EDITOR */}
      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSubmit();
            if (e.key === "Escape") {
              setEditValue(data.name);
              setIsEditing(false);
            }
          }}
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: "85%",
            color: color,
            fontWeight: 500,
            fontSize: "clamp(11px, 2vw, 14px)",
            lineHeight: "1.3",
            padding: "2px 4px",
            borderRadius: "4px",
            border: `1px solid ${color}`,
            background: "rgba(255,255,255,0.9)",
            outline: "none",
          }}
        />
      ) : (
        <div
          onDoubleClick={handleTextClick}
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "85%",
            maxHeight: "85%",
            color: color,
            fontWeight: 500,
            fontSize: "clamp(11px, 2vw, 14px)",
            lineHeight: "1.3",
            wordWrap: "break-word",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "text",
            userSelect: "text",
            overflow: "hidden",
            margin: 0,
            padding: "8px",
          }}
        >
          {data.name}
        </div>
      )}

      {/* Sticker Badge (Bottom Right) */}
      {data.sticker && (
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "-10px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "white",
            border: `2px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
            zIndex: 10,
            margin: 0,
            padding: 0,
          }}
          title={getStickerConfig(data.sticker as any).description}
        >
          {getStickerConfig(data.sticker as any).icon}
        </div>
      )}

      {/* CONNECTION HANDLES */}
      <Handle
        type="target"
        id="top-target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        id="top-source"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="target"
        id="bottom-target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        id="bottom-source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="target"
        id="left-target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="source"
        id="left-source"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="target"
        id="right-target"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          right: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <Handle
        type="source"
        id="right-source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          right: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
};

export const getNodeColor = (nodeData: any): string => {
  if (nodeData.customColor) {
    return nodeData.customColor;
  }
  const shapeType = nodeData.shapeType || "rectangle";
  const shapeConfig = getNodeShapeConfig(shapeType as ShapeType);
  return shapeConfig.color;
};

export const getShapeConfig = (shapeType: ShapeType) => {
  const configs = {
    circle: { name: "Circle", description: "Services/APIs" },
    triangle: { name: "Triangle", description: "Events/Triggers" },
    diamond: { name: "Diamond", description: "Decisions" },
    hexagon: { name: "Hexagon", description: "Processes" },
    cylinder: { name: "Cylinder", description: "Database" },
    rectangle: { name: "Rectangle", description: "APIs/Components" },
    parallelogram: { name: "Parallelogram", description: "Async" },
  };
  return configs[shapeType] || configs.rectangle;
};
