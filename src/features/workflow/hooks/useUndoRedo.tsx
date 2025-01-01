import { useCallback, useEffect, useState } from "react";
import { Node, useReactFlow } from "@xyflow/react";

interface Change {
  type: "add" | "delete" | "update";
  node?: any;
  edge?: any;
  connectedEdges?: any[];
}

export const useUndoRedo = () => {
  const [history, setHistory] = useState<Change[]>([]);
  const [future, setFuture] = useState<Change[]>([]);
  const { addNodes, addEdges, setNodes, setEdges, getEdges } = useReactFlow();
  console.log(history);
  // When a new change is added, push to history and clear future
  const addChange = useCallback(
    (change: Change) => {
      setHistory((prev) => [...prev, change]);
      setFuture([]); // Clear the redo stack
      console.log(change);
    },
    [setHistory, setFuture]
  );

  const undo =
    // useCallback(
    () => {
      // when no changes then simply return
      console.log(history);
      if (history.length === 0) return;
      const lastChange = history.slice(-1)[0]; // Take the last change from history
      setHistory((prev) => prev.slice(0, -1)); // Remove it from history

      switch (lastChange.type) {
        //   when addition done either for node/edge then remove it
        case "add":
          if (lastChange.node) {
            setNodes((nds) => nds.filter((n) => n.id !== lastChange.node.id));
          } else if (lastChange.edge) {
            setEdges((eds) => eds.filter((e) => e.id !== lastChange.edge.id));
          }
          break;

        // when deletion done add it
        case "delete":
          if (lastChange.node) {
            addNodes([lastChange.node]);
            if (lastChange.connectedEdges) {
              addEdges(lastChange.connectedEdges);
            }
          } else if (lastChange.edge) {
            addEdges([lastChange.edge]);
          }
          break;

        // when update is done then unupdate it
        case "update":
          if (lastChange.node)
            setNodes((nds) =>
              nds.map((n) =>
                n.id === lastChange.node.id ? lastChange.node : n
              )
            );
          break;
      }
      setFuture((prev) => [...prev, lastChange]); // Push to redo stack
    };
  // , [history, setFuture]);

  const redo = useCallback(() => {
    // when no undo happened then simply return
    console.log(future);
    if (future.length === 0) return;
    const nextChange = future[future.length - 1]; // Get the last undone change
    setFuture((prev) => prev.slice(0, -1)); // Remove it from future

    switch (nextChange.type) {
      // when addition happened then add
      case "add":
        if (nextChange.node) {
          addNodes([nextChange.node]);
        } else if (nextChange.edge) {
          addEdges([nextChange.edge]);
        }
        break;

      // Redo node deletion: Remove node and edges
      case "delete":
        if (nextChange.node) {
          setNodes((nds) => nds.filter((n) => n.id !== nextChange.node.id));
          if (nextChange.connectedEdges) {
            setEdges((eds) =>
              eds.filter(
                (e) => !nextChange.connectedEdges?.some((ce) => ce.id === e.id)
              )
            );
          }
        } else if (nextChange.edge) {
          setNodes((edgs) =>
            edgs.filter((edg) => edg.id !== nextChange.edge.id)
          );
        }
        break;

      // Redo node update: Apply new data
      case "update":
        if (nextChange.node)
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nextChange.node.id
                ? { ...n, data: nextChange.node.data }
                : n
            )
          );
        break;
    }
    setHistory((prev) => [...prev, nextChange]); // Push to history stack
  }, [future, setHistory]);

  //   when a node is deleted then take the node and the connected edges
  const onNodeDelete = useCallback(
    (node: Node) => {
      if (!node) return;
      const connectedEdges = getEdges().filter(
        (edge) => edge.source === node.id || edge.target === node.id
      );

      // Perform actual delete
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((e) => !connectedEdges.some((ce) => ce.id === e.id))
      );

      addChange({
        type: "delete",
        node,
        connectedEdges,
      });
    },
    [setNodes, setEdges, getEdges, addChange]
  );
  useEffect(() => {
    console.log("history ", history);
    console.log("future ", future);
  }, [history, future]);
  return { addChange, undo, redo, history, future, onNodeDelete };
};
