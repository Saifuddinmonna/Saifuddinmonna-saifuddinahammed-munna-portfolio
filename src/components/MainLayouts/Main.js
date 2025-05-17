import React from "react";
// ... other imports
import NavbarPage2 from "../NavbarPage/NavbarPage2"; // Your Navbar
import Footer from "../BodyDiv/Footer";
import { Outlet } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import ContactPage from "../../pages/ContactPage";

const Main = () => {
    const { scrollYProgress } = useScroll();
    // ... other states and effects ...

    return (
        <div className="min-h-screen flex flex-col bg-gray-100"> {/* Added bg-gray-100 for body to see edges */}
            <NavbarPage2 /> {/* Navbar is fixed and full-width itself */}

            <motion.div
                className="fixed left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 z-40"
                style={{
                    scaleX: scrollYProgress,
                    transformOrigin: "0%",
                    top: '3.5rem' // Assumes navbar height is h-14 (56px or 3.5rem)
                }}
            />

            {/* Main content area */}
            <main className="flex-grow pt-14"> {/* pt-14 for fixed navbar height */}
                {/* This inner div now controls the max-width and padding for ALL page content */}
                {/* It should match the Navbar's inner div settings for alignment */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ... confetti if you have it here ... */}
                    <Outlet />
                  
                </div>
                    
            </main>

            {/* Footer can also have its content constrained similarly if desired */}
            <Footer /> {/* If Footer content also needs to align, it needs similar max-w and padding internally */}
        </div>
    );
};

export default Main;