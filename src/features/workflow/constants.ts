import { WorkflowNode } from "@/features/workflow/components/WorkflowNode";
import { Edge, MarkerType, Node } from "@xyflow/react";
import {
  getSavedEdges,
  getSavedNodes,
} from "@/features/workflow/utils/saved.utils";

export const initialNodes: Node[] = getSavedNodes();
export const initialEdges: Edge[] = getSavedEdges();

export const nodeTypes = {
  WorkflowNode,
};

export const edgeTypes = {

};

export const defaultNodeOptions = {};
export const defaultEdgeOptions = {
  animated: true,
  type: "floating",
  markerEnd: { type: MarkerType.Arrow },
};

export const snapGrid: [number, number] = [20, 20];
