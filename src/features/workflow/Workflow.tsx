import React, { useCallback, useEffect, useRef } from "react";
import {
  Background,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DraggablePanel } from "@/features/workflow/components/DraggablePanel";
import {
  DnDProvider,
  useNodeType,
} from "@/features/workflow/hooks/useNodeType";
import {
  defaultEdgeOptions,
  edgeTypes,
  initialEdges,
  initialNodes,
  nodeTypes,
} from "@/features/workflow/constants";
import { UndoRedo } from "./components/UndoRedo";
import { useWorkflowStore } from "./state/use-flow-store";
import { useCanvasUiStore } from "./state/use-canvas-ui-store";
import {
  EraserOverlay,
  Point,
} from "@/features/workflow/components/EraserOverlay";
import {
  checkEdgeIntersection,
  checkNodeIntersection,
} from "@/features/workflow/utils/eraser.utils";

function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const edgeReconnectSuccessful = useRef(true);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNewNode,
    addTextNode,
    addNewEdge,
    removeEdge,
    removeNode,
    onNodesChange,
    onEdgesChange,
    reconnectOldEdge,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();
  const [nodeType, setNodeType] = useNodeType();
  const eraserMode = useCanvasUiStore((state) => state.eraserMode);
  const isDarkMode = useCanvasUiStore((state) => state.isDarkMode);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!nodeType) return;

      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;
      const position = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });
      addNewNode(nodeType || undefined, position);
      setNodeType(null);
    },
    [screenToFlowPosition, nodeType, addNewNode, setNodeType]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      reconnectOldEdge(oldEdge, newConnection);
    },
    [reconnectOldEdge]
  );

  const onReconnectEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        removeEdge(edge.id);
      }
      edgeReconnectSuccessful.current = true;
    },
    [removeEdge]
  );

  const onPaneClick = useCallback(() => {
    // Clear any selections when clicking on empty canvas
  }, []);

  // Handle double-click on empty canvas to create text node
  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (eraserMode) return; // Don't create text in eraser mode
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addTextNode(position);
    },
    [screenToFlowPosition, addTextNode, eraserMode]
  );

  // Handle eraser stroke with geometric intersection in flow coordinates
  const handleEraserStroke = useCallback(
    (screenTrail: Point[]) => {
      if (screenTrail.length === 0) return;

      // Convert screen coordinates to flow coordinates
      const trailInFlow = screenTrail.map((p) =>
        screenToFlowPosition({ x: p.x, y: p.y })
      );

      const nodesToDelete = nodes.filter((node) =>
        checkNodeIntersection(node, trailInFlow)
      );

      const edgesToDelete = edges.filter((edge) =>
        checkEdgeIntersection(edge, trailInFlow, nodes)
      );

      // Batch delete all intersecting elements
      nodesToDelete.forEach((node) => removeNode(node.id));
      edgesToDelete.forEach((edge) => removeEdge(edge.id));
    },
    [nodes, edges, removeNode, removeEdge, screenToFlowPosition]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const containerBounds = reactFlowWrapper.current
    ? reactFlowWrapper.current.getBoundingClientRect()
    : null;

  // Add this eraser cursor SVG
  const eraserCursor =
    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22%23ef4444%22 d=%22M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0zM5.93 17.57l3.53-3.53 2.12 2.12-3.54 3.53a1.003 1.003 0 0 1-1.42 0 1.003 1.003 0 0 1 0-1.42z%22/%3E%3C/svg%3E") 12 12, crosshair';

  return (
    <div
      className={`relative h-screen w-full border ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={addNewEdge}
        defaultEdgeOptions={defaultEdgeOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onReconnect={onReconnect}
        onPaneClick={onPaneClick}
        onDoubleClick={onPaneDoubleClick}
        colorMode={isDarkMode ? "dark" : "light"}
        style={{ cursor: eraserMode ? eraserCursor : "default" }}
      >
        {/* Eraser overlay should not block panels - put panels at higher z-index */}
        <div className="absolute top-4 left-4 z-50" data-no-erase>
          <DraggablePanel />
        </div>

        <Background />

        <div className="z-50" data-no-erase>
          <UndoRedo />
        </div>
        
        <Controls position="bottom-right" />

        {eraserMode && (
          <EraserOverlay
            onStrokeEnd={handleEraserStroke}
            containerBounds={containerBounds}
          />
        )}
      </ReactFlow>
    </div>
  );
}

export const Workflow = () => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
};
