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
import {
  createNode,
  validateNodes,
  areFlowStatesEqual,
} from "../utils/nodes.utils";

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
    data: {
      name?: string;
      label?: string;
      color?: string;
      customColor?: string;
      sticker?: string;
    }
  ) => void;
  removeEdge: (edgeId: string | null) => void;
  removeNode: (nodeId: string | null) => void;
  reconnectOldEdge: (oldEdge: Edge, newConnection: Connection) => void;
}

// Helper function to get node color (matches WorkflowNode.tsx logic)
const getNodeDisplayColor = (nodeData: any): string => {
  if (nodeData.customColor) {
    return nodeData.customColor;
  }
  return nodeData.color || "#3B82F6";
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  edges: [],
  nodes: [],
  history: [],
  future: [],

  getNode: (nodeId) => {
    if (!nodeId) return;
    return get().nodes.find((node) => node.id === nodeId);
  },

  setNodes: (nodes, edges) => {
    const { nodes: prevNodes, edges: prevEdges } = get();

    const isChanged = !areFlowStatesEqual(
      { nodes: prevNodes, edges: prevEdges },
      { nodes, edges: edges ?? prevEdges }
    );

    set((state) => ({
      history: isChanged
        ? [
            ...state.history,
            { nodes: prevNodes, edges: prevEdges }, // Push current state to history
          ]
        : state.history,
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
      state.setNodes(validateNodes(nodes, state.edges));
      return {};
    });
  },

  addNewEdge: (connection: Connection) => {
    set((state) => {
      // Get source node to inherit its color
      const sourceNode = state.nodes.find((n) => n.id === connection.source);
      const sourceColor = sourceNode
        ? getNodeDisplayColor(sourceNode.data)
        : "#3B82F6";

      // Create edge with source node's color - COLORFUL EDGES!
      const edge: Edge = {
        id: `edge-${connection.source}-${
          connection.sourceHandle || "default"
        }-${connection.target}-${
          connection.targetHandle || "default"
        }-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        animated: true,
        style: {
          stroke: sourceColor,
          strokeWidth: 2.5,
          opacity: 0.85,
        },
      };

      const edges = addEdge(edge, state.edges);
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
    set((state) => {
      // Update the node with new data
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );

      // When node color changes, update all outgoing edges to new color
      const updatedEdges = state.edges.map((edge) => {
        if (edge.source === nodeId) {
          const updatedNode = updatedNodes.find((n) => n.id === nodeId);
          if (updatedNode) {
            const newColor = getNodeDisplayColor(updatedNode.data);
            return {
              ...edge,
              style: {
                ...edge.style,
                stroke: newColor,
              },
            };
          }
        }
        return edge;
      });

      // Use setNodes to maintain history
      state.setNodes(updatedNodes, updatedEdges);
      return {};
    });
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
      // Get new source node color for reconnected edge
      const sourceNode = state.nodes.find((n) => n.id === newConnection.source);
      const sourceColor = sourceNode
        ? getNodeDisplayColor(sourceNode.data)
        : "#3B82F6";

      const edges = reconnectEdge(oldEdge, newConnection, state.edges);

      // Update the reconnected edge with new color
      const updatedEdges = edges.map((edge) => {
        if (
          edge.source === newConnection.source &&
          edge.target === newConnection.target
        ) {
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: sourceColor,
            },
          };
        }
        return edge;
      });

      state.setEdges(updatedEdges);
      return {};
    });
  },
}));
