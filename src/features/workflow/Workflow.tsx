import "@xyflow/react/dist/style.css";

import {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  NodeMouseHandler,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useReactFlow,
} from "@xyflow/react";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ToolPallete } from "@/features/workflow/components/ToolPallete";
import {
  DnDProvider,
  useNodeType,
} from "@/features/workflow/hooks/useNodeType";
import {
  defaultEdgeOptions,
  initialEdges,
  initialNodes,
  nodeTypes,
  snapGrid,
} from "@/features/workflow/constants";
import { ContextMenu } from "@/features/workflow/components/ContextMenu";
import { EditNodeForm } from "@/features/workflow/components/EditNodeForm";
import { useEditNode } from "./state/use-edit-node";
import { ChartSection } from "./components/ChartSection";
import { UndoRedo } from "./components/UndoRedo";
import { useWorkflowStore } from "./state/use-flow-store";

function DnDFlow() {
  const ref = useRef(null);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNewNode,
    addNewEdge,
    removeEdge,
    onNodesChange,
    onEdgesChange,
    reconnectOldEdge,
  } = useWorkflowStore();

  const edgeReconnectSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const setNodeId = useEditNode((state) => state.setNodeId);
  const [menu, setMenu] = useState<{
    top: number | undefined;
    left: number | undefined;
    bottom: number | undefined;
    right: number | undefined;
  } | null>(null);

  const { screenToFlowPosition } = useReactFlow();
  const [nodeType, setNodeType] = useNodeType();

  // make the selected node draggable
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // when droping the selected node create the node at there
  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      // check if the dropped element is valid
      if (!nodeType) {
        return;
      }
      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;
      // taking the drop position
      const position = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });
      // const newNode = createNode(nodeType, position);
      // // adding new node
      // setNodes((nds) => validateNodes(nds.concat(newNode), edges));
      addNewNode(nodeType, position);
      setNodeType(null);
    },
    [screenToFlowPosition, nodeType]
  );

  // when you drag the edge to connect to other node then this will run
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  // when you reconnected the edge at somenode or dropped it then this will run
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      reconnectOldEdge(oldEdge, newConnection);
    },
    [reconnectEdge]
  );

  // remove the edge if it is not connected at anywhere
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
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = (
        ref.current as unknown as HTMLDivElement
      ).getBoundingClientRect();
      // Define the maximum margin to prevent overflow
      const margin = 20;

      // Initial values for top and left based on mouse position
      let top = event.clientY;
      let left = event.clientX;

      // Ensure the context menu stays within the pane bounds, adjusting if necessary

      // Adjust left (horizontal) positioning if it overflows the right side
      if (left + margin > pane.width) {
        left = pane.width - margin;
      }

      // Adjust top (vertical) positioning if it overflows the bottom side
      if (top + margin > pane.height) {
        top = pane.height - margin;
      }

      // If the menu would overflow the bottom, move it upwards
      const bottom = pane.height - top < margin ? top - margin : undefined;

      // If the menu would overflow the right, move it to the left
      const right = pane.width - left < margin ? left - margin : undefined;

      // Set the menu position using top, left, bottom, and right values
      setMenu({
        top, // Vertical position
        left, // Horizontal position
        bottom, // Vertical overflow handling (if needed)
        right, // Horizontal overflow handling (if needed)
      });

      setNodeId(node.id);
    },
    [setMenu]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  return (
    <div className="h-screen w-full border" ref={reactFlowWrapper}>
      <ReactFlow
        fitView
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={addNewEdge}
        defaultEdgeOptions={defaultEdgeOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onReconnect={onReconnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        snapToGrid={true}
        snapGrid={snapGrid}
      >
        <ToolPallete />
        <Background />
        <UndoRedo />
        <Controls />
        {menu && <ContextMenu {...menu} />}
      </ReactFlow>
      <EditNodeForm />
      <div>
        <ChartSection nodes={nodes} />
      </div>
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
