import React from "react";

const LoadingSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
    {[1, 2, 3].map(i => (
      <div
        key={i}
        className="p-6 bg-[var(--background-paper)] rounded-xl border border-[var(--border-color)] shadow-md"
      >
        <div className="h-8 bg-[var(--background-elevated)] rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-[var(--background-elevated)] rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-[var(--background-elevated)] rounded w-full mb-2"></div>
        <div className="h-4 bg-[var(--background-elevated)] rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
