import React from "react";
import { Outlet, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminMyProjectWorksManager = () => {
  return (
    <div className="min-h-screen bg-[var(--background-default)]">
      {/* Header with Back Button */}
      <div className="bg-[var(--background-paper)] border-b border-[var(--border-main)] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-200"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              My Project Works Manager
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminMyProjectWorksManager;
