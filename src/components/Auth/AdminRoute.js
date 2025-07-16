import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { checkIsAdmin } from "../../utils/adminUtils";

const AdminRoute = ({ children }) => {
  const { user, dbUser, loading, userDataLoading } = useAuth();

  // Show loading spinner while authentication is in progress
  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-default)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    console.log("🔒 [AdminRoute] No user authenticated, redirecting to login");
    return <Navigate to="/signin" replace />;
  }

  // If user data is not loaded yet, show loading
  if (!dbUser) {
    console.log("🔒 [AdminRoute] User data not loaded yet");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-default)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Use the utility function to check if user is admin
  const isAdmin = checkIsAdmin(dbUser);
  console.log("🔒 [AdminRoute] User role check:", {
    userEmail: user.email,
    dbUserRole: dbUser.role,
    dbUserIsAdmin: dbUser.isAdmin,
    isAdmin,
  });

  if (!isAdmin) {
    console.log("🔒 [AdminRoute] User is not admin, redirecting to login");
    return <Navigate to="/signin" replace />;
  }

  console.log("🔒 [AdminRoute] Admin access granted");
  return children;
};

export default AdminRoute;
