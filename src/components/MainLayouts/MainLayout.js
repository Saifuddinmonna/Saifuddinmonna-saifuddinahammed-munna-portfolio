import React, { useState, useEffect, Suspense } from "react";
// ... other imports
import NavbarPage2 from "../NavbarPage/NavbarPage";
import Footer from "../CommonComponents/Footer";
import { Outlet } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import ChatButton from "../Chat/ChatButton";

// Lazy load Confetti
const ReactConfetti = React.lazy(() => import("react-confetti"));

const MainLayout = () => {
  const { scrollYProgress } = useScroll();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-default)]">
      {/* Added bg-gray-100 for body to see edges */}
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
          top: "3.5rem",
        }}
      />
      {/* Main content area with padding for fixed navbar */}
      <main className="flex-grow pt-20 bg-[var(--background-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {typeof window !== "undefined" && (
            <Suspense fallback={null}>
              <ReactConfetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.2}
              />
            </Suspense>
          )}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
      <ChatButton />
    </div>
  );
};

export default MainLayout;
