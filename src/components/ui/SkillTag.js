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
      className="inline-block bg-[var(--background-paper)] backdrop-blur-sm text-[var(--text-primary)] px-3 py-1.5 rounded-lg m-1 text-sm font-medium border border-[var(--border-color)] hover:border-[var(--primary-main)] transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      {name.trim()}
    </motion.span>
  );
};

export default SkillTag;
