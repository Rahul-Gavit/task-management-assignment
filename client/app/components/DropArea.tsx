import React, { useState } from "react";

const DropArea = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);

  // Prevent default behavior to allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setShowDrop(true);
  };

  const handleDragLeave = () => {
    setShowDrop(false);
  };

  const handleDrop = () => {
    onDrop();
    setShowDrop(false);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={` ${
        showDrop
          ? "bg-gray-200 h-24 rounded-md my-4 w-48 border"
          : "transition-esase-in-out duration-300"
      }`}
    >
      {showDrop ? "Release here" : "Drop"}
    </div>
  );
};

export default DropArea;
