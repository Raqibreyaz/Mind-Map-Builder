import { Edge, Node, Position, XYPosition } from "@xyflow/react";
import { v4 as uuid } from "uuid";

export const validateNodes = (nodes: Node[], edges: Edge[]) => {
  const startNodes = nodes.filter(({ data: { label } }) => label === "start");
  const connectedNodeIds = new Set<string>();

  // Collect all nodes that have connections
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  return nodes.map((node) => {
    let borderColor = "border-gray-400"; // Default border

    // Check for multiple start nodes
    if (node.data.label === "start" && startNodes.length > 1) {
      borderColor = "border-red-500"; // Multiple start node
    }

    // Check for disconnected nodes
    else if (!connectedNodeIds.has(node.id)) {
      borderColor = "border-red-300"; // Disconnected node
    }

    return {
      ...node,
      data: { ...node.data, borderColor },
    };
  });
};

export const createNode = (nodeType: string, position: XYPosition) => {
  // creating new node
  return {
    id: uuid(),
    type: "WorkflowNode",
    position,
    data: {
      label: nodeType,
      name: nodeType,
      execution_time: 0,
      borderColor: "border-gray-400",
    },
    sourcePosition: nodeType !== "end" ? Position.Bottom : undefined,
    targetPosition: nodeType !== "start" ? Position.Top : undefined,
  };
};
