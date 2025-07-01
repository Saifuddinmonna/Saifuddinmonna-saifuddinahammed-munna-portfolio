import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AdminMyProjectWorksManager = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Outlet />
    </motion.div>
  );
};

export default AdminMyProjectWorksManager;
