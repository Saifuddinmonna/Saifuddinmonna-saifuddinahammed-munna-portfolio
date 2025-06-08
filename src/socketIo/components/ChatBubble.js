import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaComments, FaTimes } from "react-icons/fa";

const ChatBubble = ({ onToggleChat, isChatOpen }) => {
  const [position, setPosition] = useState({
    x: window.innerWidth - 80, // Initial X position (right side)
    y: window.innerHeight - 80, // Initial Y position (bottom side)
  });
  const bubbleRef = useRef(null);

  // Handle window resize to keep bubble on screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - (bubbleRef.current?.offsetWidth || 60)),
        y: Math.min(prev.y, window.innerHeight - (bubbleRef.current?.offsetHeight || 60)),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      ref={bubbleRef}
      className={`fixed z-[1000] cursor-grab p-3 rounded-full shadow-lg transition-colors duration-300
                  ${
                    isChatOpen
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[var(--primary-main)] hover:bg-[var(--primary-dark)]"
                  }
                  text-white flex items-center justify-center`}
      style={{ top: position.y, left: position.x, width: 60, height: 60 }}
      drag
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 60,
        top: 0,
        bottom: window.innerHeight - 60,
      }}
      dragElastic={0.5}
      onDragEnd={(event, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
      onClick={onToggleChat}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isChatOpen ? <FaTimes className="w-6 h-6" /> : <FaComments className="w-6 h-6" />}
    </motion.div>
  );
};

export default ChatBubble;
