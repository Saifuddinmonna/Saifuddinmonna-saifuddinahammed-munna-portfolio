import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/blog", label: "Blog" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/contact", label: "Contact" },
  ];

  const adminLinks = [
    { path: "/admin", label: "Dashboard", icon: <FaCog /> },
    { path: "/admin/testimonials", label: "Testimonials", icon: <FaCog /> },
  ];

  return (
    <nav className="bg-[var(--background-paper)] shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[var(--primary-main)]">
              Portfolio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-[var(--primary-main)]"
                    : "text-[var(--text-primary)] hover:text-[var(--primary-main)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Profile Section */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--primary-main)]"
                >
                  <FaUser />
                  <span>{user.displayName || user.email}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-[var(--background-paper)] rounded-md shadow-lg py-1"
                    >
                      <div className="px-4 py-2 border-b border-[var(--border-main)]">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {user.email}
                        </p>
                        {user.role === "admin" && (
                          <p className="text-xs text-[var(--primary-main)] mt-1">Admin User</p>
                        )}
                      </div>

                      {user.role === "admin" && (
                        <>
                          {adminLinks.map(link => (
                            <Link
                              key={link.path}
                              to={link.path}
                              className="flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-default)]"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {link.icon}
                              <span className="ml-2">{link.label}</span>
                            </Link>
                          ))}
                          <div className="border-t border-[var(--border-main)] my-1"></div>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-[var(--background-default)]"
                      >
                        <FaSignOutAlt />
                        <span className="ml-2">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-[var(--text-primary)] hover:text-[var(--primary-main)]"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? "text-[var(--primary-main)]"
                      : "text-[var(--text-primary)] hover:text-[var(--primary-main)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="border-t border-[var(--border-main)] my-2"></div>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{user.email}</p>
                    {user.role === "admin" && (
                      <p className="text-xs text-[var(--primary-main)] mt-1">Admin User</p>
                    )}
                  </div>
                  {user.role === "admin" && (
                    <>
                      {adminLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--primary-main)]"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.icon}
                          <span className="ml-2">{link.label}</span>
                        </Link>
                      ))}
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-[var(--background-default)]"
                  >
                    <FaSignOutAlt />
                    <span className="ml-2">Logout</span>
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
