import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
            scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
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
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text group-hover:from-blue-700 group-hover:to-cyan-600 transition-all duration-300">
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
                            onClick={() => handleNavigation("/contractMe")}
                            className="ml-4 relative px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-lg overflow-hidden group transform hover:scale-105 transition-transform duration-200"
                        >
                            <span className="relative z-10">Contact Me</span>
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
                        className="md:hidden bg-white shadow-lg" // Will take full width from parent <nav>
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
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                                > 
                                    {item.label} 
                                </Link>
                            ))}
                            <button
                                onClick={() => handleNavigation("/contractMe")}
                                className="w-full mt-2 block text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300"
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