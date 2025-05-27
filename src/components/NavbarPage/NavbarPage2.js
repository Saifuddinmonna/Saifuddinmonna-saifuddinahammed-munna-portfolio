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

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const isActive = (path) => {
        if (path === "/PortfolioLayout" && (location.pathname === "/PortfolioLayout" || location.pathname.startsWith("/portfoliolayout"))) {
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
        // 1. Outermost <nav>: Fixed, full viewport width, background, shadow on scroll.
        <div className="relative ">
            <nav className={`fixed w-full absolute z-50 transition-all duration-300 ${
                scrolled 
                    ? "bg-white/95 dark:!bg-gray-900/95 backdrop-blur-sm shadow-lg dark:!shadow-gray-800/20" 
                    : "bg-white dark:!bg-gray-900"
            }`}>
            {/* 2. Inner <div>: This div controls the max-width and horizontal padding
                       for the navbar's content. It should match your page's main content container.
                       Using max-w-7xl (1280px) and standard responsive padding.
            */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden"> {/* Added overflow-x-hidden */}
                {/* 3. Flex container for logo, desktop menu, mobile button. Height set here. */}
                <div className="flex justify-between items-center h-14">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center group"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:!from-blue-400 dark:!to-cyan-300 text-transparent bg-clip-text group-hover:from-blue-700 group-hover:to-cyan-600 dark:!group-hover:from-blue-300 dark:!group-hover:to-cyan-200 transition-all duration-300">
                                MyPortfolio
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`relative px-3 py-2 no-underline text-lg font-bold text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group ${
                                    isActive(item.path) ? "text-blue-600 dark:text-blue-400" : ""
                                }`}
                            >
                                {item.label}
                                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-1.5rem)] h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 dark:!from-blue-400 dark:!to-cyan-300 transition-all duration-300 ${
                                    isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                }`}></span>
                            </Link>
                        ))}
                        <button
                            onClick={() => handleNavigation("/contractMe")}
                            className="ml-4 relative px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:!from-blue-500 dark:!to-cyan-400 text-white text-sm font-semibold rounded-lg overflow-hidden group transform hover:scale-105 transition-transform duration-200"
                        >
                            <span className="relative z-10">Contact Me</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </button>
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="ml-4 p-2 rounded-lg bg-gray-100 dark:!bg-gray-800 hover:bg-gray-200 dark:!hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FaSun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <FaMoon className="w-5 h-5 text-gray-700 dark:!text-gray-300" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Theme Toggle Button for Mobile */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:!bg-gray-800 hover:bg-gray-200 dark:!hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FaSun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <FaMoon className="w-5 h-5 text-gray-700 dark:!text-gray-300" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-black dark:!text-gray-200 hover:text-blue-600 dark:!hover:text-blue-400 focus:outline-none transition-colors duration-300"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - This will be full width of the nav when open, so its internal padding is important */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-white dark:!bg-gray-900 shadow-lg dark:!shadow-gray-800/20"
                        id="mobile-menu"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        style={{ overflow: 'hidden' }}
                    >
                        {/* Add padding here for mobile menu items to align with overall page padding */}
                        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6 lg:px-8"> {/* CONSISTENT PADDING */}
                            {navItems.map((item) => (                               
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                                        isActive(item.path)
                                            ? "bg-blue-50 dark:!bg-blue-900/30 text-blue-700 dark:!text-blue-400"
                                            : "text-gray-900 dark:!text-gray-200 hover:bg-gray-100 dark:!hover:bg-gray-800 hover:text-gray-900 dark:!hover:text-gray-100"
                                    }`}
                                > 
                                    {item.label} 
                                </Link>
                            ))}
                            <button
                                onClick={() => handleNavigation("/contractMe")}
                                className="w-full mt-2 block text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:!text-gray-200 hover:bg-gray-100 dark:!hover:bg-gray-800 hover:text-gray-900 dark:!hover:text-gray-100 transition-colors duration-300"
                            > 
                                Contact Me 
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