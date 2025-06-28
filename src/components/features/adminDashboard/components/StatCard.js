import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--background-paper)] rounded-lg p-6 shadow-lg border border-[var(--border-main)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
