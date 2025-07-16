import React from "react";

const PortfolioOverview = ({ overview, showMore, setShowMore }) => (
  <div className="mt-4">
    <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Overview</h4>
    {showMore ? (
      <>
        {overview.map((item, index) => (
          <p key={index} className="text-sm text-[var(--text-secondary)] mb-1">
            {item}
          </p>
        ))}
      </>
    ) : (
      <>
        {overview.slice(0, 2).map((item, index) => (
          <p key={index} className="text-sm text-[var(--text-secondary)] mb-1">
            {item}
          </p>
        ))}
      </>
    )}
    {overview.length > 2 && (
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-[var(--primary-main)] hover:text-[var(--primary-dark)] text-sm mt-2 transition-colors duration-200 focus:outline-none"
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    )}
  </div>
);

export default PortfolioOverview;
