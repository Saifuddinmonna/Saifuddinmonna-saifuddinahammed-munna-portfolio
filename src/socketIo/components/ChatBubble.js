import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaComments, FaTimes } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../SocketProvider";

const ChatBubble = ({ onToggleChat, isChatOpen }) => {
  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  });
  const bubbleRef = useRef(null);
  const { user: firebaseUser } = useAuth();
  const navigate = useNavigate();
  const { unreadCounts } = useSocket();

  // Calculate total unread messages
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

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

  const handleBubbleClick = () => {
    if (firebaseUser) {
      onToggleChat();
    } else {
      navigate("/signin");
    }
  };

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
      onClick={handleBubbleClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isChatOpen ? (
        <FaTimes className="w-6 h-6" />
      ) : (
        <div className="relative">
          <FaComments className="w-6 h-6" />
          {totalUnread > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChatBubble;
