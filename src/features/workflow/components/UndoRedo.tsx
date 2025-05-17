import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "../state/use-flow-store";
import { Undo as UndoIcon, Redo as RedoIcon } from "lucide-react";
import { useEffect } from "react";

export const UndoRedo = () => {
  const { undo, redo } = useWorkflowStore();

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key == "y") {
        event.preventDefault();
        redo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key == "z") {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Panel className="flex items-center gap-10 z-10" position="bottom-center">
      <Button
        onClick={undo}
        size={"icon"}
        variant={"outline"}
        className="bg-gray-300"
      >
        <UndoIcon />
      </Button>
      <Button
        onClick={redo}
        size={"icon"}
        variant={"outline"}
        className="bg-gray-300"
      >
        <RedoIcon />
      </Button>
    </Panel>
  );
};
