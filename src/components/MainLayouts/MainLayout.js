import React from "react";
// ... other imports
import NavbarPage2 from "../NavbarPage/NavbarPage2";
import Footer from "../BodyDiv/Footer";
import { Outlet } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import ContactPage from "../../pages/ContactPage";
import aboutPageForHome from "../About/aboutPageForHome"; // Assuming this is a component you want to include

const Main = () => {
    const { scrollYProgress } = useScroll();
    // ... other states and effects ...

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900"> {/* Added bg-gray-100 for body to see edges */}
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <NavbarPage2 />
            </div>

            {/* Progress Bar */}
            <motion.div
                className="fixed left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 z-40"
                style={{
                    scaleX: scrollYProgress,
                    transformOrigin: "0%",
                    top: '3.5rem'
                }}
            />

            {/* Main content area with padding for fixed navbar */}
            <main className="flex-grow pt-14 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ... confetti if you have it here ... */}
                    <Outlet />
                </div>
                <aboutPageForHome />
                <Footer/>   
            </main>

           
        </div>
    );
};

export default Main;