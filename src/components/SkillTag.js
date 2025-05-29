// src/components/SkillTag.js

import React from "react";
import { motion } from "framer-motion";

// Props: name (skill name), icon (optional)
const SkillTag = ({ name }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="inline-block bg-white/10 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg m-1 text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      {name.trim()}
    </motion.span>
  );
};

export default SkillTag;
