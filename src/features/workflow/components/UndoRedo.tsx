import { Panel } from "@xyflow/react";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { Button } from "@/components/ui/button";

export const UndoRedo = () => {
  const { undo, redo } = useUndoRedo();
  console.log('undo redo')
  return (
    <Panel className="flex items-center gap-10 z-10" position="bottom-center">
      <Button onClick={undo}>Undo</Button>
      <Button onClick={redo}>Redo</Button>
    </Panel>
  );
};
