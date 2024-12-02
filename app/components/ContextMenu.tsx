"use client";

import React from "react";

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  selectedText: string;
  claimType: string | null;
  onClose: () => void;
  onAskAI: () => void;
}

export default function ContextMenu({
  position,
  selectedText,
  claimType,
  onClose,
  onAskAI,
}: ContextMenuProps) {
  if (!position) return null;

  return (
    <div
      id="context-menu"
      className="fixed bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: "200px",
      }}
    >
      <button
        onClick={() => {
          console.log("See related for:", selectedText);
          onClose();
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        See Related
      </button>
      <button
        onClick={() => {
          console.log("Flagged:", selectedText);
          onClose();
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Flag
      </button>
      {claimType && (
        <button
          onClick={() => {
            console.log(`${claimType} action for:`, selectedText);
            onClose();
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          {claimType === "Fact" && "Verify Fact"}
          {claimType === "Value" && "Discuss Value"}
          {claimType === "Policy" && "Analyze Policy"}
        </button>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAskAI();
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Ask AI
      </button>
      <button
        onClick={() => {
          console.log("Add comment for:", selectedText);
          onClose();
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Add Comment
      </button>
    </div>
  );
}
