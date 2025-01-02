import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "../state/use-flow-store";
import { Undo as UndoIcon, Redo as RedoIcon } from "lucide-react";

export const UndoRedo = () => {
  const { undo, redo } = useWorkflowStore();
  return (
    <Panel className="flex items-center gap-10 z-10" position="bottom-center">
      <Button onClick={undo} size={"icon"} variant={"outline"} className="bg-gray-300">
        <UndoIcon />
      </Button>
      <Button onClick={redo} size={"icon"} variant={"outline"} className="bg-gray-300">
        <RedoIcon />
      </Button>
    </Panel>
  );
};
