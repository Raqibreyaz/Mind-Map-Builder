import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const [isMouseDown, setIsMouseDown] = useState(false);

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

  // Eraser mode: click or rub-to-erase behavior
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!eraserMode) return;
      event.preventDefault();
      event.stopPropagation();
      removeNode(node.id);
    },
    [eraserMode, removeNode]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (!eraserMode) return;
      event.preventDefault();
      event.stopPropagation();
      removeEdge(edge.id);
    },
    [eraserMode, removeEdge]
  );

  const onNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!eraserMode || !isMouseDown) return;
      event.preventDefault();
      event.stopPropagation();
      removeNode(node.id);
    },
    [eraserMode, isMouseDown, removeNode]
  );

  const onEdgeMouseEnter = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (!eraserMode || !isMouseDown) return;
      event.preventDefault();
      event.stopPropagation();
      removeEdge(edge.id);
    },
    [eraserMode, isMouseDown, removeEdge]
  );

  const onPaneClick = useCallback(() => {
    // Clear any selections when clicking on empty canvas
  }, []);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const eraserCursor =
    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22%23ef4444%22 d=%22M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0zM5.93 17.57l3.53-3.53 2.12 2.12-3.54 3.53a1.003 1.003 0 0 1-1.42 0 1.003 1.003 0 0 1 0-1.42z%22/%3E%3C/svg%3E") 12 12, crosshair';

  return (
    <div
      className={`relative h-screen w-full border ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      ref={reactFlowWrapper}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
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
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onEdgeMouseEnter={onEdgeMouseEnter}
        style={{ cursor: eraserMode ? eraserCursor : "default" }}
      >
        <DraggablePanel />
        <Background
          color={isDarkMode ? "#4b5563" : "#e5e7eb"}
          className={isDarkMode ? "bg-gray-900" : "bg-gray-50"}
        />
        <UndoRedo />
        <Controls className={isDarkMode ? "bg-gray-800 text-white" : ""} />
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
