import React, { useState, useCallback, useRef, useEffect } from "react";
import { NodeResizer, NodeProps, Node } from "@xyflow/react";
import { useWorkflowStore } from "../state/use-flow-store";

interface TextNodeData extends Record<string, unknown> {
  text: string;
  fontSize?: number;
  fontColor?: string;
  isNew?: boolean; // Flag to start in edit mode
}

type TextNodeType = Node<TextNodeData, "TextNode">;

export const TextNode: React.FC<NodeProps<TextNodeType>> = ({
  data,
  id,
  selected,
}) => {
  const nodeData = data as TextNodeData;
  const [isEditing, setIsEditing] = useState(nodeData.isNew ?? false);
  const [editValue, setEditValue] = useState(nodeData.text || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateNode = useWorkflowStore((state) => state.updateNode);
  const removeNode = useWorkflowStore((state) => state.removeNode);

  // Auto-focus when starting edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Clear isNew flag after first render
  useEffect(() => {
    if (nodeData.isNew) {
      updateNode(id, { isNew: false });
    }
  }, [nodeData.isNew, id, updateNode]);

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setEditValue(nodeData.text || "");
    setIsEditing(true);
  }, [nodeData.text]);

  const handleBlur = useCallback(() => {
    const trimmedText = editValue.trim();
    if (trimmedText === "") {
      // Delete empty text nodes
      removeNode(id);
    } else {
      updateNode(id, { text: trimmedText });
      setIsEditing(false);
    }
  }, [editValue, id, removeNode, updateNode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (nodeData.text?.trim()) {
          setEditValue(nodeData.text);
          setIsEditing(false);
        } else {
          removeNode(id);
        }
      }
      // Allow Enter for new lines (Shift+Enter or just Enter)
      // Use Cmd/Ctrl+Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleBlur();
      }
    },
    [nodeData.text, id, removeNode, handleBlur]
  );

  const fontSize = nodeData.fontSize || 14;
  const fontColor = nodeData.fontColor || "#1f2937";

  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-transparent"
      style={{
        minWidth: "50px",
        minHeight: "30px",
      }}
    >
      {/* NODE RESIZER */}
      <NodeResizer
        color="#3b82f6"
        isVisible={selected ?? false}
        minWidth={50}
        minHeight={30}
        maxWidth={800}
        maxHeight={600}
      />

      {/* TEXT CONTENT */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none bg-transparent border-none outline-none p-2 overflow-hidden"
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: 1.4,
            fontFamily: "inherit",
          }}
          placeholder="Type text..."
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="w-full h-full p-2 cursor-text whitespace-pre-wrap break-words overflow-hidden"
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: 1.4,
          }}
        >
          {nodeData.text || ""}
        </div>
      )}
    </div>
  );
};
