import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export const WorkflowNode = memo(
  ({
    data,
  }: {
    data: {
      label: string;
      borderColor?: string;
      execution_time?: number;
      name?: string;
    };
  }) => {
    return (
      <div
        className={`border ${
          data.borderColor ?? ""
        } rounded px-2 py-1 text-sm capitalize`}
      >
        <p>{data.name ?? data.label}</p>
        {data.label !== "start" && (
          <Handle type="target" position={Position.Top} id="top" />
        )}
        {data.label !== "end" && (
          <Handle type="source" position={Position.Bottom} id="bottom" />
        )}
      </div>
    );
  }
);
