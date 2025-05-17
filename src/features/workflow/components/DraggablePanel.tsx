import { ToolPallete } from "@/features/workflow/components/ToolPallete";
import { useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export const DraggablePanel = () => {
  const [position, setPosition] = useState<Position>({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const toolPalleteRef = useRef<HTMLDivElement>(null);
  const offsetref = useRef<Position>({ x: 0, y: 0 });

  // start dragging, when mouse is clicked to drag then calcualate the position of mouse wrt tool-pallete
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (toolPalleteRef.current) {
      const rect = toolPalleteRef.current.getBoundingClientRect();
      offsetref.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  };

  // update tool-pallete position depending on mouse movement
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent
  ) => {
    if (!isDragging) return;
    setPosition({
      x: event.clientX - offsetref.current.x,
      y: event.clientY - offsetref.current.y,
    });
  };

  // stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={toolPalleteRef}
      className="absolute cursor-move"
      onMouseDown={handleMouseDown}
      style={{ top: position.y, left: position.x }}
    >
      <ToolPallete />
    </div>
  );
};
