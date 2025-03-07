import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  forMargin: number;
}

export const Draggable: React.FC<DraggableProps> = ({ id, children, styles, forMargin }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  // Apply transform and ensure high z-index while dragging
  const draggableStyle: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 100 : "auto", // Increase z-index while dragging
    position: isDragging ? "absolute" : "relative", // Keep the dragged item above others
    cursor: "grab",
    marginLeft: isDragging ? `${forMargin}px` : 0,
    ...styles,
  };

  return (
    <div ref={setNodeRef} style={draggableStyle} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
