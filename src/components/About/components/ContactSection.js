import React from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaLanguage,
  FaStar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaMobileAlt,
} from "react-icons/fa";

const ContactSection = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <FaLightbulb className="mr-3 text-4xl" />
        Connect & Know More
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div
          variants={itemVariants}
          className="bg-[var(--background-paper)] p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-[var(--primary-main)] mb-3 flex items-center">
            <FaLanguage className="mr-2" /> Languages
          </h3>
          <ul className="list-disc list-inside ml-4 text-[var(--text-secondary)]">
            <li>Bangla (Native)</li>
            <li>English (Proficient)</li>
          </ul>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-[var(--background-paper)] p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-[var(--primary-main)] mb-3 flex items-center">
            <FaStar className="mr-2" /> Key Strengths
          </h3>
          <ul className="list-disc list-inside ml-4 text-[var(--text-secondary)] grid grid-cols-1 sm:grid-cols-2 gap-x-2">
            <li>Analytical Thinking</li>
            <li>Problem Solving</li>
            <li>Adaptability</li>
            <li>Team Collaboration</li>
            <li>Continuous Learning</li>
          </ul>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-[var(--background-paper)] p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-1"
        >
          <h3 className="text-xl font-semibold text-[var(--primary-main)] mb-3 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Contact Information
          </h3>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li className="flex items-center">
              <FaEnvelope className="mr-3 text-[var(--primary-main)]" />{" "}
              <a
                href="mailto:saifuddinmonna@email.com"
                className="hover:text-[var(--primary-main)]"
              >
                saifuddinmonna@email.com
              </a>
            </li>
            <li className="flex items-center">
              <FaMobileAlt className="mr-3 text-[var(--primary-main)]" /> +8801623361191
            </li>
            <li className="flex items-center">
              <FaMapMarkerAlt className="mr-3 text-[var(--primary-main)]" /> Mymensingh, Bangladesh
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
