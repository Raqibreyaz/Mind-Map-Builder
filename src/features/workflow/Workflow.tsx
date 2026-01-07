import React, { useCallback, useEffect, useRef } from "react";
import {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
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
import { EraserOverlay, Point } from "@/features/workflow/components/EraserOverlay";
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
      addNewNode(nodeType, position);
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
        colorMode={isDarkMode ? "dark" : "light"}
      >
        <DraggablePanel />
        <Background />
        <UndoRedo />
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
