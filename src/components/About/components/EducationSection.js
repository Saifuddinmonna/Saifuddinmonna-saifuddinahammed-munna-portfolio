import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaStar } from "react-icons/fa";

const EducationSection = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const education = [
    {
      degree: "MSS (Public Administration)",
      institution: "Jatiya Kabi Kazi Nazrul Islam University (JKKNIU)",
      result: "1st Class (3.35)",
      year: "2017",
    },
    {
      degree: "BSS (Public Administration)",
      institution: "JKKNIU",
      result: "1st Class (3.26)",
      year: "2015",
    },
    {
      degree: "H.S.C (Humanities)",
      institution: "Dhaka Education Board",
      result: "GPA 5.00",
      year: "2010",
    },
    {
      degree: "S.S.C (Science)",
      institution: "Dhaka Education Board",
      result: "GPA 5.00",
      year: "2008",
    },
  ];

  const certifications = [
    {
      name: "Certified Web Development",
      from: "Programming Hero, Bangladesh",
      icon: <FaStar className="text-[var(--primary-main)]" />,
    },
    {
      name: "Computer Technology Coursework",
      from: "Relevant Academic Study",
      icon: <FaGraduationCap className="text-[var(--primary-main)]" />,
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <FaGraduationCap className="mr-3 text-4xl" />
        Education & Certifications
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
            Academic Qualifications
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.75rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent via-[var(--background-paper)] to-transparent">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                className="relative flex items-start group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="absolute left-5 -translate-x-1/2 transform md:left-[8.75rem] top-1.5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--primary-main)] bg-[var(--background-paper)] group-hover:bg-[var(--primary-main)] transition-colors duration-300">
                    <FaGraduationCap
                      className="text-[var(--primary-main)] group-hover:text-[var(--text-primary)] transition-colors duration-300"
                      size={20}
                    />
                  </div>
                </div>
                <div className="ml-10 md:ml-44 p-4 bg-[var(--background-paper)] rounded-lg shadow-lg w-full">
                  <h4 className="text-lg sm:text-xl font-semibold text-[var(--primary-main)]">
                    {edu.degree}
                  </h4>
                  <p className="text-md text-[var(--text-secondary)]">{edu.institution}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {edu.result} ({edu.year})
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
            Key Certifications
          </h3>
          <ul className="space-y-4">
            {certifications.map((cert, index) => (
              <motion.li
                key={index}
                className="flex items-start p-4 bg-[var(--background-paper)] rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="mr-4 text-2xl text-[var(--primary-main)] shrink-0">{cert.icon}</div>
                <div>
                  <h4 className="text-lg font-medium text-[var(--text-primary)]">{cert.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{cert.from}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;
