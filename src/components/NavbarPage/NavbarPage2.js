import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // For smoother mobile menu

const NavbarPage2 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
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
        setIsOpen(false); // Close mobile menu on navigation
    };

    const isActive = (path) => {
        // Handle "My Work" route variations
        if (path === "/my-work" && (location.pathname === "/PortfolioLayout" || location.pathname.startsWith("/portfoliolayout"))) {
            return true;
        }
        return location.pathname === path;
    };

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/PortfolioLayout", label: "My Work" }, // Use the actual path you link to
        { path: "/about", label: "About" },
        { path: "/blog", label: "Blog" },
    ];

    const mobileMenuVariants = {
        open: {
            opacity: 1,
            height: "auto", // Or a specific max-height if preferred
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        closed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    };

    return (
        // The "fixed w-full z-50" makes it a fixed header.
        // No top margin needed for the nav itself.
        // The "pt-14" on the main content area handles the space.
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
        }`}>
            {/* This container ensures content inside navbar respects page width and has padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Standard Tailwind responsive padding */}
                <div className="flex justify-between items-center h-14"> {/* Ensure items-center here */}
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center group"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text group-hover:from-blue-700 group-hover:to-cyan-600 transition-all duration-300">
                                MyPortfolio {/* Or your name */}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1"> {/* Reduced space-x for denser links if needed */}
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 group ${
                                    isActive(item.path) ? "text-blue-600" : ""
                                }`}
                            >
                                {item.label}
                                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-1.5rem)] h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
                                    isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                }`}></span>
                            </Link>
                        ))}
                        <button
                            onClick={() => handleNavigation("/contact")}
                            className="ml-4 relative px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-lg overflow-hidden group transform hover:scale-105 transition-transform duration-200"
                        >
                            <span className="relative z-10">Contact Me</span>
                            {/* Subtle animated background shine on hover */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-white shadow-lg"
                        id="mobile-menu"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        style={{ overflow: 'hidden' }} // Important for height animation
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-1 ${
                                        isActive(item.path) ? "text-blue-600 bg-blue-50" : ""
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={() => handleNavigation("/contact")}
                                className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-base font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Contact Me
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NavbarPage2;