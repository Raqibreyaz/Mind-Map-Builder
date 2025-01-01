import { Edge, Node } from "@xyflow/react";

export const getSavedNodes = (): Node[] => {
  const rawData = localStorage.getItem("nodes");
  return rawData ? JSON.parse(rawData) : [];
};

export const getSavedEdges = (): Edge[] => {
  const rawData = localStorage.getItem("edges");
  return rawData ? JSON.parse(rawData) : [];
};

export const saveNodes = (nodes: Node[]) => {
  localStorage.setItem("nodes", JSON.stringify(nodes));
};

export const saveEdges = (edges: Edge[]) => {
  localStorage.setItem("edges", JSON.stringify(edges));
};

export const exportWorkflow = (nodes: Node[], edges: Edge[]) => {
  const jsonString = JSON.stringify({ nodes, edges }, null, 2); // format with 2 spaces for readability

  // Create a blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "workflow.json"; // Name of the file
  link.click(); // Simulate a click to trigger the download
};

export const importWorkflow = (
  file: File,
  setNodes: Function,
  setEdges: Function
) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsedData = JSON.parse(content);

      // Assuming the JSON has "nodes" and "edges" keys
      if (parsedData?.nodes && parsedData?.edges) {
        setNodes(parsedData.nodes); // Set the nodes in your state
        setEdges(parsedData.edges); // Set the edges in your state
      } else {
        alert("Invalid file format");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Failed to parse JSON file");
    }
  };

  reader.readAsText(file);
};
