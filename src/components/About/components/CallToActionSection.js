import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

const CallToActionSection = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)] text-center">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-6 text-[var(--text-primary)]"
        variants={itemVariants}
      >
        Ready to build something amazing together?
      </motion.h2>
      <motion.p
        className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto"
        variants={itemVariants}
      >
        I'm always excited to discuss new projects, creative ideas, or opportunities to collaborate.
        Let's connect and bring your vision to life!
      </motion.p>
      <motion.a
        href="mailto:saifuddinmonna@email.com"
        className="inline-flex items-center bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-main)] hover:from-[var(--primary-main)] hover:to-[var(--primary-main)] text-[var(--text-primary)] font-bold py-4 px-10 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 text-xl"
        variants={itemVariants}
      >
        <FaEnvelope className="mr-3" /> Let's Talk
      </motion.a>
    </section>
  );
};

export default CallToActionSection;
