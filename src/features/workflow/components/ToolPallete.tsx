import { Panel } from "@xyflow/react";
import { useNodeType } from "@/features/workflow/hooks/useNodeType";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SaveWorkflow } from "@/features/workflow/components/SaveWorkflow";
import { ImportFromJson } from "@/features/workflow/components/ImportFromJson";
import { ExportToJson } from "@/features/workflow/components/ExportToJson";
import { Settings } from "lucide-react";

type NodeTypes = "start" | "end" | "task" | "decision";

export const ToolPallete = function () {
  const [_, setType] = useNodeType();

  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeTypes) => {
      setType?.(nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    [setType]
  );

  return (
    <Panel
      position="top-left"
      className="flex flex-col gap-5 border p-2 rounded-2xl"
    >
      {["start", "end", "task", "decision"].map((nodeType) => (
        <Button
          key={nodeType}
          variant={"secondary"}
          type="button"
          className="capitalize sm:text-sm text-xs text-gray-700 max-sm:px-[5px] py-1 rounded-2xl"
          onDragStart={(event) => onDragStart(event, nodeType as NodeTypes)}
          draggable
        >
          {nodeType}
        </Button>
      ))}
      <SaveWorkflow />
      <Popover>
        <PopoverTrigger>
          <div className="cursor-pointer mx-auto inline-block border p-2 rounded-md bg-gray-200 ">
            <Settings className="max-sm:size-5" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-2">
          <div className="flex flex-col gap-3">
            <ImportFromJson />
            <ExportToJson />
          </div>
        </PopoverContent>
      </Popover>
    </Panel>
  );
};
