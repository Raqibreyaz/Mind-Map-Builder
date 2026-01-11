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
  const measureRef = useRef<HTMLDivElement>(null);
  const editValueRef = useRef(editValue); // FIXED: Track latest value

  const updateNode = useWorkflowStore((state) => state.updateNode);
  const removeNode = useWorkflowStore((state) => state.removeNode);

  // FIXED: Detect theme
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultColor = isDarkMode ? '#ffffff' : '#1f2937';

  // Keep ref in sync with state
  useEffect(() => {
    editValueRef.current = editValue;
  }, [editValue]);

  // Auto-focus when isNew
  useEffect(() => {
    if (nodeData.isNew && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [nodeData.isNew]);

  // Focus when entering edit mode
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

  // Auto-resize both width and height
  useEffect(() => {
    if (textareaRef.current && measureRef.current) {
      const measure = measureRef.current;
      const textarea = textareaRef.current;
      
      const rect = measure.getBoundingClientRect();
      
      textarea.style.width = `${Math.max(rect.width + 8, 20)}px`;
      textarea.style.height = `${Math.max(rect.height + 8, 20)}px`;
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

  // FIXED: Use ref to get latest value
  const handleBlur = useCallback(() => {
    const trimmedText = editValueRef.current.trim(); // Use ref, not state
    if (trimmedText === "") {
      removeNode(id);
    } else {
      updateNode(id, { text: trimmedText });
      setIsEditing(false);
    }
  }, [id, removeNode, updateNode]);

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

  // FIXED: Proper resize handler
  const handleResize = useCallback(
    (_event: any, params: { width: number; height: number }) => {
      if (!nodeData.text) return; // Only resize if has content
      
      // Store initial dimensions on first resize
      const initialHeight = textareaRef.current?.offsetHeight || params.height;
      const initialFontSize = nodeData.fontSize || 14;
      
      // Calculate scale based on height change
      const heightRatio = params.height / initialHeight;
      
      // Scale font size proportionally
      const newFontSize = Math.max(8, Math.min(72, initialFontSize * heightRatio));
      
      updateNode(id, { fontSize: Math.round(newFontSize) });
    },
    [id, nodeData.fontSize, nodeData.text, updateNode]
  );

  const fontSize = nodeData.fontSize || 14;
  const fontColor = nodeData.fontColor || defaultColor; // FIXED: Use theme color
  
  const isTrulyEmpty = !nodeData.text?.trim();
  const isCurrentlyEmpty = isEditing ? !editValue.trim() : isTrulyEmpty;
  const showCursorOnly = isCurrentlyEmpty && isEditing;

  return (
    <div
      className="relative bg-transparent"
      style={{
        display: 'inline-block',
        minWidth: showCursorOnly ? 2 : undefined,
        minHeight: showCursorOnly ? fontSize + 4 : undefined,
      }}
    >
      {/* Hidden measurement div */}
      {isEditing && (
        <div
          ref={measureRef}
          className="absolute opacity-0 pointer-events-none whitespace-pre-wrap break-words"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.4,
            fontFamily: 'inherit',
            padding: '4px',
            maxWidth: '600px',
          }}
        >
          {editValue || ' '}
        </div>
      )}

      {/* Node Resizer */}
      {!showCursorOnly && (
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={50}
          minHeight={30}
          maxWidth={800}
          maxHeight={600}
          onResize={handleResize}
          keepAspectRatio={false} // FIXED: Allow free resizing
        />
      )}

      {/* Text Content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            editValueRef.current = e.target.value; // FIXED: Sync ref immediately
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`resize-none bg-transparent border-none outline-none break-words leading-relaxed ${
            showCursorOnly ? 'w-0 h-0 p-0 opacity-0' : ''
          }`}
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: 1.4,
            fontFamily: 'inherit',
            padding: showCursorOnly ? 0 : '4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'hidden',
          }}
          placeholder=""
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-text whitespace-pre-wrap break-words"
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: 1.4,
            padding: '4px',
            maxWidth: '600px',
          }}
        >
          {nodeData.text || ""}
        </div>
      )}

      {/* Blinking Cursor */}
      {showCursorOnly && (
        <div 
          className="absolute w-0.5 pointer-events-none"
          style={{ 
            left: '4px',
            top: '4px',
            height: `${fontSize}px`,
            backgroundColor: fontColor,
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </div>
  );
};
