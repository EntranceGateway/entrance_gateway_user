import React from "react";

export default function ViewerButton({ icon: Icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full transition ${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-200 active:bg-gray-300"
      }`}
    >
      <Icon size={20} />
    </button>
  );
}
