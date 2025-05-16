import React from "react";
import { useState, useEffect } from "react"; // Combined imports
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
// About is likely a page, not part of the layout directly
import Footer from "../BodyDiv/Footer";
import { motion, useScroll } from "framer-motion"; // useSpring might not be needed if directly using scrollYProgress
import NavbarPage2 from "../NavbarPage/NavbarPage2";
import "./Main.css"; // Ensure this contains .progress-bar if not using Tailwind for it

const Main = () => {
    const { scrollYProgress } = useScroll();
    const [confettiStart, setConfettiStart] = useState(true);
    const [windowSize, setWindowSize] = useState({ // For ReactConfetti dimensions
        width: undefined,
        height: undefined,
    });

    // Effect for setting initial window size and handling resize for confetti
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize(); // Call initially
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // This useEffect for scrolling to top can be replaced by <ScrollRestoration />
    // if you're using React Router v6.4+. If not, it's fine.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setConfettiStart(false);
        }, 3000); // Reduced confetti duration to 3 seconds as 8 is very long
        return () => clearTimeout(timer);
    }, []);

    return (
        // Use min-h-screen for full viewport height.
        // flex flex-col allows footer to stick to bottom if content is short.
        <div className="min-h-screen flex flex-col bg-gray-50"> {/* Added a light bg for body */}
            <NavbarPage2 /> {/* Navbar is already fixed and styled within its component */}
            
            {/* Progress Bar - ensure it's styled correctly */}
            <motion.div
                className="fixed left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 z-40" // Example Tailwind styling for progress bar
                style={{
                    scaleX: scrollYProgress,
                    transformOrigin: "0%",
                    top: '3.5rem' /* Height of the navbar (h-14) */
                }}
            />

            {/* Main content area */}
            {/* pt-14 (padding-top: 3.5rem) is crucial to offset the fixed navbar's height */}
            <main className="flex-grow pt-14">
                {confettiStart && windowSize.width && (
                    <ReactConfetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false} // Stop recycling confetti after initial burst
                        numberOfPieces={200} // Adjust number of pieces
                    />
                )}
                <Outlet /> {/* This is where your page components (HomePage, AboutPage, etc.) will render */}
            </main>
            
            <Footer />
        </div>
    );
};

export default Main;