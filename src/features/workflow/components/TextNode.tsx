import React, { useState, useCallback, useRef, useEffect } from "react";
import { NodeResizer, NodeProps, Node } from "@xyflow/react";
import { useWorkflowStore } from "../state/use-flow-store";

interface TextNodeData extends Record<string, unknown> {
  text: string;
  fontSize?: number;
  fontColor?: string;
  isNew?: boolean;
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

  // Auto-focus
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // Clear isNew flag
  useEffect(() => {
    if (nodeData.isNew) {
      updateNode(id, { isNew: false });
    }
  }, [nodeData.isNew, id, updateNode]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editValue, isEditing]);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setEditValue(nodeData.text || "");
      setIsEditing(true);
    },
    [nodeData.text]
  );

  const handleBlur = useCallback(() => {
    const trimmedText = editValue.trim();
    if (trimmedText === "") {
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
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleBlur();
      }
    },
    [nodeData.text, id, removeNode, handleBlur]
  );

  const fontSize = nodeData.fontSize || 14;
  const fontColor = nodeData.fontColor || "#1f2937";
  
  const isTrulyEmpty = !nodeData.text?.trim();
  const isCurrentlyEmpty = isEditing ? !editValue.trim() : isTrulyEmpty;
  const showCursorOnly = isCurrentlyEmpty && isEditing;

  return (
    <div
      className="relative inline-block bg-transparent"
      style={{
        minWidth: showCursorOnly ? 2 : undefined,
        minHeight: showCursorOnly ? fontSize : undefined,
      }}
    >
      {/* Node Resizer */}
      {!showCursorOnly && (
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={50}
          minHeight={30}
          maxWidth={800}
          maxHeight={600}
        />
      )}

      {/* Text Content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`resize-none bg-transparent border-none outline-none p-2 break-words leading-relaxed ${
            showCursorOnly ? 'w-0 h-0 p-0 opacity-0' : 'w-auto h-auto'
          }`}
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: 1.4,
            fontFamily: 'inherit',
            display: 'inline-block',
            maxWidth: '400px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          rows={1}
          placeholder=" "
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="p-2 cursor-text whitespace-pre-wrap break-words inline-block"
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: 1.4,
            maxWidth: '400px',
          }}
        >
          {nodeData.text || ""}
        </div>
      )}

      {/* Blinking Cursor */}
      {showCursorOnly && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-current pointer-events-none"
          style={{ 
            color: fontColor,
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </div>
  );
};
