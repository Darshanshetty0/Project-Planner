import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
}

export const Droppable: React.FC<DroppableProps> = ({ id, children, styles }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "lightblue" : "transparent",
        padding: "10px",
        border: "1px solid gray",
        ...styles,
      }}
    >
      {children}
    </div>
  );
};
