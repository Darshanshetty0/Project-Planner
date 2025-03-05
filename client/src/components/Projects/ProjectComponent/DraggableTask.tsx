import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
}

export const Draggable: React.FC<DraggableProps> = ({ id, children, styles }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // Apply transform to move item smoothly while dragging
  const draggableStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...draggableStyle, ...styles, cursor: "grab" }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
