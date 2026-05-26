import React, { useCallback, useState, useRef, useEffect } from "react";
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
 * Shape Rendering Components - Optimized SVG shapes
 */

const CircleShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const TriangleShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <polygon points={`${size / 2},2 ${size - 2},${size - 2} 2,${size - 2}`} fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const DiamondShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <polygon points={`${size / 2},2 ${size - 2},${size / 2} ${size / 2},${size - 2} 2,${size / 2}`} fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const HexagonShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <polygon
      points={`${size * 0.5},${size * 0.05} ${size * 0.95},${size * 0.25} ${size * 0.95},${size * 0.75} ${size * 0.5},${size * 0.95} ${size * 0.05},${size * 0.75} ${size * 0.05},${size * 0.25}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const CylinderShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <ellipse cx={size / 2} cy={size * 0.2} rx={size * 0.35} ry={size * 0.12} fill="none" stroke={color} strokeWidth="2" />
    <line x1={size * 0.15} y1={size * 0.2} x2={size * 0.15} y2={size * 0.8} stroke={color} strokeWidth="2" />
    <line x1={size * 0.85} y1={size * 0.2} x2={size * 0.85} y2={size * 0.8} stroke={color} strokeWidth="2" />
    <ellipse cx={size / 2} cy={size * 0.8} rx={size * 0.35} ry={size * 0.12} fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const RectangleShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <rect x="2" y="2" width={size - 4} height={size - 4} rx="8" fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const ParallelogramShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
    <polygon points={`${size * 0.2},2 ${size - 2},2 ${size * 0.8},${size - 2} 2,${size - 2}`} fill="none" stroke={color} strokeWidth="2" />
  </svg>
);

const ShapeRenderer: React.FC<{ shapeType: ShapeType; color: string; size?: number }> = ({ shapeType, color, size = 120 }) => {
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
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#6366f1", "#a855f7", "#ec4899",
];

export const WorkflowNode: React.FC<CustomNodeProps> = ({ data, isConnectable, selected, id }) => {
  const shapeType = (data.shapeType || "rectangle") as ShapeType;
  const color = nodeColor(data);
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  // Focus the editable when entering edit mode
  useEffect(() => {
    if (isEditing && editableRef.current) {

      // make focus here, to avoid manually clicking to type
      editableRef.current.focus();
      
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);

      // get and clear browsers current text selection
      const sel = window.getSelection();
      sel?.removeAllRanges();

      // highlight entire editable content
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (editableRef.current) {
      const newName = editableRef.current.textContent?.trim() || data.name;
      updateNode(id, { name: newName });
    }
    setIsEditing(false);
  }, [id, data.name, updateNode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      if (editableRef.current) {
        editableRef.current.textContent = data.name;
      }
      setIsEditing(false);
    }
  }, [data.name, handleBlur]);

  const handleColorChange = useCallback(
    (newColor: string) => {
      updateNode(id, { customColor: newColor });
    },
    [id, updateNode]
  );

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center bg-transparent transition-all duration-200"
      style={{
        filter: selected ? `drop-shadow(0 0 10px ${color}60)` : "none",
        minWidth: "100px",
        minHeight: "100px",
      }}
    >
      {/* NODE RESIZER */}
      <NodeResizer color={color} isVisible={selected} minWidth={80} minHeight={80} maxWidth={400} maxHeight={400} />

      {/* INLINE COLOR PICKER (WHEN SELECTED) */}
      {selected && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 px-1 py-0.5 bg-gray-900/90 rounded-full shadow-md z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {COLOR_PALETTE.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(c);
              }}
              className="w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-110"
              style={{
                background: c,
                border: c === color ? "2px solid white" : "1px solid #e5e7eb",
              }}
              title={`Change to ${c}`}
            />
          ))}
        </div>
      )}

      {/* Shape Outline - fills entire resizable box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none m-0 p-0 overflow-hidden">
        <ShapeRenderer shapeType={shapeType} color={color} />
      </div>

      {/* INVISIBLE AUTO-SIZING TEXT */}
      <div
        ref={editableRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={isEditing ? handleKeyDown : undefined}
        className="relative z-[1] text-center max-w-[85%] font-medium text-[clamp(11px,2vw,14px)] leading-relaxed break-words cursor-text select-text overflow-hidden m-0 p-1"
        style={{
          color,
          outline: "none",
          border: "none",
          background: "transparent",
          minWidth: "20px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.name}
      </div>

      {/* Sticker Badge (Bottom Right) */}
      {data.sticker && (
        <div
          className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg shadow-md z-10"
          style={{ border: `2px solid ${color}` }}
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
        className="-top-1.5 left-1/2 -translate-x-1/2"
      />
      <Handle
        type="source"
        id="top-source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="-top-1.5 left-1/2 -translate-x-1/2"
      />
      <Handle
        type="target"
        id="bottom-target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="-bottom-1.5 left-1/2 -translate-x-1/2"
      />
      <Handle
        type="source"
        id="bottom-source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="-bottom-1.5 left-1/2 -translate-x-1/2"
      />
      <Handle
        type="target"
        id="left-target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="-left-1.5 top-1/2 -translate-y-1/2"
      />
      <Handle
        type="source"
        id="left-source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="-left-1.5 top-1/2 -translate-y-1/2"
      />
      <Handle
        type="target"
        id="right-target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="-right-1.5 top-1/2 -translate-y-1/2"
      />
      <Handle
        type="source"
        id="right-source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="-right-1.5 top-1/2 -translate-y-1/2"
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
