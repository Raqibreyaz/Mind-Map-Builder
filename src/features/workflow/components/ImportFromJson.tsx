import { Input } from "@/components/ui/input";
import { useReactFlow } from "@xyflow/react";
import React, { useCallback } from "react";
import { importWorkflow } from "../utils/saved.utils";
import { Button } from "@/components/ui/button";

export const ImportFromJson = () => {
  const { setNodes, setEdges } = useReactFlow();

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        importWorkflow(file, setNodes, setEdges); // Call the import function
      }
    },
    [setNodes, setEdges]
  );
  return (
    <Button
      variant={"secondary"}
      type="button"
      className="w-28 cursor-pointer relative inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600"
    >
      <p className="absolute text-center text-xs">Import from Json</p>
      <Input
        type="file"
        accept=".json"
        onChange={onFileChange}
        className="opacity-0 max-w-full"
      />
    </Button>
  );
};
