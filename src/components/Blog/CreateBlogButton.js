import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

const CreateBlogButton = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8">
      <Link
        to="/blog/create"
        className="bg-[var(--primary-main)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--primary-dark)] transition-colors duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
};

export default CreateBlogButton;
