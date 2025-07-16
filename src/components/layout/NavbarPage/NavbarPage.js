import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../../../App";
import AuthNav from "../../../auth/components/AuthNav";
import AdminDashboardButton from "../../features/adminDashboard/AdminDashboardButton";

const NavbarPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleNavigation = path => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = path => {
    if (
      path === "/PortfolioLayout" &&
      (location.pathname === "/PortfolioLayout" || location.pathname.startsWith("/portfoliolayout"))
    ) {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/PortfolioLayout", label: "My Work" },
    { path: "/gallery", label: "Gallery" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/about", label: "About" },
    { path: "/blog", label: "Blog" },
    { path: "/resume", label: "Resume" },
  ];

  const mobileMenuVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="relative">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--background-paper)] bg-opacity-95 backdrop-blur-sm shadow-lg"
            : "bg-[var(--background-paper)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
                <span className="text-2xl font-bold text-[var(--primary-main)] group-hover:text-[var(--primary-dark)] transition-all duration-300"></span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
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
              <button
                onClick={() => handleNavigation("/contact")}
                className="ml-2 px-3 py-1.5 bg-[var(--primary-main)] text-white text-sm font-medium flex items-center rounded-md overflow-hidden group transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.0)] hover:shadow-[0_4px_15px_rgba(59,130,246,0.4)] border-x border-white hover:border-[var(--primary-light)]"
              >
                <span className="relative z-10 flex items-center">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact
                </span>
              </button>
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-md text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white transition-colors duration-200"
              >
                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <AdminDashboardButton />
              <AuthNav />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-primary)] hover:text-white hover:bg-[var(--primary-main)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map(item => (
                  <>
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path)
                          ? "bg-[var(--primary-main)] text-white"
                          : "text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </>
                ))}
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
                >
                  Contact
                </button>
                <div className="px-3 py-2">
                  <AuthNav />
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-md text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white transition-colors duration-200"
              >
                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <AdminDashboardButton />
              <AuthNav />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default NavbarPage;
