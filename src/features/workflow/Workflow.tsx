import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  NodeMouseHandler,
  Position,
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
import { ContextMenu } from "@/features/workflow/components/ContextMenu";
import { EditNodeForm } from "@/features/workflow/components/EditNodeForm";
import { useEditNode } from "./state/use-edit-node";
import { UndoRedo } from "./components/UndoRedo";
import { useWorkflowStore } from "./state/use-flow-store";

function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
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

  const setNodeId = useEditNode((state) => state.setNodeId);
  const [menu, setMenu] = useState<{
    top: number | undefined;
    left: number | undefined;
    bottom: number | undefined;
    right: number | undefined;
  } | null>(null);

  const { screenToFlowPosition } = useReactFlow();
  const [nodeType, setNodeType] = useNodeType();
  const [eraserMode, setEraserMode] = useState(false);

  const toggleEraserMode = useCallback(() => {
    setEraserMode((prev) => !prev);
  }, []);

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

  const onNodeContextMenu: NodeMouseHandler<Node> = useCallback(
    (event, node: Node) => {
      event.preventDefault();
      const pane = (ref.current as HTMLDivElement).getBoundingClientRect();
      const margin = 20;

      let top = event.clientY;
      let left = event.clientX;

      if (left + margin > pane.width) {
        left = pane.width - margin;
      }
      if (top + margin > pane.height) {
        top = pane.height - margin;
      }

      const bottom = pane.height - top < margin ? top - margin : undefined;
      const right = pane.width - left < margin ? left - margin : undefined;

      setMenu({ top, left, bottom, right });
      setNodeId(node.id);
    },
    [setMenu, setNodeId]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

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

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  return (
    <div className="relative h-screen w-full border" ref={reactFlowWrapper}>
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <button
          type="button"
          onClick={toggleEraserMode}
          className={`rounded px-3 py-1 text-sm font-medium text-white shadow ${
            eraserMode ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {eraserMode ? "Eraser: ON" : "Eraser: OFF"}
        </button>
      </div>

      <ReactFlow
        fitView
        ref={ref as any}
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
        onNodeContextMenu={onNodeContextMenu}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        style={{ cursor: eraserMode ? "crosshair" : "default" }}
      >
        <DraggablePanel />
        <Background />
        <UndoRedo />
        <Controls />
        {menu && <ContextMenu {...menu} />}
      </ReactFlow>
      <EditNodeForm />
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
