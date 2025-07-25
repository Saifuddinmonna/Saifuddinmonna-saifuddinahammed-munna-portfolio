import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaTools, FaLaptopCode } from "react-icons/fa";
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiRedux,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiTailwindcss,
  SiMysql,
} from "react-icons/si";
import { DiPostgresql } from "react-icons/di";
import { DiFirebase } from "react-icons/di";
import { TbBrandNextjs } from "react-icons/tb";
import { BsGit, BsGithub } from "react-icons/bs";

/**
 * ProfessionalProfile Component
 * Displays professional skills, expertise, and tools in an animated grid layout
 */
const ProfessionalProfile = () => {
  // Data for expertise section with icons and names
  const expertise = [
    { icon: <SiJavascript className="text-yellow-400" />, name: "JavaScript" },
    { icon: <SiReact className="text-blue-400" />, name: "ReactJS" },
    { icon: <SiNodedotjs className="text-green-500" />, name: "Node.js" },
    { icon: <SiMongodb className="text-green-600" />, name: "MongoDB" },
    { icon: <SiExpress className="text-[var(--text-primary)]" />, name: "Express.js" },
    { icon: <SiRedux className="text-purple-500" />, name: "Redux" },
    { icon: <SiHtml5 className="text-orange-500" />, name: "HTML5" },
    { icon: <SiCss3 className="text-blue-500" />, name: "CSS3" },
    { icon: <SiBootstrap className="text-purple-600" />, name: "Bootstrap-5" },
    { icon: <SiTailwindcss className="text-cyan-500" />, name: "Tailwind CSS" },
  ];

  // Data for comfortable technologies section
  const comfortable = [
    { icon: <DiPostgresql className="text-blue-600" />, name: "PostgreSQL" },
    { icon: <SiMysql className="text-blue-600" />, name: "SQL" },
    { icon: <DiFirebase className="text-orange-500" />, name: "Firebase" },
    { icon: <TbBrandNextjs className="text-[var(--text-primary)]" />, name: "Next.js" },
    { icon: <BsGit className="text-orange-600" />, name: "Git" },
    { icon: <BsGithub className="text-[var(--text-primary)]" />, name: "GitHub" },
  ];

  // List of development tools
  const tools = [
    "VS Code",
    "Chrome Dev Tools",
    "Netlify",
    "Postman",
    "Figma",
    "Photoshop",
    "Illustrator",
  ];

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Professional Summary Section */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
            Professional Summary
          </h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
            I want to be an experienced and skilful Web Developer to build up a career as a Full
            Stack Web Developer. I also have a special interest to develop NPM packages to build
            more efficient and effective user experience both front end and back-end.
          </p>
        </motion.div>

        {/* Expertise Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center mb-6">
            <FaCode className="text-3xl text-[var(--primary-main)] dark:text-[var(--primary-light)] mr-3" />
            <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Expertise</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {expertise.map((skill, index) => (
              <motion.div
                key={index}
                className="flex items-center p-3 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border-color)]"
                whileHover={{ scale: 1.05 }}
                variants={itemVariants}
              >
                <span className="text-xl md:text-2xl mr-2">{skill.icon}</span>
                <span className="text-sm md:text-base text-[var(--text-primary)]">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comfortable Technologies Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center mb-6">
            <FaLaptopCode className="text-3xl text-[var(--success-main)] dark:text-[var(--success-light)] mr-3" />
            <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
              Comfortable With
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {comfortable.map((skill, index) => (
              <motion.div
                key={index}
                className="flex items-center p-3 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border-color)]"
                whileHover={{ scale: 1.05 }}
                variants={itemVariants}
              >
                <span className="text-xl md:text-2xl mr-2">{skill.icon}</span>
                <span className="text-sm md:text-base text-[var(--text-primary)]">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center mb-6">
            <FaTools className="text-3xl text-[var(--secondary-main)] dark:text-[var(--secondary-light)] mr-3" />
            <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Tools</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                className="p-3 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border-color)] text-center"
                whileHover={{ scale: 1.05 }}
                variants={itemVariants}
              >
                <span className="text-sm md:text-base text-[var(--text-primary)]">{tool}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfessionalProfile;
