import { useCallback, useState } from "react";
import { Node, Edge, useReactFlow } from "@xyflow/react";

interface UseEraserModeProps {
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
}

export const useEraserMode = ({ removeNode, removeEdge }: UseEraserModeProps) => {
  const [eraserMode, setEraserMode] = useState(false);
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  
  // Toggle eraser mode with 'e' key
  // const eraserKeyPressed = useKeyPress("e");
  
  const toggleEraserMode = useCallback(() => {
    setEraserMode((prev) => !prev);
  }, []);

  // Handle node hover in eraser mode
  const handleNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!eraserMode) return;
      event.preventDefault();
      // Add visual feedback
      const nodes = getNodes();
      setNodes(
        nodes.map((n) =>
          n.id === node.id
            ? { ...n, style: { ...n.style, opacity: 0.5 } }
            : n
        )
      );
    },
    [eraserMode, getNodes, setNodes]
  );

  // Handle edge hover in eraser mode
  const handleEdgeMouseEnter = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (!eraserMode) return;
      event.preventDefault();
      // Add visual feedback
      const edges = getEdges();
      setEdges(
        edges.map((e) =>
          e.id === edge.id
            ? { ...e, style: { ...e.style, opacity: 0.5 } }
            : e
        )
      );
    },
    [eraserMode, getEdges, setEdges]
  );

  // Handle node click to delete
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!eraserMode) return;
      event.preventDefault();
      event.stopPropagation();
      removeNode(node.id);
    },
    [eraserMode, removeNode]
  );

  // Handle edge click to delete
  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (!eraserMode) return;
      event.preventDefault();
      event.stopPropagation();
      removeEdge(edge.id);
    },
    [eraserMode, removeEdge]
  );

  // Reset opacity when leaving eraser mode or element
  const resetElementOpacity = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    setNodes(nodes.map((n) => ({ ...n, style: { ...n.style, opacity: 1 } })));
    setEdges(edges.map((e) => ({ ...e, style: { ...e.style, opacity: 1 } })));
  }, [getNodes, getEdges, setNodes, setEdges]);

  return {
    eraserMode,
    toggleEraserMode,
    handleNodeMouseEnter,
    handleEdgeMouseEnter,
    handleNodeClick,
    handleEdgeClick,
    resetElementOpacity,
  };
};