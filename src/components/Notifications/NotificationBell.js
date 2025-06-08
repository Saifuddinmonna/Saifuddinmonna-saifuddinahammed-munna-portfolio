import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell } from "react-icons/fa";
import { useSocket } from "../../context/SocketContext";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useSocket();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAsRead();
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleNotifications}
        className="relative p-2 text-[var(--text-primary)] hover:text-[var(--primary-main)] transition-colors"
      >
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-[var(--background-paper)] rounded-lg shadow-lg border border-[var(--border-main)] z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                Notifications
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-4">No notifications</p>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 border-b border-[var(--border-light)] last:border-0"
                    >
                      <p className="text-[var(--text-primary)]">{notification.message}</p>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
