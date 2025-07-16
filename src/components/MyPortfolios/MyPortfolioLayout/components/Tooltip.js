import React from "react";

const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--background-elevated)] text-[var(--text-primary)] text-sm rounded-md shadow-lg border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--background-elevated)]"></div>
    </div>
  </div>
);

export default Tooltip;
