import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { checkIsAdmin } from "../../utils/adminUtils";

const AdminRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();

  if (loading || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  // Use the utility function to check if user is admin
  const isAdmin = checkIsAdmin(dbUser);

  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
