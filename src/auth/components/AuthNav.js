import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AuthNav = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          to="/signin"
          className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:text-white hover:bg-[var(--primary-main)] rounded-md transition-colors duration-200"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="px-3 py-1.5 text-sm font-medium bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)] rounded-md transition-colors duration-200"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:text-white hover:bg-[var(--primary-main)] rounded-md transition-colors duration-200">
        <span className="mr-2 truncate max-w-[150px]">{user.displayName || user.email}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <div className="absolute right-0 w-48 mt-2 py-2 bg-[var(--background-paper)] rounded-md shadow-xl hidden group-hover:block border border-[var(--border-color)]">
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AuthNav;
