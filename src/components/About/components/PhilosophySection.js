import React from "react";
import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";

const PhilosophySection = () => {
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
        <FaBrain className="mr-3 text-4xl" />
        My Development Philosophy
      </motion.h2>
      <motion.div
        className="max-w-3xl mx-auto text-center bg-[var(--background-paper)] p-8 rounded-xl shadow-xl"
        variants={itemVariants}
      >
        <p className="text-lg sm:text-xl text-[var(--text-primary)] leading-relaxed italic">
          "I believe in crafting web solutions that are not only functional and robust but also
          intuitive and enjoyable to use. My approach centers on clean code, user-centric design,
          and a commitment to continuous learning to stay ahead in this ever-evolving tech
          landscape. Collaboration and problem-solving are at the heart of what I do, aiming to
          deliver value and make a positive impact through technology."
        </p>
      </motion.div>
    </section>
  );
};

export default PhilosophySection;
