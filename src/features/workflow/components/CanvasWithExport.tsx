import React, { useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "@/features/workflow/state/use-flow-store";
import { WorkflowNode } from "./WorkflowNode";
import { ExportButton } from "./ExportButton";
import { useExportGraph } from "../hooks/useExportGraph";

/**
 * Canvas Component with Export Functionality
 *
 * Usage:
 * <CanvasWithExport />
 *
 * Features:
 * - ReactFlow canvas
 * - Node/Edge management
 * - Export as PNG/GIF/SVG/JSON
 * - Undo/Redo support
 * - All animations preserved in GIF
 */
export const CanvasWithExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Zustand store
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNewEdge,
    undo,
    redo,
  } = useWorkflowStore();

  // Export hook
  const {
    containerRef,
    exportAsPNG,
    exportAsGIF,
    exportAsSVG,
    exportAsJSON,
  } = useExportGraph();

  // Handle new edge connections
  const handleConnect = (connection: Connection) => {
    addNewEdge(connection);
  };

  // Handle PNG export
  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportAsPNG({
        filename: `workflow-${new Date().toISOString().split("T")[0]}.png`,
        backgroundColor: "#ffffff",
        scale: 2,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle GIF export (animated)
  const handleExportGIF = async () => {
    setIsExporting(true);
    try {
      await exportAsGIF({
        filename: `workflow-${new Date().toISOString().split("T")[0]}.gif`,
        backgroundColor: "#ffffff",
        scale: 2,
        gifFrames: 60, // 60 frames for smooth animation
        gifDelay: 50, // 50ms per frame
        gifQuality: 10, // 1-30, higher = better but slower
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle SVG export
  const handleExportSVG = () => {
    exportAsSVG({
      filename: `workflow-${new Date().toISOString().split("T")[0]}.svg`,
    });
  };

  // Handle JSON export
  const handleExportJSON = () => {
    exportAsJSON(
      `workflow-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  const nodeTypes = {
    customNode: WorkflowNode,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Side - Title */}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Workflow Diagram
          </h1>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            {nodes.length} nodes • {edges.length} edges
          </p>
        </div>

        {/* Right Side - Controls */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {/* Undo Button */}
          <button
            onClick={undo}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#e5e7eb";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f3f4f6";
            }}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>

          {/* Redo Button */}
          <button
            onClick={redo}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#e5e7eb";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f3f4f6";
            }}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>

          {/* Export Button */}
          <ExportButton
            onExportPNG={handleExportPNG}
            onExportGIF={handleExportGIF}
            onExportSVG={handleExportSVG}
            onExportJSON={handleExportJSON}
            isLoading={isExporting}
          />
        </div>
      </div>

      {/* Canvas Container - REF FOR EXPORT */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Status Bar */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f3f4f6",
          borderTop: "1px solid #e5e7eb",
          fontSize: "12px",
          color: "#6b7280",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          Ready to export • Use Ctrl+Z to undo, Ctrl+Y to redo
        </span>
        <span>
          {isExporting ? "⏳ Exporting..." : "✓ Ready"}
        </span>
      </div>
    </div>
  );
};

export default CanvasWithExport;
    