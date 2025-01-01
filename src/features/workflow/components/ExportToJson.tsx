import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { exportWorkflow } from "@/features/workflow/utils/saved.utils";

// Example usage in a component
export const ExportToJson = () => {
  const { getNodes, getEdges } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  return (
    <Button type="button" className="hover:bg-gray-300 text-xs" variant={"secondary"} onClick={() => exportWorkflow(nodes, edges)}>Export To Json</Button>
  );
};


