import React from "react";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";

const JourneySection = () => {
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
        <FaUserGraduate className="mr-3 text-4xl" />
        My Journey
      </motion.h2>
      <motion.div
        className="max-w-3xl mx-auto bg-[var(--background-paper)] p-6 sm:p-8 rounded-xl shadow-xl"
        variants={itemVariants}
      >
        <p className="text-lg text-[var(--text-primary)] leading-relaxed indent-8 mb-4">
          A MERN stack specialist, I thrive on building and deploying dynamic web applications, from
          single-page sites to complex e-commerce platforms. My passion for technology drives my
          rapid adaptability and eagerness to master new tools and techniques.
        </p>
        <p className="text-lg text-[var(--text-primary)] leading-relaxed indent-8">
          Originating from Mymensingh, Bangladesh, my academic journey culminated in a Master's in
          Public Administration. However, the allure of coding redirected my path. For several
          years, I've immersed myself in web development, transforming ideas into tangible digital
          experiences and tackling intricate challenges with enthusiasm. This dedication isn't just
          a career; it's a significant, evolving part of my life.
        </p>
      </motion.div>
    </section>
  );
};

export default JourneySection;
