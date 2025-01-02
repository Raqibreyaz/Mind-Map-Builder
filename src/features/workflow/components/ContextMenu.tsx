import React, { useEffect, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { useCallback } from "react";
import { useEditNode } from "../state/use-edit-node";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "../state/use-flow-store";
import { useReactFlow } from "@xyflow/react";

interface ContextMenuProps {
  top: number | undefined;
  left: number | undefined;
  bottom: number | undefined;
  right: number | undefined;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  top,
  left,
  bottom,
  right,
}) => {
  const open = useRef(true);
  const nodeId = useEditNode((state) => state.nodeId);
  const setOpen = useEditNode((state) => state.setOpen);

  const addNewNode = useWorkflowStore((state) => state.addNewNode);
  const { getNode } = useReactFlow();
  const removeNode = useWorkflowStore((state) => state.removeNode);

  // get the node label and position to duplicate the node

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId ?? "");
    console.log("duplicate ", node);
    const position = {
      x: (node?.position.x ?? 0) + 50,
      y: (node?.position.y ?? 0) + 50,
    };
    addNewNode(node?.data.label as string, position);
  }, [nodeId, getNode, addNewNode]);

  // remove the node with edge
  const deleteNode = useCallback(() => {
    removeNode(nodeId);
    open.current = false;
  }, [nodeId, removeNode]);
  // invoke the edit node sheet
  const editNodeFormOpener = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    open.current = true;
  }, [nodeId]);

  return (
    <Popover open={open.current}>
      <PopoverTrigger
        className="absolute"
        style={{ top, left, right, bottom }}
      ></PopoverTrigger>
      <PopoverContent className="w-50 p-2">
        <div className="flex flex-col gap-3">
          {[
            { name: "duplicate", fn: duplicateNode },
            { name: "edit", fn: editNodeFormOpener },
            { name: "delete", fn: deleteNode },
          ].map(({ name, fn }) => (
            <Button
              key={name}
              className="p-2 text-md text-start"
              onClick={fn}
              variant={"secondary"}
            >
              {name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ContextMenu;
