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

  // Eraser mode handlers
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

  const onPaneClick = useCallback(() => {
    // Clear any selections when clicking on empty canvas
  }, []);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

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
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        className={eraserMode ? "cursor-crosshair" : ""}
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
