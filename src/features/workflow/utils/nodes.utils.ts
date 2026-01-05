import { Edge, Node, Position, XYPosition } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import { ShapeType, StickerType, getShapeConfig } from "@/features/workflow/constants/shape-config";
import { DEFAULT_SHAPE_TYPE } from "@/features/workflow/constants";

export const validateNodes = (nodes: Node[], edges: Edge[]) => {
  const connectedNodeIds = new Set<string>();

  // Collect all nodes that have connections
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  return nodes.map((node) => {
    let borderColor = "border-gray-400"; // Default border

    // Check for disconnected nodes
    if (!connectedNodeIds.has(node.id)) {
      borderColor = "border-yellow-300"; // Disconnected node warning
    }

    return {
      ...node,
      data: { ...node.data, borderColor },
    };
  });
};

export const createNode = (
  shapeType: ShapeType = DEFAULT_SHAPE_TYPE,
  position: XYPosition,
  origin?: [number, number]
) => {
  const shapeConfig = getShapeConfig(shapeType);
  
  const node: Node = {
    id: uuid(),
    type: "WorkflowNode",
    position,
    data: {
      label: shapeConfig.name,
      name: `${shapeConfig.name}`,
      shapeType,
      color: shapeConfig.color,
      customColor: null, // Can be overridden by user
      sticker: null as StickerType | null,
      borderColor: "border-gray-400",
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };
  
  if (origin) node.origin = origin;
  return node;
};

interface State {
  nodes: Node[];
  edges: Edge[];
}

export function areFlowStatesEqual(prevState: State, nextState: State) {
  const filterNode = (node: Node) => {
    const { id, data, type } = node;
    return { id, data, type };
  };

  const filterEdge = (edge: Edge) => {
    const { id, source, target, type, label } = edge;
    return { id, source, target, type, label };
  };

  const prevNodes = prevState.nodes.map(filterNode);
  const nextNodes = nextState.nodes.map(filterNode);
  const prevEdges = prevState.edges.map(filterEdge);
  const nextEdges = nextState.edges.map(filterEdge);

  return (
    JSON.stringify(prevNodes) === JSON.stringify(nextNodes) &&
    JSON.stringify(prevEdges) === JSON.stringify(nextEdges)
  );
}

/**
 * Get the effective color for a node
 * Returns custom color if set, otherwise returns shape config color
 */
export const getNodeColor = (nodeData: any): string => {
  if (nodeData.customColor) {
    return nodeData.customColor;
  }
  const shapeConfig = getShapeConfig(nodeData.shapeType || DEFAULT_SHAPE_TYPE);
  return shapeConfig.color;
};
