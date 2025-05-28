import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../../App";

const NavbarPage2 = () => {
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
    { path: "/about", label: "About" },
    { path: "/blog", label: "Blog" },
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
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 text-transparent bg-clip-text group-hover:from-blue-700 group-hover:to-cyan-600 dark:group-hover:from-blue-300 dark:group-hover:to-cyan-200 transition-all duration-300">
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
                  className={`no-underline  text-gray-800  relative px-4 py-1.5 text-base font-bold tracking-wide rounded-lg overflow-hidden group transform hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400/10 hover:border-blue-300/20 dark:border-blue-500/10 dark:hover:border-blue-400/20 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 text-white"
                      : "bg-gradient-to-r from-blue-500/10 to-cyan-400/10 dark:from-blue-400/10 dark:to-cyan-300/10 text-gray-800 dark:text-gray-100 hover:from-blue-600 hover:to-cyan-500 dark:hover:from-blue-500 dark:hover:to-cyan-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 font-['Poppins']">{item.label}</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>
              ))}
              <button
                onClick={() => handleNavigation("/contractMe")}
                className="ml-4 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 text-white text-base font-bold tracking-wide rounded-lg overflow-hidden group transform hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400/10 hover:border-blue-300/20 dark:border-blue-500/10 dark:hover:border-blue-400/20"
              >
                <span className="relative z-10 font-['Poppins']">Contact Me</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="ml-4 p-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-400/10 dark:from-blue-400/10 dark:to-cyan-300/10 hover:from-blue-600 hover:to-cyan-500 dark:hover:from-blue-500 dark:hover:to-cyan-400 transition-all duration-200 shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_25px_rgba(0,0,0,0.25)] border border-blue-400/10 hover:border-blue-300/20 dark:border-blue-500/10 dark:hover:border-blue-400/20"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FaMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Theme Toggle Button for Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FaMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
              id="mobile-menu"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              style={{ overflow: "hidden" }}
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {navItems.map(item => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`no-underline block px-4 py-1.5 rounded-lg text-base font-bold tracking-wide overflow-hidden group transform hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400/10 hover:border-blue-300/20 dark:border-blue-500/10 dark:hover:border-blue-400/20 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 text-white"
                        : "bg-gradient-to-r from-blue-500/10 to-cyan-400/10 dark:from-blue-400/10 dark:to-cyan-300/10 text-gray-800 dark:text-gray-100 hover:from-blue-600 hover:to-cyan-500 dark:hover:from-blue-500 dark:hover:to-cyan-400 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10 font-['Poppins']">{item.label}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </Link>
                ))}
                <button
                  onClick={() => handleNavigation("/contractMe")}
                  className="w-full mt-2 block text-left px-4 py-1.5 rounded-lg text-base font-bold tracking-wide bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 text-white overflow-hidden group transform hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400/10 hover:border-blue-300/20 dark:border-blue-500/10 dark:hover:border-blue-400/20"
                >
                  <span className="relative z-10 font-['Poppins']">Contact Me</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default NavbarPage2;
