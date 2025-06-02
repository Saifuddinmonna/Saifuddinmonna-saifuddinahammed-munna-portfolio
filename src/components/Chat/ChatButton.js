import React, { useState } from "react";
import { FaComments, FaTimes, FaMinus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import LiveChat from "./LiveChat";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaComments className="text-2xl" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className={`fixed bottom-4 right-4 w-96 ${
              isMinimized ? "h-16" : "h-[600px]"
            } bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300`}
          >
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <FaComments className="text-xl" />
                <h3 className="font-semibold">Live Chat</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:text-gray-200 transition-colors p-1"
                >
                  <FaMinus />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:text-gray-200 transition-colors p-1"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100%-3rem)]"
              >
                <LiveChat />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatButton;
