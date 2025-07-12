import React from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaCogs } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiJest, SiDocker } from "react-icons/si";

const VisionSection = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const whatImLearning = [
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-[var(--primary-main)]" />,
      reason: "For robust, scalable applications and improved developer experience.",
    },
    {
      name: "Advanced Next.js Features",
      icon: <SiNextdotjs className="text-[var(--text-primary)]" />,
      reason: "To leverage server components, edge functions, and optimize performance.",
    },
    {
      name: "Testing (Jest, Cypress)",
      icon: <SiJest className="text-[var(--primary-main)]" />,
      reason: "To ensure code quality and reliability in larger projects.",
    },
    {
      name: "Docker & Basic DevOps",
      icon: <SiDocker className="text-[var(--primary-main)]" />,
      reason: "For containerization and streamlined deployment workflows.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          variants={itemVariants}
          className="bg-[var(--background-paper)] p-6 sm:p-8 rounded-xl shadow-xl"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <FaBullseye className="mr-3 text-4xl" />
            My Vision
          </motion.h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed text-center italic mb-6">
            "My ultimate goal is to become a highly proficient web developer and contribute
            meaningfully to the open-source community, particularly by building optimized NPM
            packages for React. I believe in the power of shared knowledge and aim to create tools
            that simplify and enhance the development experience for others."
          </p>
          <div className="text-center text-2xl text-[var(--primary-main)] mt-4">
            ~ Saifuddin Ahammed Monna ~
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[var(--background-paper)] p-6 sm:p-8 rounded-xl shadow-xl"
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <FaCogs className="mr-3 text-4xl" />
            Current Learning & Future Focus
          </motion.h2>
          <ul className="space-y-4">
            {whatImLearning.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start p-3 bg-[var(--background-paper)] rounded-lg shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mr-3 text-2xl text-[var(--primary-main)] shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">{item.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{item.reason}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
