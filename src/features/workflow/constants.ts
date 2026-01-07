import { ErasableNode } from "@/features/workflow/components/ErasableNode";
import { ErasableTextNode } from "@/features/workflow/components/ErasableTextNode";
import { ErasableEdge } from "@/features/workflow/components/ErasableEdge";
import { Edge, MarkerType, Node } from "@xyflow/react";
import {
  getSavedEdges,
  getSavedNodes,
} from "@/features/workflow/utils/saved.utils";
import { ShapeType } from "@/features/workflow/constants/shape-config";

export const initialNodes: Node[] = getSavedNodes();
export const initialEdges: Edge[] = getSavedEdges();

export const nodeTypes = {
  WorkflowNode: ErasableNode,
  TextNode: ErasableTextNode,
};

export const edgeTypes = {
  floating: ErasableEdge,
  default: ErasableEdge,
};

export const defaultNodeOptions = {};
export const defaultEdgeOptions = {
  animated: true,
  type: "floating",
  markerEnd: { type: MarkerType.Arrow },
};

export const snapGrid: [number, number] = [20, 20];

// Default shape type for new nodes
export const DEFAULT_SHAPE_TYPE: ShapeType = "rectangle";
