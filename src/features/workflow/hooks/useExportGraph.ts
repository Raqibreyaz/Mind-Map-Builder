import React, { useRef } from "react";
import html2canvas from "html2canvas";
import GIF from "gif.js";
import { useWorkflowStore } from "@/features/workflow/state/use-flow-store";

interface ExportOptions {
  filename?: string;
  format?: "png" | "gif";
  backgroundColor?: string;
  scale?: number;
  gifFrames?: number;
  gifDelay?: number;
  gifQuality?: number;
  containerRef?: React.RefObject<HTMLDivElement>; // ✅ Add this
}

/**
 * Export Graph Hook
 * - Export as PNG (static image)
 * - Export as GIF (animated with moving edges)
 * - Export as SVG (vector format)
 * - Export as JSON (workflow data)
 */
export const useExportGraph = () => {
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const { nodes, edges } = useWorkflowStore();

  /**
   * Export as PNG (Static Image)
   */
  const exportAsPNG = async (options: Partial<ExportOptions> = {}) => {
    const {
      filename = "workflow-diagram.png",
      backgroundColor = "#ffffff",
      scale = 2,
      containerRef, // ✅ Destructure it
    } = options;

    // ✅ Use passed containerRef or fall back to internal one
    const targetRef = containerRef || internalContainerRef;
    
    if (!targetRef.current) {
      console.error("❌ Container ref not found");
      return;
    }

    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor,
        scale,
        allowTaint: true,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = filename;
      link.click();

      console.log("✅ PNG exported successfully");
    } catch (error) {
      console.error("❌ Failed to export PNG:", error);
    }
  };

  /**
   * Export as GIF (Animated with moving edges)
   */
  const exportAsGIF = async (options: Partial<ExportOptions> = {}) => {
    const {
      filename = "workflow-diagram.gif",
      backgroundColor = "#ffffff",
      scale = 2,
      gifFrames = 60,
      gifDelay = 50,
      gifQuality = 10,
      containerRef, // ✅ Destructure it
    } = options;

    // ✅ Use passed containerRef or fall back to internal one
    const targetRef = containerRef || internalContainerRef;
    
    if (!targetRef.current) {
      console.error("❌ Container ref not found");
      return;
    }

    try {
      const gif = new GIF({
        workers: 2,
        quality: gifQuality,
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
        workerScript: "/gif.worker.js",
      });

      console.log(`🎬 Rendering GIF with ${gifFrames} frames...`);

      for (let frame = 0; frame < gifFrames; frame++) {
        const canvas = await html2canvas(targetRef.current, {
          backgroundColor,
          scale,
          allowTaint: true,
          useCORS: true,
          logging: false,
        });

        gif.addFrame(canvas, { delay: gifDelay });
        const progress = Math.round((frame / gifFrames) * 100);
        console.log(`📊 Progress: ${progress}%`);
      }

      gif.on("finished", function (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        console.log("✅ GIF exported successfully");
      });

      gif.render();
    } catch (error) {
      console.error("❌ Failed to export GIF:", error);
    }
  };

  /**
   * Export as SVG (Vector format)
   */
  const exportAsSVG = (options: Partial<ExportOptions> = {}) => {
    const { filename = "workflow-diagram.svg", containerRef } = options;
    
    // ✅ Use passed containerRef or fall back to internal one
    const targetRef = containerRef || internalContainerRef;

    if (!targetRef.current) {
      console.error("❌ Container ref not found");
      return;
    }

    try {
      const svgContent = targetRef.current.innerHTML;
      const svg = new Blob([svgContent], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(svg);
      link.download = filename;
      link.click();
      console.log("✅ SVG exported successfully");
    } catch (error) {
      console.error("❌ Failed to export SVG:", error);
    }
  };

  /**
   * Export as JSON (Graph data)
   */
  const exportAsJSON = (filename: string = "workflow-data.json") => {
    try {
      const data = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position,
          width: node.width,
          height: node.height,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          style: edge.style,
        })),
        metadata: {
          exportedAt: new Date().toISOString(),
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
      };

      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      );
      link.download = filename;
      link.click();

      console.log("✅ JSON exported successfully");
    } catch (error) {
      console.error("❌ Failed to export JSON:", error);
    }
  };

  return {
    containerRef: internalContainerRef, // ✅ Return internal ref for convenience
    exportAsPNG,
    exportAsGIF,
    exportAsSVG,
    exportAsJSON,
  };
};
