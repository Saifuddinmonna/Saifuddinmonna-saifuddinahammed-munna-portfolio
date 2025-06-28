import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();

  if (loading || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (!user || dbUser.role !== "admin" || dbUser.isAdmin !== true) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
