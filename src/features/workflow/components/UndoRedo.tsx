import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";

export const UndoRedo = () => {
  return (
    <Panel className="flex items-center gap-10 z-10" position="bottom-center">
      <Button onClick={()=>{}}>Undo</Button>
      <Button onClick={()=>{}}>Redo</Button>
    </Panel>
  );
};
