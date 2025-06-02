import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const NavbarPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = path => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
      setIsProfileOpen(false);
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const isActive = path => {
    if (
      path === "/portfolio" &&
      (location.pathname === "/portfolio" || location.pathname.startsWith("/portfolio"))
    ) {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/portfolio", label: "My Work" },
    { path: "/gallery", label: "Gallery" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/about", label: "About" },
    { path: "/blog", label: "Blog" },
    { path: "/resume", label: "Resume" },
    { path: "/chat", label: "Chat" },
  ];

  const mobileMenuVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="relative">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
                <span className="text-2xl font-bold text-[var(--primary-main)] group-hover:text-[var(--primary-dark)] transition-all duration-300">
                  MyPortfolio
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`no-underline relative px-3 py-1.5 text-sm font-medium flex items-center rounded-md overflow-hidden group transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.0)] hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)] border-x border-transparent hover:border-[var(--primary-light)] ${
                    isActive(item.path)
                      ? "bg-[var(--primary-main)] text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    {item.label === "Home" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    )}
                    {item.label === "My Work" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {item.label === "Gallery" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {item.label === "About" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                    {item.label === "Blog" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    )}
                    {item.label === "Resume" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                    {item.label === "Chat" && (
                      <svg
                        className="w-4 h-4 mr-1.5 text-inherit"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    )}
                    {item.label}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-[var(--primary-main)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-[var(--primary-light)] hover:bg-[var(--primary-main)] text-[var(--text-primary)] hover:text-white transition-all duration-200"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[var(--primary-main)]"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-[var(--primary-main)]" />
                      )}
                      <span className="text-sm font-medium">{user.displayName || user.email}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isProfileOpen ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-[var(--border-color)]">
                        <div className="px-4 py-2 border-b border-[var(--border-color)]">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {user.displayName || user.email}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-default)] dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaUser className="inline-block mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-default)] dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 inline-block mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[var(--background-default)] dark:hover:bg-gray-700"
                        >
                          <FaSignOutAlt className="inline-block mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary-main)] transition-colors duration-200"
                    >
                      <FaUser className="mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)] transition-colors duration-200"
                    >
                      <FaUserPlus className="mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="ml-2 p-1.5 rounded-md bg-[var(--background-default)] hover:bg-[var(--primary-light)] transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <FaSun className="w-4 h-4 text-[var(--warning-main)]" />
                ) : (
                  <FaMoon className="w-4 h-4 text-[var(--text-primary)]" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Theme Toggle Button for Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--background-default)] hover:bg-[var(--background-paper)] transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 text-[var(--warning-main)]" />
                ) : (
                  <FaMoon className="w-5 h-5 text-[var(--text-primary)]" />
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-primary)] hover:text-[var(--primary-main)] focus:outline-none transition-colors duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden bg-[var(--background-paper)] border-t border-[var(--border-color)]"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-[var(--primary-main)] text-white"
                        : "text-[var(--text-primary)] hover:bg-[var(--background-default)]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* Mobile Auth Buttons */}
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center space-x-2 border-b border-[var(--border-color)]">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover border-2 border-[var(--primary-main)]"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-[var(--primary-main)]" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--background-default)]"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="inline-block mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--background-default)]"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 inline-block mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-[var(--background-default)]"
                    >
                      <FaSignOutAlt className="inline-block mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--background-default)]"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="inline-block mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserPlus className="inline-block mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default NavbarPage;
