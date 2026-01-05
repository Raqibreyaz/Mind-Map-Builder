import React from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import {
  ShapeType,
  getShapeConfig as getNodeShapeConfig,
  getStickerConfig,
} from "@/features/workflow/constants/shape-config";
import { getNodeColor as nodeColor } from "@/features/workflow/utils/nodes.utils";

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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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

/**
 * Main CustomNode Component - Clean UI with Thin Borders
 * - No default text (user writes labels)
 * - Stickers render properly
 * - Thin 2px borders
 * - All-side connection (no handles visible)
 */
// export const WorkflowNode: React.FC<CustomNodeProps> = ({
//   data,
//   isConnectable,
//   selected,
//   id,
// }) => {
//   const shapeType = (data.shapeType || "rectangle") as ShapeType;
//   const color = nodeColor(data);

//   const handleStyle = {
//     // margin: "0 !important",
//     // padding: "0 !important",
//     // // all: "revert" as any,  
//     // background: "transparent",
//     // border: "none",
//     // width: "100%",
//     // height: "8px",
//     // borderRadius: "0",
//   };

//   return (
//     <div
//       style={{
//         position: "relative",
//         // border:"2px",
//         width: "140px",
//         height: "140px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "transparent",
//         transition: "all 0.2s ease",
//         filter: selected ? `drop-shadow(0 0 10px ${color}60)` : "none",
//       }}
//     >
//       {/* Shape Outline */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           pointerEvents: "none",
//         }}
//       >
//         <ShapeRenderer shapeType={shapeType} color={color} size={120} />
//       </div>

//       {/* User Text Content - Editable by double-click */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 1,
//           textAlign: "center",
//           maxWidth: "110px",
//           color: color,
//           fontWeight: "500",
//           fontSize: "13px",
//           lineHeight: "1.3",
//           wordWrap: "break-word",
//           minHeight: "40px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: "text",
//           userSelect: "text",
//         }}
//       >
//         {data.name}
//       </div>

//       {/* Sticker Badge (Bottom Right) */}
//       {data.sticker && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: "-8px",
//             right: "-8px",
//             width: "32px",
//             height: "32px",
//             borderRadius: "50%",
//             background: "white",
//             border: `2px solid ${color}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "18px",
//             boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
//             zIndex: 10,
//           }}
//           title={getStickerConfig(data.sticker as any).description}
//         >
//           {getStickerConfig(data.sticker as any).icon}
//         </div>
//       )}

//       {/* Connection Handles - Hidden but Present (Connect from any side) */}
//       {/* These are invisible but allow connections from all sides */}
//       <Handle
//         type="target"
//         id='top-target'
//         position={Position.Top}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // top: "-4px",
//         }}
//       />
//       <Handle
//         type="source"
//         id="top-source"
//         position={Position.Top}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // top: "-4px",
//         }}
//       />
//       <Handle
//         type="source"
//         id="bottom-source"
//         position={Position.Bottom}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // bottom: "-4px",
//         }}
//       />
//       <Handle
//         type="target"
//         id="bottom-target"
//         position={Position.Bottom}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // bottom: "-4px",
//         }}
//       />
//       <Handle
//         type="source"
//         id="left-source"
//         position={Position.Left}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // left: "-4px",
//         }}
//       />
//       <Handle
//         type="target"
//         id="left-target"
//         position={Position.Left}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // left: "-4px",
//         }}
//       />
//       <Handle
//         type="source"
//         id="right-source"
//         position={Position.Right}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // right: "-4px",
//         }}
//       />
//       <Handle
//         type="target"
//         id="right-target"
//         position={Position.Right}
//         isConnectable={isConnectable}
//         style={{
//           ...handleStyle,
//           // right: "-4px",
//         }}
//       />
//     </div>
//   );
// };

export const WorkflowNode: React.FC<CustomNodeProps> = ({
  data,
  isConnectable,
  selected,
  id,
}) => {
  const shapeType = (data.shapeType || "rectangle") as ShapeType;
  const color = nodeColor(data);

  // Calculate SVG shape size based on container (responsive)
  const calculateShapeSize = (containerWidth: number, containerHeight: number) => {
    const minSize = 40;
    const maxSize = 180;
    const avgSize = Math.min(containerWidth, containerHeight) - 20;
    return Math.max(minSize, Math.min(maxSize, avgSize));
  };

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
      {/* NODE RESIZER - Shows corner handles when selected */}
      <NodeResizer
        color={color}
        isVisible={selected}
        minWidth={80}
        minHeight={80}
        maxWidth={400}
        maxHeight={400}
        onResizeStart={() => {
          // Optional: Add custom logic on resize start
        }}
        onResize={() => {
          // Optional: Add custom logic during resize
        }}
        onResizeEnd={() => {
          // Optional: Add custom logic on resize end
        }}
      />

      {/* Shape Outline - SVG (scales with node size) */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          right: "10px",
          bottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          margin: "0",
          padding: "0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShapeRenderer
            shapeType={shapeType}
            color={color}
            size={calculateShapeSize(
              typeof window !== "undefined"
                ? Math.min(window.innerWidth, 400)
                : 120,
              typeof window !== "undefined"
                ? Math.min(window.innerHeight, 400)
                : 120
            )}
          />
        </div>
      </div>

      {/* User Text Content - Editable, responsive font size */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "85%",
          maxHeight: "85%",
          color: color,
          fontWeight: "500",
          fontSize: "clamp(11px, 2vw, 14px)",
          lineHeight: "1.3",
          wordWrap: "break-word",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "text",
          userSelect: "text",
          overflow: "hidden",
          margin: "0",
          padding: "8px",
        }}
      >
        {data.name}
      </div>

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
            margin: "0",
            padding: "0",
          }}
          title={getStickerConfig(data.sticker as any).description}
        >
          {getStickerConfig(data.sticker as any).icon}
        </div>
      )}

      {/* ===== CONNECTION HANDLES - 8 TOTAL (4 SIDES × 2) ===== */}
      {/* All handles have unique IDs and are positioned correctly */}

      {/* TOP HANDLES */}
      <Handle
        type="target"
        id="top-target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          // ...handleStyle,
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
          // ...handleStyle,
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* BOTTOM HANDLES */}
      <Handle
        type="target"
        id="bottom-target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          // ...handleStyle,
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
          // ...handleStyle,
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* LEFT HANDLES */}
      <Handle
        type="target"
        id="left-target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          // ...handleStyle,
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
          // ...handleStyle,
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      {/* RIGHT HANDLES */}
      <Handle
        type="target"
        id="right-target"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          // ...handleStyle,
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
          // ...handleStyle,
          right: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
};


/**
 * Helper function to get node color
 */
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
