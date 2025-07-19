import React, { useState } from "react";
// ... other imports
import NavbarPage2 from "../NavbarPage/NavbarPage";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import ContactPage from "../../../pages/ContactPage";
import aboutPageForHome from "../../About/aboutPageForHome"; // Assuming this is a component you want to include
import ChatBubble from "../../../socketIo/components/ChatBubble.js";
import ChatWindow from "../../../socketIo/components/ChatWindow.js";

const MainLayout = () => {
  const { scrollYProgress } = useScroll();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

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
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      {/* <ChatBubble onToggleChat={toggleChat} isChatOpen={isChatOpen} /> */}
      {/* <ChatWindow isChatOpen={isChatOpen} onCloseChat={toggleChat} /> */}
      <Footer />
    </div>
  );
};

export default MainLayout;
