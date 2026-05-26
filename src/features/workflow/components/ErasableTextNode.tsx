// src/features/workflow/components/ErasableTextNode.tsx
import React from "react";
import { NodeProps } from "@xyflow/react";
import { TextNode } from "./TextNode";

export const ErasableTextNode: React.FC<NodeProps> = (props) => {
  const toBeDeleted = props.data?.toBeDeleted === true;

  return (
    <div
      className="h-full w-full transition-all duration-200"
      style={{
        opacity: toBeDeleted ? 0.35 : 1,
        filter: toBeDeleted ? "grayscale(1) blur(0.5px)" : "none",
      }}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TextNode {...(props as any)} />
    </div>
  );
};
