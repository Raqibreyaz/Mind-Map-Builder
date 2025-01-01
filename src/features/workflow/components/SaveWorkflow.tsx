import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { saveEdges, saveNodes } from "../utils/saved.utils";
import { useReactFlow } from "@xyflow/react";

export function SaveWorkflow() {
  const { getEdges, getNodes } = useReactFlow();
  const isDirtyRef = useRef(false); // Track the dirty state using ref

  // Function to save changes
  const handleSaveChanges = useCallback(() => {
    saveNodes(getNodes());
    saveEdges(getEdges());
    isDirtyRef.current = false; // Update the ref value to indicate the changes are saved
  }, [getNodes, getEdges]);

  const nodes = getNodes();
  const edges = getEdges();

  // Track changes in nodes and edges
  useEffect(() => {
    isDirtyRef.current = true; // Mark the state as dirty
  }, [nodes, edges]);

  // Effect to manage beforeunload event based on isDirtyRef
  useEffect(() => {
    // show warning if there are unsaved changes in the workflow
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Button
        onClick={handleSaveChanges}
        className="text-wrap w-full max-sm:text-xs"
        size={"sm"}
      >
        Save
      </Button>
    </div>
  );
}
