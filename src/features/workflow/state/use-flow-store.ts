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
  history: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  getNode: (nodeId: string | null) => Node | undefined;
  setNodes: (nodes: Node[], edges?: Edge[]) => void;
  setEdges: (edges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
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
  history: [],
  future: [],

  getNode: (nodeId) => {
    if (!nodeId) return;
    return get().nodes.find((node) => node.id === nodeId);
  },

  setNodes: (nodes, edges) => {
    const { nodes: prevNodes, edges: prevEdges } = get();
    set((state) => ({
      history: [
        ...state.history,
        { nodes: prevNodes, edges: prevEdges }, // Push current state to history
      ],
      future: [], // Clear future on new action
      nodes: validateNodes(nodes, edges ?? state.edges),
    }));
  },

  setEdges: (edges) => {
    const { nodes: prevNodes, edges: prevEdges } = get();
    set((state) => {
      state.setNodes(prevNodes, edges);
      return {
        history: [...state.history, { nodes: prevNodes, edges: prevEdges }],
        future: [],
        edges,
      };
    });
  },

  undo: () => {
    const { history, nodes, edges, future } = get();
    if (history.length === 0) return;

    const prevState = history[history.length - 1];
    set(() => ({
      nodes: prevState.nodes,
      edges: prevState.edges,
      history: history.slice(0, -1), // Remove last state from history
      future: [{ nodes, edges }, ...future], // Store current state in future
    }));
  },

  redo: () => {
    const { future, nodes, edges, history } = get();
    if (future.length === 0) return;

    const nextState = future[0];
    set(() => ({
      nodes: nextState.nodes,
      edges: nextState.edges,
      history: [...history, { nodes, edges }], // Push current to history
      future: future.slice(1), // Remove first state from future
    }));
  },

  onNodesChange: (changes) => {
    set((state) => {
      const nodes = applyNodeChanges(changes, state.nodes);
      state.setNodes(nodes, state.edges);
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

  removeNode: (nodeId) => {
    if (!nodeId) return;
    const nodes = get().nodes.filter((node) => node.id !== nodeId);
    const edges = get().edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );
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
