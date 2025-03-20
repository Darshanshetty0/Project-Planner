import React from "react";

const LongComponent: React.FC = () => {
  return (
    <div style={{ width: "2000px", height: "100px", background: "lightblue" }}>
      This is a very long div.
    </div>
  );
};

const ParentComponent: React.FC = () => {
  return (
    <div
      style={{
        width: "600px",
        overflowX: "auto",
        border: "2px solid black",
        whiteSpace: "nowrap",
      }}
    >
      <LongComponent />
    </div>
  );
};

export default ParentComponent;
