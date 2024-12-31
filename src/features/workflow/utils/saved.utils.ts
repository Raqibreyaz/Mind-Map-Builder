import { Edge, Node } from "@xyflow/react";

export const getSavedNodes = (): Node[] => {
  const rawData = localStorage.getItem("nodes");
  return rawData ? JSON.parse(rawData) : [];
};

export const getSavedEdges = (): Edge[] => {
  const rawData = localStorage.getItem("edges");
  return rawData ? JSON.parse(rawData) : [];
};

export const saveNodes = (nodes: Node[]) => {
  localStorage.setItem("nodes", JSON.stringify(nodes));
};

export const saveEdges = (edges: Edge[]) => {
  localStorage.setItem("edges", JSON.stringify(edges));
};
