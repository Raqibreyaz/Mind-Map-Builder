import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  reconnectEdge,
} from "@xyflow/react";
import { initialEdges, initialNodes } from "../constants";
import { createNode, validateNodes } from "../utils/nodes.utils";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  getNode: (nodeId: string | null) => Node | undefined;
  setNodes: (nodes: Node[], edges?: Edge[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  addNewNode: (
    nodeType: string | undefined,
    position: { x: number; y: number }
  ) => void;
  addNewEdge: (connection: Connection) => void;
  updateNode: (
    nodeId: string | null,
    data: { name: string; label: string; execution_time: number }
  ) => void;
  removeEdge: (edgeId: string | null) => void;
  removeNode: (nodeId: string | null) => void;
  reconnectOldEdge: (oldEdge: Edge, newConnection: Connection) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  getNode: (nodeId) => {
    if (nodeId) return;
    console.log('nodes',get().nodes)
    const node = get().nodes.find((node) => node.id === nodeId);
    console.log(node);
    return node;
  },
  // validating nodes before saving
  setNodes: (nodes, edges) =>
    set((state) => ({ nodes: validateNodes(nodes, edges ?? state.edges) })),

  // when updating edges validate nodes for that edges
  setEdges: (edges) =>
    set((state) => {
      state.setNodes(state.nodes, edges);
      return { edges };
    }),

  onNodesChange: (changes) => {
    set((state) => {
      const nodes = applyNodeChanges(changes, state.nodes);
      const edges = state.edges;
      state.setNodes(nodes, edges);
      return {};
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const edges = applyEdgeChanges(changes, state.edges);
      state.setEdges(edges);
      return {};
    });
  },

  addNewNode: (nodeType, position) => {
    if (!nodeType) return;
    const newNode = createNode(nodeType, position);
    set((state) => {
      const nodes = [...state.nodes, newNode];
      state.setNodes(nodes);
      return {};
    });
  },

  addNewEdge: (connection: Connection) => {
    set((state) => {
      const edges = addEdge(connection, state.edges);
      state.setEdges(edges);
      return {};
    });
  },

  removeEdge: (edgeId) => {
    set((state) => {
      const edges = state.edges.filter((edge) => edge.id !== edgeId);
      state.setEdges(edges);
      return {};
    });
  },

  updateNode: (nodeId, data) => {
    const nodes = get().nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    );

    get().setNodes(nodes);
  },

  // remove that node with its connected edges
  removeNode: (nodeId) => {
    if (!nodeId) return;
    const nodes = get().nodes.filter((node) => node.id !== nodeId);
    const edges = get().edges.filter((edge) => edge.source !== nodeId);
    get().setNodes(nodes);
    get().setEdges(edges);
  },
  reconnectOldEdge: (oldEdge, newConnection) => {
    set((state) => {
      const edges = reconnectEdge(oldEdge, newConnection, state.edges);
      state.setEdges(edges);
      return {};
    });
  },
}));
