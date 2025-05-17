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

export const createNode = (
  nodeType: string,
  position: XYPosition,
  origin?: [number, number]
) => {
  // creating new node
  const node: Node = {
    id: uuid(),
    type: "WorkflowNode",
    position,
    data: {
      label: nodeType,
      name: nodeType,
      borderColor: "border-gray-400",
    },
    sourcePosition: nodeType !== "end" ? Position.Bottom : undefined,
    targetPosition: nodeType !== "start" ? Position.Top : undefined,
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
